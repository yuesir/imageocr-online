-- Server-only billing. Apply before enabling the new application.
begin;
create table public.billing_wallets (
 user_id uuid primary key references auth.users(id) on delete cascade,
 balance integer not null default 0
);
create table public.billing_daily (
 actor text not null, day date not null, used integer not null default 0 check (used >= 0),
 primary key(actor, day)
);
create table public.billing_requests (
 actor text not null, request_id text not null, user_id uuid references auth.users(id) on delete cascade,
 fingerprint text not null, day date not null, source text not null check(source in ('free','paid')),
 state text not null check(state in ('pending','completed','failed')), response jsonb,
 created_at timestamptz not null default now(), primary key(actor,request_id)
);
create table public.billing_orders (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id),
 package_id text not null check(package_id in ('starter','plus','max')),
 amount integer not null, credits integer not null, product_id text not null,
 checkout_id text unique, provider_order_id text unique,
 status text not null default 'pending' check(status in ('pending','paid','refunded')),
 refunded_amount integer not null default 0, revoked_credits integer not null default 0,
 created_at timestamptz not null default now(), paid_at timestamptz
);
create table public.billing_ledger (
 id bigint generated always as identity primary key, user_id uuid not null references auth.users(id),
 delta integer not null, reason text not null, reference text not null,
 created_at timestamptz not null default now(), unique(user_id,reason,reference)
);
create table public.billing_events (
 id text primary key, event_type text not null, created_at timestamptz not null default now()
);
-- No browser writes or RPC access. Never use an anonymous client here.
alter table public.billing_wallets enable row level security;
alter table public.billing_daily enable row level security;
alter table public.billing_requests enable row level security;
alter table public.billing_orders enable row level security;
alter table public.billing_ledger enable row level security;
alter table public.billing_events enable row level security;

create function public.billing_balance(p_actor text,p_guest text,p_user uuid) returns jsonb
language plpgsql security definer set search_path=public as $$
declare d date := (now() at time zone 'UTC')::date; n integer; g integer; b integer;
begin
 select coalesce(max(used),0) into n from billing_daily where actor=p_actor and day=d;
 select coalesce(max(used),0) into g from billing_daily where actor=p_guest and day=d;
 select balance into b from billing_wallets where user_id=p_user;
 return jsonb_build_object('freeRemaining',greatest(0,(case when p_user is null then 2 else 4 end)-greatest(n,g)), 'paidRemaining',greatest(0,coalesce(b,0)), 'refundedDebt',greatest(0,-coalesce(b,0)), 'resetsAt',((d+1)::text||'T00:00:00Z'));
end $$;

create function public.billing_reserve(p_actor text,p_guest text,p_user uuid,p_id text,p_fingerprint text) returns jsonb
language plpgsql security definer set search_path=public as $$
declare r billing_requests; d date := (now() at time zone 'UTC')::date; n integer; g integer; b integer; s text;
begin
 -- A short global transaction lock serializes wallet/quota mutations, including
 -- guest-to-account transitions. Provider network calls occur outside the lock.
 perform pg_advisory_xact_lock(72611016);
 select * into r from billing_requests where actor=p_actor and request_id=p_id;
 if found then
   if r.fingerprint<>p_fingerprint then return '{"kind":"conflict"}'; end if;
   if r.state='completed' then return jsonb_build_object('kind','replay','response',r.response); end if;
   if r.state='pending' then return '{"kind":"pending"}'; end if;
 end if;
 insert into billing_daily(actor,day) values(p_actor,d) on conflict do nothing;
 select used into n from billing_daily where actor=p_actor and day=d;
 select coalesce(max(used),0) into g from billing_daily where actor=p_guest and day=d;
 -- Guest usage is a floor, not an extra allowance after signing in.
 n := greatest(n,g);
 update billing_daily set used=n where actor=p_actor and day=d;
 if n < (case when p_user is null then 2 else 4 end) then
   s:='free'; update billing_daily set used=used+1 where actor=p_actor and day=d;
 else
   if p_user is null then return '{"kind":"exhausted"}'; end if;
   insert into billing_wallets(user_id) values(p_user) on conflict do nothing;
   select balance into b from billing_wallets where user_id=p_user;
   if b<=0 then return '{"kind":"exhausted"}'; end if;
   s:='paid'; update billing_wallets set balance=balance-1 where user_id=p_user;
 end if;
 insert into billing_requests(actor,request_id,user_id,fingerprint,day,source,state)
 values(p_actor,p_id,p_user,p_fingerprint,d,s,'pending')
 on conflict(actor,request_id) do update set day=d,source=s,state='pending',response=null;
 return '{"kind":"reserved"}';
end $$;

create function public.billing_finish(p_actor text,p_id text,p_success boolean,p_response jsonb) returns void
language plpgsql security definer set search_path=public as $$
declare r billing_requests;
begin
 perform pg_advisory_xact_lock(72611016);
 select * into r from billing_requests where actor=p_actor and request_id=p_id;
 if not found or r.state<>'pending' then return; end if;
 if not p_success then
   if r.source='free' then update billing_daily set used=greatest(0,used-1) where actor=p_actor and day=r.day;
   else update billing_wallets set balance=balance+1 where user_id=r.user_id; end if;
 elsif r.source='paid' then
   insert into billing_ledger(user_id,delta,reason,reference) values(r.user_id,-1,'ocr',p_actor||':'||p_id);
 end if;
 update billing_requests set state=case when p_success then 'completed' else 'failed' end,response=p_response where actor=p_actor and request_id=p_id;
end $$;

create function public.billing_payment(p_event text,p_type text,p_local_id uuid,p_provider_order text,p_checkout text,p_product text,p_amount integer,p_currency text,p_refunded integer default 0) returns void
language plpgsql security definer set search_path=public as $$
declare o billing_orders; revoke_count integer;
begin
 perform pg_advisory_xact_lock(72611016);
 if p_event is null or p_provider_order is null then raise exception 'Missing payment identifiers'; end if;
 if exists(select 1 from billing_events where id=p_event) then return; end if;
 if p_type='checkout.completed' then
   select * into o from billing_orders where id=p_local_id;
 else
   select * into o from billing_orders where provider_order_id=p_provider_order;
 end if;
 if not found then raise exception 'Order not found; retry delivery'; end if;
 if p_currency is distinct from 'USD' or p_amount is distinct from o.amount then raise exception 'Order amount/currency mismatch'; end if;
 insert into billing_wallets(user_id) values(o.user_id) on conflict do nothing;
 if p_type='checkout.completed' then
   if p_product is distinct from o.product_id then raise exception 'Product mismatch'; end if;
   if o.status='pending' then
     update billing_orders set status='paid',provider_order_id=p_provider_order,checkout_id=p_checkout,paid_at=now() where id=o.id;
     update billing_wallets set balance=balance+o.credits where user_id=o.user_id;
     insert into billing_ledger(user_id,delta,reason,reference) values(o.user_id,o.credits,'purchase',o.id::text);
   elsif o.provider_order_id is distinct from p_provider_order then raise exception 'Provider order mismatch'; end if;
 elsif p_type='refund.created' then
   if p_refunded is null or p_refunded<0 or p_refunded>p_amount then raise exception 'Invalid refund amount'; end if;
   -- Cumulative refund amount makes manual resends and reordered partial refunds
   -- idempotent. Allow debt if already spent; future purchases repay that debt.
   revoke_count:=ceil(o.credits::numeric*greatest(o.refunded_amount,p_refunded)/o.amount)::integer;
   if revoke_count>o.revoked_credits then
     update billing_wallets set balance=balance-(revoke_count-o.revoked_credits) where user_id=o.user_id;
     insert into billing_ledger(user_id,delta,reason,reference) values(o.user_id,-(revoke_count-o.revoked_credits),'refund',p_event);
     update billing_orders set revoked_credits=revoke_count,refunded_amount=p_refunded,status=case when p_refunded=p_amount then 'refunded' else 'paid' end where id=o.id;
   end if;
 else raise exception 'Unsupported payment event'; end if;
 insert into billing_events(id,event_type) values(p_event,p_type);
end $$;

revoke all on function public.billing_balance(text,text,uuid) from public,anon,authenticated;
revoke all on function public.billing_reserve(text,text,uuid,text,text) from public,anon,authenticated;
revoke all on function public.billing_finish(text,text,boolean,jsonb) from public,anon,authenticated;
revoke all on function public.billing_payment(text,text,uuid,text,text,text,integer,text,integer) from public,anon,authenticated;
grant execute on function public.billing_balance(text,text,uuid),public.billing_reserve(text,text,uuid,text,text),public.billing_finish(text,text,boolean,jsonb),public.billing_payment(text,text,uuid,text,text,text,integer,text,integer) to service_role;
grant all on public.billing_wallets,public.billing_daily,public.billing_requests,public.billing_orders,public.billing_ledger,public.billing_events to service_role;
grant usage,select on sequence public.billing_ledger_id_seq to service_role;
commit;

begin;
create index billing_requests_pending_actor on public.billing_requests(actor) where state='pending';

-- Entitlement survives spending the pack. A full refund removes it unless another
-- successfully paid, not fully refunded purchase remains on the account.
create function public.billing_concurrency_limit(p_user uuid) returns integer
language sql stable security definer set search_path=public as $$
 select case when p_user is not null and exists(
   select 1 from billing_orders where user_id=p_user and status='paid'
   and paid_at is not null
 ) then 3 else 1 end;
$$;
revoke all on function public.billing_concurrency_limit(uuid) from public,anon,authenticated;
grant execute on function public.billing_concurrency_limit(uuid) to service_role;

create or replace function public.billing_balance(p_actor text,p_guest text,p_user uuid) returns jsonb
language plpgsql security definer set search_path=public as $$
declare d date := (now() at time zone 'UTC')::date; n integer; g integer; b integer;
begin
 select coalesce(max(used),0) into n from billing_daily where actor=p_actor and day=d;
 select coalesce(max(used),0) into g from billing_daily where actor=p_guest and day=d;
 select balance into b from billing_wallets where user_id=p_user;
 return jsonb_build_object('concurrencyLimit',billing_concurrency_limit(p_user), 'activeRequests',(select count(*) from billing_requests where actor=p_actor and state='pending'), 'freeRemaining',greatest(0,(case when p_user is null then 2 else 4 end)-greatest(n,g)), 'paidRemaining',greatest(0,coalesce(b,0)), 'refundedDebt',greatest(0,-coalesce(b,0)), 'resetsAt',((d+1)::text||'T00:00:00Z'));
end $$;

create or replace function public.billing_reserve(p_actor text,p_guest text,p_user uuid,p_id text,p_fingerprint text) returns jsonb
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
 if (select count(*) from billing_requests where actor=p_actor and state='pending') >= billing_concurrency_limit(p_user) then
   return jsonb_build_object('kind','busy','concurrencyLimit',billing_concurrency_limit(p_user));
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

commit;

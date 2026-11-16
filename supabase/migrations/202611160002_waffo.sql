begin;
-- Keep existing orders explicitly attributed to their original provider.
alter table public.billing_orders add column provider text not null default 'creem' check(provider in ('creem','waffo'));
alter table public.billing_orders add column provider_mode text check(provider_mode in ('test','prod'));
alter table public.billing_orders add column provider_store_id text;
alter table public.billing_orders add column charged_amount integer;
create table public.billing_waffo_inbox (
 id text primary key, event_id text not null, event_type text not null,
 store_id text not null, mode text not null check(mode in ('test','prod')),
 payload jsonb not null, processed_at timestamptz, attempts integer not null default 0,
 last_error text, created_at timestamptz not null default now(),
 unique(store_id,mode,event_type,event_id)
);
alter table public.billing_waffo_inbox enable row level security;
grant all on public.billing_waffo_inbox to service_role;

create function public.billing_waffo_apply(p_delivery text,p_local_id uuid,p_user uuid,p_provider_order text,p_product text,p_amount integer,p_charged integer,p_refunded integer) returns void
language plpgsql security definer set search_path=public as $$
declare e billing_waffo_inbox; o billing_orders; revoked integer; refunded integer;
begin
 perform pg_advisory_xact_lock(72611016);
 select * into e from billing_waffo_inbox where id=p_delivery;
 if not found then raise exception 'Waffo inbox record missing'; end if;
 if e.processed_at is not null then return; end if;
 select * into o from billing_orders where id=p_local_id;
 if not found then raise exception 'Local order missing'; end if;
 if o.provider<>'waffo' or o.provider_mode is distinct from e.mode or o.provider_store_id is distinct from e.store_id then raise exception 'Provider/store/environment mismatch'; end if;
 if p_user is distinct from o.user_id or p_product is distinct from o.product_id or p_amount is distinct from o.amount then raise exception 'Order owner/product/price mismatch'; end if;
 if p_provider_order is null or p_charged is null or p_charged<o.amount then raise exception 'Invalid payment amount'; end if;
 if o.provider_order_id is not null and o.provider_order_id<>p_provider_order then raise exception 'Provider order mismatch'; end if;
 insert into billing_wallets(user_id) values(o.user_id) on conflict do nothing;
 if e.event_type='order.completed' then
   if o.status='pending' then
     update billing_orders set status='paid',provider_order_id=p_provider_order,charged_amount=p_charged,paid_at=now() where id=o.id;
     update billing_wallets set balance=balance+o.credits where user_id=o.user_id;
     insert into billing_ledger(user_id,delta,reason,reference) values(o.user_id,o.credits,'purchase',o.id::text);
   elsif o.charged_amount is distinct from p_charged then raise exception 'Payment changed'; end if;
 elsif e.event_type='refund.succeeded' then
   if o.status='pending' then raise exception 'Refund arrived before payment; retry'; end if;
   if p_charged is distinct from o.charged_amount or p_refunded is null or p_refunded<=0 or o.refunded_amount+p_refunded>p_charged then raise exception 'Invalid cumulative refund'; end if;
   refunded:=o.refunded_amount+p_refunded;
   revoked:=ceil(o.credits::numeric*refunded/p_charged)::integer;
   if revoked>o.revoked_credits then
     update billing_wallets set balance=balance-(revoked-o.revoked_credits) where user_id=o.user_id;
     insert into billing_ledger(user_id,delta,reason,reference) values(o.user_id,-(revoked-o.revoked_credits),'refund','waffo:'||e.id);
   end if;
   update billing_orders set revoked_credits=revoked,refunded_amount=refunded,status=case when refunded=p_charged then 'refunded' else 'paid' end where id=o.id;
 else raise exception 'Unsupported Waffo event'; end if;
 update billing_waffo_inbox set processed_at=now(),last_error=null where id=e.id;
end $$;
revoke all on function public.billing_waffo_apply(text,uuid,uuid,text,text,integer,integer,integer) from public,anon,authenticated;
grant execute on function public.billing_waffo_apply(text,uuid,uuid,text,text,integer,integer,integer) to service_role;
commit;

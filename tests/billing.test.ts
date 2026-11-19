import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { generateKeyPairSync, sign } from 'node:crypto'
import { PGlite } from '@electric-sql/pglite'
import { PACKAGES, findPackage } from '../lib/billing/catalog'
import { usdCents, verifiedWaffoEvent } from '../lib/billing/waffo'
import type { WebhookEvent } from '@waffo/pancake-ts'

test('catalog and strict USD display-amount boundary', () => {
  assert.deepEqual(PACKAGES.map(p => [p.cents, p.credits]), [[599,100],[999,300],[1999,800]])
  assert.equal(findPackage('monthly'), undefined)
  assert.equal(usdCents('5.99'),599)
  assert.equal(usdCents('9.99'),999)
  assert.equal(usdCents('19.99'),1999)
  for (const invalid of [999,'1e2','-1','9.999',null,'NaN']) assert.throws(()=>usdCents(invalid))
})

test('actual PostgreSQL billing transactions', async t => {
  const db = new PGlite()
  await db.exec(`create schema auth; create table auth.users(id uuid primary key); create role anon; create role authenticated; create role service_role;`)
  for (const migration of ['202611160001_billing.sql','202611160003_ocr_concurrency.sql','202611190001_ocr_daily_limits.sql']) {
    await db.exec(await readFile(new URL('../supabase/migrations/'+migration,import.meta.url),'utf8'))
  }
  const u = '11111111-1111-4111-8111-111111111111'
  await db.query('insert into auth.users(id) values($1)',[u])
  const actor = `user:${u}`
  const reserve = async (a: string, guest: string, id: string, fingerprint = id) => (await db.query<{r: {kind: string; response?: unknown}}>('select billing_reserve($1,$2,$3,$4,$5) r',[a,guest,a.startsWith('user:') ? u : null,id,fingerprint])).rows[0].r
  const finish = (a:string,id:string,ok:boolean) => db.query('select billing_finish($1,$2,$3,$4)',[a,id,ok,ok ? {success:true,result:{text:''}} : null])
  const balance = async (a = actor,guest = 'guest:a') => (await db.query<{r:{freeRemaining:number;paidRemaining:number;refundedDebt:number}}>('select billing_balance($1,$2,$3) r',[a,guest,a.startsWith('user:') ? u : null])).rows[0].r
  const scalar = async (sql:string) => Object.values((await db.query<Record<string, unknown>>(sql)).rows[0])[0]
  try {
    await t.test('guests get 1; pending prevents concurrent overrun; failure releases',async () => {
      assert.equal((await balance('guest:a')).freeRemaining,1)
      assert.equal((await reserve('guest:a','guest:a','guest0001')).kind,'reserved')
      assert.equal((await reserve('guest:a','guest:a','guest0001')).kind,'pending')
      assert.equal((await reserve('guest:a','guest:a','guest0001','different')).kind,'conflict')
      assert.equal((await reserve('guest:a','guest:a','guest0002')).kind,'busy')
      await finish('guest:a','guest0001',false)
      assert.equal((await balance('guest:a')).freeRemaining,1)
      assert.equal((await reserve('guest:a','guest:a','guest0001')).kind,'reserved')
      await finish('guest:a','guest0001',true)
      assert.equal((await reserve('guest:a','guest:a','guest0001')).kind,'replay')
      assert.equal((await reserve('guest:a','guest:a','guest0002')).kind,'exhausted')
      assert.equal((await balance('guest:a')).freeRemaining,0)
    })
    await t.test('login includes guest use; free first; signed-in cap 2',async () => {
      assert.equal((await balance(actor,'guest:unused')).freeRemaining,2)
      assert.equal((await balance()).freeRemaining,1)
      assert.equal((await reserve(actor,'guest:a','user0001')).kind,'reserved')
      await finish(actor,'user0001',true)
      assert.equal((await reserve(actor,'guest:a','user0002')).kind,'exhausted')
      assert.equal((await balance()).freeRemaining,0)
    })
    const order = '22222222-2222-4222-8222-222222222222'
    await db.query('insert into billing_orders(id,user_id,package_id,amount,credits,product_id) values($1,$2,$3,999,300,$4)',[order,u,'plus','prod_plus'])
    const payment = (event:string,type='checkout.completed',refunded=0, amount=999, product:string|null='prod_plus') => db.query('select billing_payment($1,$2,$3,$4,$5,$6,$7,$8,$9)',[event,type,type==='checkout.completed'? order:null,'ord_plus','ch_plus',product,amount,'USD',refunded])
    await t.test('refund-before-completion and wrong prices/products fail closed',async () => {
      await assert.rejects(payment('early','refund.created',999))
      await assert.rejects(payment('wrong_amount','checkout.completed',0,599))
      await assert.rejects(payment('wrong_product','checkout.completed',0,999,'prod_starter'))
      await assert.rejects(payment('missing_product','checkout.completed',0,999,null))
      assert.equal((await balance()).paidRemaining,0)
    })
    await t.test('duplicate or manually resent purchases credit only once',async () => {
      await payment('paid1'); await payment('paid1'); await payment('paid_manual')
      assert.equal((await balance()).paidRemaining,300)
      assert.equal(await scalar("select count(*) from billing_ledger where reason='purchase'"),1)
    })
    await t.test('paid reservation/failure/empty success/replay settle once',async () => {
      assert.equal((await reserve(actor,'guest:a','paid0001')).kind,'reserved')
      assert.equal((await balance()).paidRemaining,299)
      await finish(actor,'paid0001',false); await finish(actor,'paid0001',false)
      assert.equal((await balance()).paidRemaining,300)
      await reserve(actor,'guest:a','paid0001'); await finish(actor,'paid0001',true); await finish(actor,'paid0001',true)
      assert.equal((await balance()).paidRemaining,299)
      const replay=await reserve(actor,'guest:a','paid0001')
      assert.equal(replay.kind,'replay'); assert.deepEqual(replay.response,{success:true,result:{text:''}})
      assert.equal(await scalar("select count(*) from billing_ledger where reason='ocr'"),1)
    })
    await t.test('partial/full/refund retries reclaim proportionally, including debt',async () => {
      await payment('refund1','refund.created',333)
      assert.equal((await balance()).paidRemaining,199)
      await payment('refund1','refund.created',333); await payment('refund_manual','refund.created',333)
      assert.equal((await balance()).paidRemaining,199)
      await payment('refund2','refund.created',999)
      assert.equal((await balance()).paidRemaining,0)
      assert.equal((await balance()).refundedDebt,1)
      await payment('paid_late')
      assert.equal((await balance()).refundedDebt,1)
      assert.equal(await scalar("select status from billing_orders"),'refunded')
    })
    await t.test('UTC rollover resets free quota and preserves wallet',async () => {
      await db.exec("update billing_daily set day=day-1")
      assert.equal((await balance()).freeRemaining,2)
      assert.equal((await balance()).refundedDebt,1)
      await reserve(actor,'guest:a','newday01'); await finish(actor,'newday01',true)
      assert.equal((await balance()).freeRemaining,1)
    })
    await t.test('overlapping reservations cannot spend a single purchased image twice',async () => {
      await db.query('update billing_daily set used=2 where actor=$1',[actor])
      await db.query("insert into billing_orders(id,user_id,package_id,amount,credits,product_id,status,paid_at) values($1,$2,'plus',999,300,'prod_plus','paid',now())", ['33333333-3333-4333-8333-333333333333',u])
      await db.query('update billing_wallets set balance=1 where user_id=$1',[u])
      const attempts=await Promise.all(Array.from({length:8},(_,i)=>reserve(actor,'guest:a',`parallel${i}`)))
      assert.equal(attempts.filter(r=>r.kind==='reserved').length,1)
      assert.equal(attempts.filter(r=>r.kind==='exhausted').length,7)
      await finish(actor,'parallel0',false)
    })
    await t.test('anonymous/authenticated SQL roles cannot mint credits or call RPCs',async () => {
      const result=await db.query<{allowed:boolean}>("select has_function_privilege('authenticated','billing_reserve(text,text,uuid,text,text)','EXECUTE') allowed")
      assert.equal(result.rows[0].allowed,false)
      await db.exec('set role anon')
      await assert.rejects(db.exec("select billing_balance('guest:a','guest:a',null)"))
      await assert.rejects(db.exec('select * from billing_wallets'))
      await db.exec('reset role')
    })
  } finally { await db.close() }
})

test('OCR route boundary reserves/releases, replays and fails closed', async () => {
  const { NextRequest, NextResponse } = await import('next/server')
  const { meteredOCR } = await import('../lib/billing/ocr')
  const originalFetch = globalThis.fetch
  const oldUrl=process.env.NEXT_PUBLIC_SUPABASE_URL, oldKey=process.env.SUPABASE_SERVICE_ROLE_KEY
  process.env.NEXT_PUBLIC_SUPABASE_URL='https://billing-test.invalid'
  process.env.SUPABASE_SERVICE_ROLE_KEY='test-server-key'
  let reservation: Record<string,unknown>={kind:'reserved'}
  const calls: {name:string;body:Record<string,unknown>}[]=[]
  let unavailable=false
  let storageErrorCode = ''
  globalThis.fetch = async (input, init) => {
    const request=input instanceof Request ? input : new Request(input,init)
    if (!request.url.startsWith('https://billing-test.invalid/')) throw new Error('Unexpected network call in test')
    const name=request.url.split('/').pop()!
    if (request.url.endsWith('/auth/v1/user')) return new Response(JSON.stringify({id:'11111111-1111-4111-8111-111111111111',email:'member@example.test'}),{headers:{'Content-Type':'application/json'}})
    if (unavailable) return new Response(JSON.stringify({message:'unavailable',code:storageErrorCode}),{status:503,headers:{'Content-Type':'application/json'}})
    calls.push({name,body:await request.json()})
    return new Response(JSON.stringify(name==='billing_reserve' ? reservation : null),{headers:{'Content-Type':'application/json'}})
  }
  let invocations=0
  let success=true
  const handler=meteredOCR(async () => { invocations++; return NextResponse.json(success ? {success:true,result:{text:''}} : {error:'Provider failed'},{status:success?200:502}) })
  const req=(authenticated=false)=>new NextRequest('https://site.test/api/ocr/ali_vl',{method:'POST',headers:{'Idempotency-Key':'test-image-001','Content-Type':'application/json',...(authenticated ? {Authorization:'Bearer fixture-token'} : {})},body:JSON.stringify({imageBase64:'data:image/png;base64,AA=='})})
  try {
    assert.equal((await handler(req())).status,200)
    assert.equal(calls.at(-1)?.body.p_success,true)
    reservation={kind:'replay',response:{success:true,result:{text:''}}}
    assert.equal((await handler(req())).status,200)
    assert.equal(invocations,1)
    reservation={kind:'exhausted'}
    const guestExhausted = await handler(req())
    assert.equal(guestExhausted.status,402)
    const guestMessage = await guestExhausted.json()
    assert.equal(guestMessage.errorCode,'IMAGE_ALLOWANCE_EXHAUSTED')
    assert.match(guestMessage.message,/1 free image.*2 free images/)
    assert.match(guestMessage.loginUrl,/^\/login/)
    assert.equal(guestMessage.pricingUrl,'/pricing')
    const memberExhausted = await handler(req(true))
    const memberMessage = await memberExhausted.json()
    assert.equal(memberExhausted.status,402)
    assert.match(memberMessage.message,/00:00 UTC for 2 free images/)
    assert.equal(memberMessage.loginUrl,undefined)
    assert.equal(memberMessage.pricingUrl,'/pricing')
    reservation={kind:'busy',concurrencyLimit:3}
    const busy=await handler(req(true))
    assert.equal(busy.status,429)
    assert.equal(busy.headers.get('Retry-After'),'2')
    assert.equal((await busy.json()).errorCode,'OCR_CONCURRENCY_LIMIT')
    assert.equal(invocations,1)
    reservation={kind:'reserved'};success=false
    assert.equal((await handler(req())).status,502)
    assert.equal(calls.at(-1)?.body.p_success,false)
    unavailable=true
    const outage = await handler(req())
    assert.equal(outage.status,503)
    const outageMessage = await outage.json()
    assert.equal(outageMessage.errorCode,'ALLOWANCE_UNAVAILABLE')
    assert.equal(outageMessage.loginUrl,undefined)
    assert.doesNotMatch(outageMessage.message,/Billing/)
    storageErrorCode='PGRST202'
    const missingMigration = await handler(req())
    assert.equal((await missingMigration.json()).errorCode,'ALLOWANCE_MIGRATION_REQUIRED')
    assert.equal(invocations,2)
  } finally {
    globalThis.fetch=originalFetch
    if (oldUrl===undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL; else process.env.NEXT_PUBLIC_SUPABASE_URL=oldUrl
    if (oldKey===undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY=oldKey
  }
})

const fixtureKeys=generateKeyPairSync('rsa',{modulusLength:2048,privateKeyEncoding:{type:'pkcs8',format:'pem'},publicKeyEncoding:{type:'spki',format:'pem'}})
const TEST_USER='11111111-1111-4111-8111-111111111111'
const TEST_LOCAL='22222222-2222-4222-8222-222222222222'
const TEST_STORE='STO_4uOBdljErxd4STR1n3ehKJ'
function testEnvironment() {
  const values={WAFFO_MERCHANT_ID:'MER_43OKW9eWvpvqc1s4Y8txgV',WAFFO_STORE_ID:TEST_STORE,WAFFO_ENVIRONMENT:'test',WAFFO_PRIVATE_KEY:fixtureKeys.privateKey,WAFFO_WEBHOOK_TEST_PUBLIC_KEY:fixtureKeys.publicKey,WAFFO_PRODUCT_STARTER:'PROD_1111111111111111111111',WAFFO_PRODUCT_PLUS:'PROD_2222222222222222222222',WAFFO_PRODUCT_MAX:'PROD_3333333333333333333333',NEXT_PUBLIC_SUPABASE_URL:'https://billing-test.invalid',SUPABASE_SERVICE_ROLE_KEY:'test-key',NEXT_PUBLIC_SITE_URL:'https://site.test',BILLING_ENABLED:'true'}
  const old=Object.fromEntries(Object.keys(values).map(k=>[k,process.env[k]]))
  Object.assign(process.env,values)
  return ()=>{for(const [k,v] of Object.entries(old)){if(v===undefined)delete process.env[k];else process.env[k]=v}}
}
function fixture(eventType='order.completed'): WebhookEvent {
  return {id:'delivery-1',eventId:'PAY_1111111111111111111111',timestamp:new Date().toISOString(),eventType,storeId:TEST_STORE,storeName:'Test store',mode:'test',data:{orderId:'ORD_1111111111111111111111',orderStatus:'completed',buyerEmail:'buyer@example.test',merchantProvidedBuyerIdentity:TEST_USER,orderMerchantExternalId:TEST_LOCAL,currency:'USD',amount:'11.99',taxAmount:'2.00',productName:'Plus',chargedAmount:'11.99',listPrice:{subtotal:'9.99',total:'11.99',taxAmount:'2.00'},paymentStatus:'succeeded',refundStatus:'succeeded',originalChargedAmount:'11.99',refundedAmount:'4.00'}}
}
// Only test fixtures are signed here. Application signing/verification is SDK-only.
function signed(raw:string,t=String(Date.now())) {return `t=${t},v1=${sign('RSA-SHA256',Buffer.from(`${t}.${raw}`),fixtureKeys.privateKey).toString('base64')}`}

test('official SDK verifies raw-body signatures, timestamps, store and mode',()=>{
 const restore=testEnvironment()
 try {
  const raw=JSON.stringify(fixture())
  assert.equal(verifiedWaffoEvent(raw,signed(raw)).id,'delivery-1')
  assert.throws(()=>verifiedWaffoEvent(raw+' ',signed(raw)))
  assert.throws(()=>verifiedWaffoEvent(raw,null))
  assert.throws(()=>verifiedWaffoEvent(raw,signed(raw,String(Date.now()-3600000))))
  for(const override of [{storeId:'STO_other'},{mode:'prod'}]) {const other=JSON.stringify({...fixture(),...override});assert.throws(()=>verifiedWaffoEvent(other,signed(other)))}
 } finally {restore()}
})

test('Waffo checkout uses exact catalog prices and server-owned identity',async()=>{
 const {NextRequest}=await import('next/server')
 const {POST}=await import('../app/api/billing/checkout/route')
 const restore=testEnvironment(), originalFetch=globalThis.fetch
 const inserted:Record<string,unknown>[]=[],sessions:Record<string,unknown>[]=[]
 let wrongPrice=false
 const json=(v:unknown)=>new Response(JSON.stringify(v),{headers:{'Content-Type':'application/json'}})
 globalThis.fetch=async(input,init)=>{
  const req=input instanceof Request?input:new Request(input,init),url=new URL(req.url)
  if(url.hostname==='billing-test.invalid') {
   if(url.pathname==='/auth/v1/user')return json({id:TEST_USER,email:'buyer@example.test'})
   if(url.pathname==='/rest/v1/billing_orders'&&req.method==='POST'){inserted.push(await req.json());return json({id:TEST_LOCAL})}
   if(url.pathname==='/rest/v1/billing_orders'&&req.method==='PATCH')return json(null)
  }
  if(url.hostname==='api.waffo.ai') {
   assert.equal(req.headers.get('x-merchant-id'),process.env.WAFFO_MERCHANT_ID)
   assert.ok(req.headers.get('x-signature'))
   const body=await req.json()
   if(url.pathname==='/v1/graphql')return json({data:{onetimeProducts:PACKAGES.map(p=>({id:process.env[`WAFFO_PRODUCT_${p.id.toUpperCase()}`],name:p.name,status:'active',prices:[{currency:'USD',priceInfo:{amount:wrongPrice?'0.01':(p.cents/100).toFixed(2),taxCategory:'saas'}}]}))}})
   if(url.pathname.endsWith('/issue-session-token')){assert.equal(body.buyerIdentity,TEST_USER);return json({data:{token:'fixture-token',expiresAt:new Date().toISOString()}})}
   if(url.pathname.endsWith('/create-session')){sessions.push(body);assert.equal(req.headers.get('x-idempotency-key'),`imageocr-${TEST_LOCAL}`);return json({data:{sessionId:'cs_fixture',checkoutUrl:'https://pancake.waffo.ai/test-checkout',expiresAt:new Date().toISOString()}})}
  }
  throw new Error('Unexpected network request')
 }
 const req=(id:string,auth=true)=>new NextRequest('https://site.test/api/billing/checkout',{method:'POST',headers:{'Content-Type':'application/json',...(auth?{Authorization:'Bearer fake-token'}:{})},body:JSON.stringify({packageId:id,amount:'0.01',userId:'attacker',credits:999999})})
 try {
  assert.equal((await POST(req('plus',false))).status,401)
  for(const pack of PACKAGES){const response=await POST(req(pack.id));assert.equal(response.status,200);assert.match((await response.json()).checkoutUrl,/#token=fixture-token$/)}
  assert.deepEqual(inserted.map(o=>[o.amount,o.credits,o.provider,o.provider_mode]),[[599,100,'waffo','test'],[999,300,'waffo','test'],[1999,800,'waffo','test']])
  for(const session of sessions){assert.equal(session.orderMerchantExternalId,TEST_LOCAL);assert.equal(session.buyerEmail,'buyer@example.test');assert.equal(session.priceSnapshot,undefined);assert.equal(session.allowPromotionCodes,false)}
  assert.equal((await POST(req('monthly'))).status,400)
  wrongPrice=true;assert.equal((await POST(req('plus'))).status,503);assert.equal(inserted.length,3)
 } finally {globalThis.fetch=originalFetch;restore()}
})

test('Waffo payment events validate provider order, identity and actual amounts',async()=>{
 const {waffoPaymentArguments}=await import('../lib/billing/waffo-events')
 const restore=testEnvironment(),originalFetch=globalThis.fetch
 const order={id:fixture().data.orderId,status:'completed',testMode:true,priceSnapshot:{currency:'USD',subtotal:'9.99',taxAmount:'2.00',total:'11.99'},onetimeProduct:{id:'PROD_2222222222222222222222'}}
 globalThis.fetch=async()=>new Response(JSON.stringify({data:{onetimeOrder:order}}),{headers:{'Content-Type':'application/json'}})
 try {
  const paid=await waffoPaymentArguments(fixture());assert.equal(paid.p_amount,999);assert.equal(paid.p_charged,1199);assert.equal(paid.p_user,TEST_USER)
  const refund=await waffoPaymentArguments(fixture('refund.succeeded'));assert.equal(refund.p_refunded,400)
  const event=fixture();event.data.chargedAmount='0.01';await assert.rejects(waffoPaymentArguments(event))
  const missing=fixture();delete missing.data.merchantProvidedBuyerIdentity;await assert.rejects(waffoPaymentArguments(missing))
  order.testMode=false;await assert.rejects(waffoPaymentArguments(fixture()))
 } finally {globalThis.fetch=originalFetch;restore()}
})

test('Waffo PostgreSQL inbox settlement is atomic and business-event idempotent',async()=>{
 const db=new PGlite()
 await db.exec('create schema auth;create table auth.users(id uuid primary key);create role anon;create role authenticated;create role service_role;')
 for(const migration of ['202611160001_billing.sql','202611160002_waffo.sql'])await db.exec(await readFile(new URL('../supabase/migrations/'+migration,import.meta.url),'utf8'))
 await db.query('insert into auth.users(id) values($1)',[TEST_USER])
 const product='PROD_2222222222222222222222',providerOrder=fixture().data.orderId
 await db.query(`insert into billing_orders(id,user_id,package_id,amount,credits,product_id,provider,provider_mode,provider_store_id) values($1,$2,'plus',999,300,$3,'waffo','test',$4)`,[TEST_LOCAL,TEST_USER,product,TEST_STORE])
 const inbox=(id:string,type:string,eventId=id)=>db.query(`insert into billing_waffo_inbox(id,event_id,event_type,store_id,mode,payload) values($1,$2,$3,$4,'test','{}') on conflict(store_id,mode,event_type,event_id) do nothing`,[id,eventId,type,TEST_STORE])
 const apply=(id:string,refund=0,user=TEST_USER)=>db.query('select billing_waffo_apply($1,$2,$3,$4,$5,999,1199,$6)',[id,TEST_LOCAL,user,providerOrder,product,refund])
 const wallet=async()=>Number((await db.query<{balance:number}>('select balance from billing_wallets')).rows[0]?.balance||0)
 try {
  await inbox('refund-first','refund.succeeded');await assert.rejects(apply('refund-first',400))
  await inbox('payment','order.completed','payment-business-id')
  await assert.rejects(apply('payment',0,'33333333-3333-4333-8333-333333333333'))
  await apply('payment');await apply('payment');assert.equal(await wallet(),300)
  await inbox('payment-manual','order.completed','payment-business-id')
  assert.equal((await db.query('select * from billing_waffo_inbox where id=$1',['payment-manual'])).rows.length,0)
  await db.query("insert into billing_daily(actor,day,used) values($1,(now() at time zone 'UTC')::date,4)",['user:'+TEST_USER])
  await db.query('select billing_reserve($1,$2,$3,$4,$5)',['user:'+TEST_USER,'guest:waffo',TEST_USER,'waffo-image0001','image-fingerprint'])
  await db.query('select billing_finish($1,$2,true,$3)',['user:'+TEST_USER,'waffo-image0001',{success:true,result:{text:''}}])
  assert.equal(await wallet(),299)
  await apply('refund-first',400);await apply('refund-first',400);assert.equal(await wallet(),198)
  await inbox('refund-last','refund.succeeded');await apply('refund-last',799);assert.equal(await wallet(),-1)
  await apply('payment');assert.equal(await wallet(),-1)
  assert.equal((await db.query<{status:string}>('select status from billing_orders')).rows[0].status,'refunded')
  assert.equal((await db.query('select * from billing_waffo_inbox where processed_at is null')).rows.length,0)
  assert.equal((await db.query<{allowed:boolean}>("select has_function_privilege('authenticated','billing_waffo_apply(text,uuid,uuid,text,text,integer,integer,integer)','EXECUTE') allowed")).rows[0].allowed,false)
 } finally {await db.close()}
})

test('webhook rejects bad signatures and never acknowledges a failed durable write',async()=>{
 const {NextRequest}=await import('next/server')
 const {POST}=await import('../app/api/billing/webhook/route')
 const restore=testEnvironment(),originalFetch=globalThis.fetch
 let writes=0
 globalThis.fetch=async(input,init)=>{
  const req=input instanceof Request?input:new Request(input,init)
  assert.ok(req.url.startsWith('https://billing-test.invalid/rest/v1/billing_waffo_inbox'))
  writes++
  assert.ok((req.headers.get('prefer')||'').includes('ignore-duplicates'))
  return new Response(JSON.stringify({message:'Injected database failure'}),{status:400,headers:{'Content-Type':'application/json'}})
 }
 const raw=JSON.stringify(fixture())
 const request=(sig:string)=>new NextRequest('https://site.test/api/billing/webhook',{method:'POST',headers:{'x-waffo-signature':sig},body:raw})
 try {
  assert.equal((await POST(request('invalid'))).status,401);assert.equal(writes,0)
  assert.equal((await POST(request(signed(raw)))).status,503);assert.equal(writes,1)
 } finally {globalThis.fetch=originalFetch;restore()}
})

test('paid accounts get 3 atomic OCR slots; free users get 1 across providers/tabs',async()=>{
 const db=new PGlite()
 await db.exec('create schema auth;create table auth.users(id uuid primary key);create role anon;create role authenticated;create role service_role;')
 for(const migration of ['202611160001_billing.sql','202611160002_waffo.sql','202611160003_ocr_concurrency.sql','202611190001_ocr_daily_limits.sql']) await db.exec(await readFile(new URL('../supabase/migrations/'+migration,import.meta.url),'utf8'))
 await db.query('insert into auth.users(id) values($1)',[TEST_USER])
 const actor='user:'+TEST_USER
 const reserve=async(id:string)=> (await db.query<{r:{kind:string;concurrencyLimit?:number}}> ('select billing_reserve($1,$2,$3,$4,$5) r',[actor,'guest:parallel',TEST_USER,id,id])).rows[0].r
 const finish=(id:string,success:boolean)=>db.query('select billing_finish($1,$2,$3,$4)',[actor,id,success,success?{success:true,result:{text:id}}:null])
 const used=async()=> (await db.query<{used:number}>('select used from billing_daily where actor=$1',[actor])).rows[0].used
 try {
  assert.equal((await reserve('free0001')).kind,'reserved')
  assert.equal((await reserve('free0002')).kind,'busy')
  assert.equal(await used(),1)
  await finish('free0001',false)
  await db.query(`insert into billing_orders(id,user_id,package_id,amount,credits,product_id,status,paid_at) values($1,$2,'plus',999,300,'test-product','paid',now())`,[TEST_LOCAL,TEST_USER])
  await db.query('insert into billing_wallets(user_id,balance) values($1,300)',[TEST_USER])
  const reservations=await Promise.all(['paid0001','paid0002','paid0003','paid0004'].map(reserve))
  assert.deepEqual(reservations.map(r=>r.kind),['reserved','reserved','reserved','busy'])
  assert.equal(reservations[3].concurrencyLimit,3)
  assert.equal(await used(),2)
  assert.equal((await reserve('paid0001')).kind,'pending')
  await finish('paid0002',true)
  assert.equal((await reserve('paid0002')).kind,'replay')
  assert.equal((await reserve('paid0004')).kind,'reserved')
  await finish('paid0001',false);await finish('paid0003',false);await finish('paid0004',false)
  await db.query("update billing_orders set status='refunded',revoked_credits=credits where id=$1",[TEST_LOCAL])
  assert.equal((await reserve('afterrefund1')).kind,'reserved')
  assert.equal((await reserve('afterrefund2')).kind,'busy')
  const balance=(await db.query<{r:{concurrencyLimit:number;activeRequests:number}}> ('select billing_balance($1,$2,$3) r',[actor,'guest:parallel',TEST_USER])).rows[0].r
  assert.equal(balance.concurrencyLimit,1);assert.equal(balance.activeRequests,1)
 }finally{await db.close()}
})

test('batch pool keeps 3 active workers and preserves original result indexes',async()=>{
 const {runImageBatch,fetchQueuedOCR}=await import('../lib/ocr/batch')
 let active=0,peak=0
 const results:number[]=[]
 await runImageBatch([0,1,2,3,4,5],3,async(item,index)=>{
  active++;peak=Math.max(peak,active)
  await new Promise(resolve=>setTimeout(resolve,index===0?15:2))
  results[index]=item;active--
 })
 assert.equal(peak,3);assert.deepEqual(results,[0,1,2,3,4,5])
 active=0;peak=0
 await runImageBatch([0,1,2],1,async()=>{active++;peak=Math.max(peak,active);await Promise.resolve();active--})
 assert.equal(peak,1)
 const requests:RequestInit[]=[]
 const init={method:'POST',headers:{'Idempotency-Key':'fixed-image-id'},body:'same-image-body'}
 const response=await fetchQueuedOCR('/api/ocr/ali_vl',init,{wait:async()=>{},fetch:async(_url,request)=>{
  requests.push(request!)
  return requests.length===1 ? new Response(JSON.stringify({errorCode:'OCR_CONCURRENCY_LIMIT'}),{status:429,headers:{'Retry-After':'2'}}) : new Response('{"success":true}')
 }})
 assert.equal(response.status,200);assert.equal(requests.length,2);assert.equal(requests[0],requests[1])
 let attempts=0
 const upstream=await fetchQueuedOCR('/api/ocr/ali_vl',init,{wait:async()=>{},fetch:async()=>{attempts++;return new Response('{"error":"Provider rate limit"}',{status:429})}})
 assert.equal(upstream.status,429);assert.equal(attempts,1)
})

test('order history paginates only the signed-in account and preserves the recent-orders contract', async () => {
 const {NextRequest}=await import('next/server')
 const {GET}=await import('../app/api/billing/orders/route')
 const restore=testEnvironment(), originalFetch=globalThis.fetch
 let reads=0
 globalThis.fetch=async(input,init)=>{
  const req=input instanceof Request?input:new Request(input,init),url=new URL(req.url)
  const json=(v:unknown)=>new Response(JSON.stringify(v),{headers:{'Content-Type':'application/json'}})
  if(url.pathname==='/auth/v1/user')return json({id:TEST_USER})
  assert.equal(url.pathname,'/rest/v1/billing_orders')
  assert.equal(url.searchParams.get('user_id'),`eq.${TEST_USER}`)
  assert.equal(url.searchParams.get('order'),'created_at.desc,id.desc')
  reads++
  const offset=Number(url.searchParams.get('offset')||0),limit=Number(url.searchParams.get('limit'))
  return json(Array.from({length:Math.min(limit,55-offset)},(_,i)=>({id:`order-${offset+i}`})))
 }
 const request=(query='',auth=true)=>new NextRequest('https://site.test/api/billing/orders'+query,{headers:auth?{Authorization:'Bearer test-token'}:{}})
 try {
  assert.equal((await GET(request('',false))).status,401);assert.equal(reads,0)
  for(const page of ['0','-1','1.5','abc','100001'])assert.equal((await GET(request('?page='+page))).status,400)
  assert.equal(reads,0)
  const first=await GET(request('?page=1&user_id=attacker'))
  assert.equal(first.headers.get('cache-control'),'no-store')
  const a=await first.json();assert.equal(a.orders.length,20);assert.equal(a.orders[0].id,'order-0');assert.equal(a.hasMore,true)
  const b=await (await GET(request('?page=3'))).json();assert.equal(b.orders.length,15);assert.equal(b.orders[0].id,'order-40');assert.equal(b.hasMore,false)
  const recent=await (await GET(request())).json();assert.equal(recent.orders.length,50);assert.equal(recent.hasMore,true)
 } finally {globalThis.fetch=originalFetch;restore()}
})

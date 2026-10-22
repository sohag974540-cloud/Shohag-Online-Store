import crypto from 'node:crypto';
const json=(statusCode,body,headers={})=>({statusCode,headers:{'content-type':'application/json','cache-control':'no-store',...headers},body:JSON.stringify(body)});
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const equal=(a,b)=>{try{return crypto.timingSafeEqual(Buffer.from(a),Buffer.from(b))}catch{return false}};
export async function handler(event){
 if(event.httpMethod!=='POST')return json(405,{error:'শুধু POST অনুমোদিত'});
 try{
  const {email,password,otp}=JSON.parse(event.body||'{}');
  const admin=(process.env.ADMIN_EMAIL||'').trim().toLowerCase(),hash=process.env.ADMIN_PASSWORD_HASH||'',secret=process.env.OTP_SECRET||'';
  if(!admin||!hash||!secret)return json(503,{error:'অ্যাডমিন environment variables সেট করা নেই।'});
  if(String(email||'').trim().toLowerCase()!==admin||sha(String(password||''))!==hash)return json(401,{error:'লগইন তথ্য সঠিক নয়।'});
  const cookie=(event.headers.cookie||event.headers.Cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('sho_otp='));
  if(!cookie)return json(401,{error:'OTP সেশন নেই। আবার কোড নিন।'});
  const token=cookie.slice('sho_otp='.length),i=token.lastIndexOf('.');if(i<0)return json(401,{error:'OTP সেশন অবৈধ।'});
  const payload=token.slice(0,i),sig=token.slice(i+1),expected=crypto.createHmac('sha256',secret).update(payload).digest('hex');
  if(!equal(sig,expected))return json(401,{error:'OTP সেশন অবৈধ।'});
  const data=JSON.parse(Buffer.from(payload,'base64url').toString());
  if(data.email!==admin||Date.now()>data.expires||!equal(String(otp||''),data.otp))return json(401,{error:'OTP ভুল বা মেয়াদ শেষ। আবার চেষ্টা করুন।'});
  // Short-lived signed admin session cookie. For production mutations, enforce this cookie in every protected server function.
  const session=Buffer.from(JSON.stringify({email:admin,exp:Date.now()+8*60*60*1000})).toString('base64url');
  const sessionSig=crypto.createHmac('sha256',secret).update(session).digest('hex');
  return json(200,{ok:true,message:'OTP যাচাই হয়েছে'},{'set-cookie':[`sho_admin=${session}.${sessionSig}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800`,'sho_otp=; HttpOnly; Secure; SameSite=Strict; Path=/.netlify/functions; Max-Age=0'].join(', ')});
 }catch{return json(400,{error:'অনুরোধটি সঠিক নয়।'});}
}

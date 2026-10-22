import crypto from 'node:crypto';
const json=(statusCode,body)=>({statusCode,headers:{'content-type':'application/json','cache-control':'no-store'},body:JSON.stringify(body)});
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
export async function handler(event){
 if(event.httpMethod!=='POST')return json(405,{error:'শুধু POST অনুমোদিত'});
 try{
  const {email,password}=JSON.parse(event.body||'{}');
  const admin=(process.env.ADMIN_EMAIL||'').trim().toLowerCase();
  const hash=process.env.ADMIN_PASSWORD_HASH||'';
  const secret=process.env.OTP_SECRET||'';
  const key=process.env.RESEND_API_KEY||'';
  const from=process.env.EMAIL_FROM||'';
  if(!admin||!hash||!secret||!key||!from)return json(503,{error:'Netlify environment variables সম্পূর্ণ সেট করা নেই।'});
  if(String(email||'').trim().toLowerCase()!==admin)return json(401,{error:'অনুমোদিত অ্যাডমিন ইমেইল নয়।'});
  if(sha(String(password||''))!==hash)return json(401,{error:'ইমেইল বা পাসওয়ার্ড সঠিক নয়।'});
  const otp=String(crypto.randomInt(0,1000000)).padStart(6,'0');
  const expires=Date.now()+5*60*1000;
  const payload=Buffer.from(JSON.stringify({email:admin,otp,expires})).toString('base64url');
  const sig=crypto.createHmac('sha256',secret).update(payload).digest('hex');
  const res=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[admin],subject:'Shohag Online Store Admin OTP',text:`আপনার অ্যাডমিন লগইন OTP: ${otp}\nকোডটি ৫ মিনিটের মধ্যে ব্যবহার করুন। আপনি লগইন চেষ্টা না করলে এই ইমেইল উপেক্ষা করুন।`})});
  if(!res.ok)return json(502,{error:'ইমেইল পাঠানো যায়নি। EMAIL_FROM ও Resend সেটিংস পরীক্ষা করুন।'});
  return {statusCode:200,headers:{'content-type':'application/json','cache-control':'no-store','set-cookie':`sho_otp=${payload}.${sig}; HttpOnly; Secure; SameSite=Strict; Path=/.netlify/functions; Max-Age=300`},body:JSON.stringify({ok:true,message:'OTP পাঠানো হয়েছে'})};
 }catch{return json(400,{error:'অনুরোধটি সঠিক নয়।'});}
}

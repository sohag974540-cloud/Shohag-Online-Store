import React,{useEffect,useMemo,useState} from 'react';
import{createRoot}from'react-dom/client';
import{Search,ShoppingCart,Store,LayoutDashboard,Package,Tags,ClipboardList,Settings,Plus,Trash2,Pencil,Truck,MapPin,ShieldCheck,CheckCircle2,Download,ArrowRight,X,Boxes,AlertTriangle,Eye,EyeOff}from'lucide-react';
import'./style.css';

const initialCats=['সব পণ্য','ফ্যাশন','ইলেকট্রনিক্স','ঘর-গৃহস্থালি','সৌন্দর্য','অন্যান্য'];
const initialProducts=[
  {id:1,name:'প্রিমিয়াম কটন টি-শার্ট',category:'ফ্যাশন',price:450,oldPrice:600,stock:18,sizes:['M','L','XL'],colors:['কালো','সাদা','নীল'],emoji:'👕',desc:'আরামদায়ক কটন কাপড়, দৈনন্দিন ব্যবহারের জন্য।'},
  {id:2,name:'ওয়্যারলেস ইয়ারবাডস',category:'ইলেকট্রনিক্স',price:1250,oldPrice:1500,stock:12,sizes:['স্ট্যান্ডার্ড'],colors:['কালো','সাদা'],emoji:'🎧',desc:'কমপ্যাক্ট ডিজাইন ও দৈনন্দিন ব্যবহারের উপযোগী।'},
  {id:3,name:'ইনসুলেটেড পানির বোতল',category:'ঘর-গৃহস্থালি',price:580,oldPrice:null,stock:25,sizes:['500ml','750ml'],colors:['সবুজ','কালো'],emoji:'🧴',desc:'বাইরে বা বাসায় ব্যবহারের জন্য স্টাইলিশ বোতল।'},
  {id:4,name:'স্কিন কেয়ার সেট',category:'সৌন্দর্য',price:890,oldPrice:1050,stock:9,sizes:['স্ট্যান্ডার্ড'],colors:['স্ট্যান্ডার্ড'],emoji:'🧴',desc:'দৈনন্দিন যত্নের জন্য নমুনা পণ্য সেট।'},
  {id:5,name:'মিনিমাল ব্যাকপ্যাক',category:'ফ্যাশন',price:980,oldPrice:null,stock:7,sizes:['স্ট্যান্ডার্ড'],colors:['কালো','ধূসর'],emoji:'🎒',desc:'হালকা ও ব্যবহারিক ব্যাগ।'},
  {id:6,name:'ডেস্ক ল্যাম্প',category:'ঘর-গৃহস্থালি',price:720,oldPrice:850,stock:14,sizes:['স্ট্যান্ডার্ড'],colors:['সাদা','কালো'],emoji:'💡',desc:'পড়াশোনা বা কাজের টেবিলের জন্য।'}
];

const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}}, money=n=>'৳'+Number(n||0).toLocaleString('en-US');
const fileData=file=>new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)});
const ADMIN_EMAIL_HINT='Set ADMIN_EMAIL in Netlify environment variables';

function App(){
  const[products,setProducts]=useState(()=>read('sho_products',initialProducts)),[cats,setCats]=useState(()=>read('sho_cats',initialCats)),[orders,setOrders]=useState(()=>read('sho_orders',[])),[settings,setSettings]=useState(()=>read('sho_settings',{localFee:50,courierFee:120,bkash:'',tagline:'আপনার চাহিদার সব সমাধান, এখন এক ঠিকানায়'}));
  const[view,setView]=useState('shop'),[tab,setTab]=useState('dashboard'),[q,setQ]=useState(''),[cat,setCat]=useState('সব পণ্য'),[cart,setCart]=useState([]),[modal,setModal]=useState(null),[notice,setNotice]=useState(''),[login,setLogin]=useState(false),[email,setEmail]=useState(''),[pw,setPw]=useState(''),[otp,setOtp]=useState(''),[otpStage,setOtpStage]=useState(false),[authBusy,setAuthBusy]=useState(false),[edit,setEdit]=useState(null),[newCat,setNewCat]=useState(''),[checkout,setCheckout]=useState(false),[done,setDone]=useState(null);

  useEffect(()=>localStorage.setItem('sho_products',JSON.stringify(products)),[products]);
  useEffect(()=>localStorage.setItem('sho_cats',JSON.stringify(cats)),[cats]);
  useEffect(()=>localStorage.setItem('sho_orders',JSON.stringify(orders)),[orders]);
  useEffect(()=>localStorage.setItem('sho_settings',JSON.stringify(settings)),[settings]);

  const shown=useMemo(()=>products.filter(p=>p.visible!==false&&(cat==='সব পণ্য'||p.category===cat)&&p.name.toLowerCase().includes(q.toLowerCase())),[products,cat,q]);
  const subtotal=cart.reduce((s,i)=>s+i.price*i.qty,0),fee=checkout?.area==='outside'?Number(settings.courierFee):Number(settings.localFee),total=subtotal+fee;
  const flash=t=>{setNotice(t);setTimeout(()=>setNotice(''),2600)};

  const add=(p,size=p.sizes?.[0]||'স্ট্যান্ডার্ড',color=p.colors?.[0]||'স্ট্যান্ডার্ড')=>{
    setCart(old=>{let key=p.id+'-'+size+'-'+color,found=old.find(i=>i.key===key);return found?old.map(i=>i.key===key?{...i,qty:Math.min(i.qty+1,p.stock)}:i):[...old,{key,id:p.id,name:p.name,price:p.price,emoji:p.emoji,size,color,qty:1,max:p.stock}]});
    setModal(null);
    flash('পণ্য কার্টে যোগ হয়েছে।');
  };

  function order(e){
    e.preventDefault();
    let f=new FormData(e.currentTarget);
    if(!cart.length)return;
    let o={id:'SH-'+Date.now().toString().slice(-7),date:new Date().toLocaleString('bn-BD'),name:f.get('name'),phone:f.get('phone'),address:f.get('address'),area:f.get('area'),payment:f.get('payment'),tx:f.get('tx'),items:cart,subtotal,fee,total,status:'নতুন অর্ডার',paymentStatus:f.get('payment')==='bkash'?'যাচাই বাকি':'COD'};
    setOrders([o,...orders]);
    setProducts(ps=>ps.map(p=>{let n=cart.filter(i=>i.id===p.id).reduce((s,i)=>s+i.qty,0);return n?{...p,stock:Math.max(0,p.stock-n)}:p}));
    setCart([]);
    setCheckout(false);
    setDone(o);
  }

  function backup(){
    let b=new Blob([JSON.stringify({products,cats,orders,settings},null,2)],{type:'application/json'}),u=URL.createObjectURL(b),a=document.createElement('a');
    a.href=u;a.download='shohag-store-backup.json';a.click();URL.revokeObjectURL(u);
  }

  async function saveProduct(e){
    e.preventDefault();
    const form=e.currentTarget;
    const f=new FormData(form);
    let images=[...(edit?.images||[])],videos=[...(edit?.videos||[])];
    try{
      for(const file of form.querySelector('[name=images]').files){
        if(!file.type.startsWith('image/'))continue;
        if(file.size>3*1024*1024){flash('প্রতি ছবি ৩ MB-এর মধ্যে রাখুন।');return}
        images.push(await fileData(file));
      }
      for(const file of form.querySelector('[name=videoFiles]').files){
        if(!file.type.startsWith('video/'))continue;
        if(file.size>8*1024*1024){flash('প্রতি ভিডিও ৮ MB-এর মধ্যে রাখুন; বড় ভিডিওর জন্য ভিডিও লিংক দিন।');return}
        videos.push(await fileData(file));
      }
    }catch{flash('মিডিয়া ফাইল পড়া যায়নি।');return}
    const videoLink=String(f.get('videoLink')||'').trim();
    if(videoLink)videos.push(videoLink);
    const p={id:edit?.id||Date.now(),name:f.get('name'),category:f.get('category'),price:+f.get('price'),oldPrice:f.get('oldPrice')?+f.get('oldPrice'):null,stock:+f.get('stock'),sizes:f.get('sizes').split(',').map(s=>s.trim()).filter(Boolean),colors:f.get('colors').split(',').map(s=>s.trim()).filter(Boolean),emoji:f.get('emoji')||'📦',images,videos,desc:f.get('desc')||'',visible:edit?.visible!==false};
    try{
      const updated=edit?.id?products.map(x=>x.id===edit.id?p:x):[p,...products];
      localStorage.setItem('sho_products',JSON.stringify(updated));
      setProducts(updated);
      setEdit(null);
      flash('পণ্য ও মিডিয়া সংরক্ষণ হয়েছে।');
    }catch(err){flash('ব্রাউজারের স্টোরেজ পূর্ণ। ভিডিও লিংক ব্যবহার করুন বা ফাইল ছোট করুন।')}
    }
              async function requestOtp(e){
    e.preventDefault();setAuthBusy(true);
    try{
      const r=await fetch('/.netlify/functions/request-otp',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,password:pw})});
      const d=await r.json();if(!r.ok)throw new Error(d.error||'OTP পাঠানো যায়নি');
      setOtpStage(true);flash('ইমেইলে OTP পাঠানো হয়েছে।');
    }catch(err){flash(err.message+' — Netlify secrets ও deploy যাচাই করুন।')}finally{setAuthBusy(false)}
  }

  async function verifyOtp(e){
    e.preventDefault();setAuthBusy(true);
    try{
      const r=await fetch('/.netlify/functions/verify-otp',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,otp,password:pw})});
      const d=await r.json();if(!r.ok)throw new Error(d.error||'ভেরিফিকেশন ব্যর্থ');
      setLogin(true);setOtpStage(false);setOtp('');flash('অ্যাডমিন যাচাই সম্পন্ন।');
    }catch(err){flash(err.message)}finally{setAuthBusy(false)}
  }

  return (
    <div className="app">
      {notice && <div className="notice-banner">{notice}</div>}
      <div className="warning"><AlertTriangle size={14}/> ব্যক্তিগত ডেমো • বাস্তব SMS, বিকাশ যাচাই ও GPS এখনো সংযুক্ত নয়</div>
      <header>
        <button className="brand" onClick={()=>setView('shop')}><span className="logo"><Store/></span><span><b>Shohag Online Store</b><small>{settings.tagline}</small></span></button>
        <nav>
          <button onClick={()=>{setView('shop');setCat('সব পণ্য')}}>হোম</button>
          <button onClick={()=>document.getElementById('products')?.scrollIntoView({behavior:'smooth'})}>সব পণ্য</button>
          <button onClick={()=>{setView('admin');setTab('dashboard')}}><LayoutDashboard size={16}/> অ্যাডমিন</button>
        </nav>
        <button className="cartbtn" onClick={()=>setModal({type:'cart'})}><ShoppingCart size={18}/> কার্ট <b>{cart.reduce((s,i)=>s+i.qty,0)}</b></button>
      </header>

      {view==='shop' ? (
        <main>
          <section className="hero">
            <div>
              <span className="eyebrow">আপনার অনলাইন শপিং গন্তব্য</span>
              <h1>পছন্দের পণ্য,<br/><em>এক ঠিকানায়।</em></h1>
              <p>{settings.tagline}</p>
              <button className="primary" onClick={()=>document.getElementById('products').scrollIntoView({behavior:'smooth'})}>কেনাকাটা শুরু করুন <ArrowRight size={16}/></button>
              <div className="hero-meta"><span><ShieldCheck/> সহজ অর্ডার</span><span><Truck/> সুবিধাজনক ডেলিভারি</span></div>
            </div>
            <div className="hero-art"><div className="circle"></div><div className="floating f1">👕</div><div className="floating f2">🎧</div><div className="floating f3">🎒</div><div className="floatlabel"><Package/> নতুন পণ্য</div></div>
          </section>

          <div className="trust"><span><Package/> বিভিন্ন পণ্য</span><span><Truck/> স্থানীয় ও কুরিয়ার</span><span><ShieldCheck/> অর্ডার যাচাই</span></div>

          <section className="section">
            <div className="sectionhead"><div><small>আপনার পছন্দ বেছে নিন</small><h2>ক্যাটাগরি অনুযায়ী খুঁজুন</h2></div></div>
            <div className="catgrid">{[['ফ্যাশন','👕'],['ইলেকট্রনিক্স','🎧'],['ঘর-গৃহস্থালি','🪴'],['সৌন্দর্য','🧴'],['অন্যান্য','🎁']].filter(c=>cats.includes(c[0])).map(c=><button className="catcard" key={c[0]} onClick={()=>{setCat(c[0]);document.getElementById('products').scrollIntoView({behavior:'smooth'})}}><span>{c[1]}</span><b>{c[0]}</b><ArrowRight size={15}/></button>)}</div>
          </section>

          <section className="section" id="products">
            <div className="sectionhead"><div><small>দেখুন ও পছন্দ করুন</small><h2>জনপ্রিয় পণ্য</h2></div><span>{shown.length}টি পণ্য</span></div>
            <div className="tools">
              <div className="search"><Search/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="পণ্যের নাম দিয়ে খুঁজুন..."/></div>
              <div className="pills">{cats.map(c=><button className={cat===c?'active':''} key={c} onClick={()=>setCat(c)}>{c}</button>)}</div>
            </div>
            <div className="products">
              {shown.map(p=>(
                <article className="product" key={p.id}>
                  <button className={'art '+(['mint','lavender','peach','pink','blue','yellow'][p.id%6])} onClick={()=>setModal({type:'product',p})}>
                    {p.images?.[0]?<img src={p.images[0]} alt={p.name}/>:<span>{p.emoji}</span>}
                    {p.oldPrice&&<small>ছাড়</small>}
                  </button>
                  <div className="pinfo">
                    <small>{p.category}</small>
                    <h3>{p.name}</h3>
                    <div className="price"><b>{money(p.price)}</b>{p.oldPrice&&<del>{money(p.oldPrice)}</del>}</div>
                    <div className="pfoot">
                      <span className={p.stock<=5?'low':''}>{p.stock>0?'স্টক '+p.stock:'স্টক শেষ'}</span>
                      <button disabled={!p.stock} onClick={()=>setModal({type:'product',p})}><Plus size={15}/> যোগ করুন</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {!shown.length&&<p className="empty">কোনো পণ্য পাওয়া যায়নি।</p>}
          </section>

          <section className="delivery">
            <div className="delivery-icon"><Truck/></div>
            <div>
              <small>আপনার এলাকার জন্য</small>
              <h2>ধোবাউড়ায় স্থানীয় ডেলিভারি</h2>
              <p>স্থানীয় চার্জ অ্যাডমিন নির্ধারণ করবে; এলাকার বাইরে কুরিয়ার চার্জ প্রযোজ্য।</p>
            </div>
          </section>
        </main>
      ) : (
        <main className="admin">
          <aside className="side">
            <div className="sidebrand"><span className="logo"><Store/></span><b>স্টোর অ্যাডমিন</b></div>
            {[['dashboard','ড্যাশবোর্ড',LayoutDashboard],['products','পণ্য',Boxes],['categories','ক্যাটাগরি',Tags],['orders','অর্ডার',ClipboardList],['settings','সেটিংস',Settings]].map(([k,t,I])=><button className={tab===k?'sel':''} key={k} onClick={()=>{setTab(k);setEdit(null)}}><I size={17}/>{t}</button>)}
            <button onClick={()=>{setView('shop');setLogin(false)}}>দোকানে ফিরে যান</button>
          </aside>
          <div className="adminbody">
            <div className="adminhead">
              <div><small>SHOHAG ONLINE STORE</small><h1>{{dashboard:'ড্যাশবোর্ড',products:'পণ্য ব্যবস্থাপনা',categories:'ক্যাটাগরি ব্যবস্থাপনা',orders:'অর্ডার ব্যবস্থাপনা',settings:'স্টোর সেটিংস'}[tab]}</h1></div>
              <span className="demobadge">ডেমো মোড</span>
            </div>

            {tab==='dashboard'&&<>
              <div className="metrics">
                <div><small>মোট অর্ডার</small><b>{orders.length}</b></div>
                <div><small>মোট পণ্য</small><b>{products.length}</b></div>
                <div><small>অর্ডারের মোট মূল্য</small><b>{money(orders.reduce((s,o)=>s+o.total,0))}</b></div>
                <div><small>কম স্টক</small><b>{products.filter(p=>p.stock<=5).length}</b></div>
              </div>
              <section className="panel">
                <h2>সাম্প্রতিক অর্ডার</h2>
                {orders.length?orders.slice(0,5).map(o=><div className="orderrow" key={o.id}><div><b>{o.id}</b><small>{o.name} • {o.phone}</small></div><strong>{money(o.total)}</strong><select value={o.status} onChange={e=>setOrders(os=>os.map(x=>x.id===o.id?{...x,status:e.target.value}:x))}>{['নতুন অর্ডার','নিশ্চিত','প্রস্তুত','কুরিয়ারে পাঠানো','ডেলিভারি সম্পন্ন','বাতিল'].map(s=><option key={s}>{s}</option>)}</select></div>):<p className="empty">এখনো কোনো অর্ডার নেই। দোকান থেকে ডেমো অর্ডার দিয়ে পরীক্ষা করুন।</p>}
              </section>
              <section className="panel">
                <h2>ডেমো ডেটার সীমাবদ্ধতা</h2>
                <p>তথ্য এই ব্রাউজারে থাকে। অন্য ডিভাইসে সিঙ্ক, প্রকৃত নিরাপদ লগইন, ক্লাউড ডেটাবেস ও স্বয়ংক্রিয় ব্যাকআপের জন্য পরের ধাপে সার্ভার সংযোগ লাগবে।</p>
                <button className="secondary" onClick={backup}><Download size={16}/> ব্যাকআপ ডাউনলোড</button>
              </section>
            </>}
                        {tab==='products'&&<section className="panel">
              <div className="panelhead"><h2>{edit?'পণ্য সম্পাদনা':'পণ্য তালিকা'}</h2><button className="primary" onClick={()=>setEdit({})}><Plus size={16}/> নতুন পণ্য</button></div>
              {edit?(
                <form className="editform" onSubmit={saveProduct}>
                  <label>পণ্যের নাম<input name="name" required defaultValue={edit.name||''}/></label>
                  <label>ক্যাটাগরি<select name="category" defaultValue={edit.category||cats.find(c=>c!=='সব পণ্য')}>{cats.filter(c=>c!=='সব পণ্য').map(c=><option key={c}>{c}</option>)}</select></label>
                  <label>দাম<input name="price" type="number" min="0" required defaultValue={edit.price??''}/></label>
                  <label>পুরোনো দাম<input name="oldPrice" type="number" min="0" defaultValue={edit.oldPrice||''}/></label>
                  <label>স্টক<input name="stock" type="number" min="0" defaultValue={edit.stock??0}/></label>
                  <label>ইমোজি fallback<input name="emoji" defaultValue={edit.emoji||'📦'}/></label>
                  
                  <label className="wide">প্রোডাক্ট ছবি আপলোড (একাধিক)
                    <input name="images" type="file" accept="image/*" multiple/>
                    <small>প্রতি ছবি সর্বোচ্চ ৩ MB; আগের ছবি রাখা হবে।</small>
                    {edit.images?.length>0&&<div className="media-preview">{edit.images.map((u,i)=><div key={i}><img src={u} alt="পণ্যের ছবি"/><button type="button" onClick={()=>setEdit({...edit,images:edit.images.filter((_,j)=>i!==j)})}>×</button></div>)}</div>}
                  </label>

                  <label className="wide">ভিডিও ফাইল আপলোড (প্রতি ফাইল সর্বোচ্চ ৮ MB)
                    <input name="videoFiles" type="file" accept="video/*" multiple/>
                    <small>বড় ভিডিওর জন্য নিচে সরাসরি ভিডিও URL দিন।</small>
                  </label>

                  <label className="wide">ভিডিও লিংক (একটি URL)
                    <input name="videoLink" type="url" placeholder="https://..."/>
                  </label>
                  {edit.videos?.length>0&&<div className="wide media-preview">{edit.videos.map((u,i)=><div key={i}>{String(u).startsWith("data:video/")?<video src={u} controls style={{maxWidth:'120px'}}/>:<a href={u} target="_blank" rel="noreferrer">ভিডিও {i+1} খুলুন</a>}<button type="button" onClick={()=>setEdit({...edit,videos:edit.videos.filter((_,j)=>i!==j)})}>×</button></div>)}</div>}

                  <label>সাইজ (কমা দিয়ে)<input name="sizes" defaultValue={(edit.sizes||['স্ট্যান্ডার্ড']).join(', ')}/></label>
                  <label>রং (কমা দিয়ে)<input name="colors" defaultValue={(edit.colors||['স্ট্যান্ডার্ড']).join(', ')}/></label>
                  <label className="wide">বিবরণ<textarea name="desc" defaultValue={edit.desc||''}/></label>
                  <div className="wide formactions"><button type="button" className="secondary" onClick={()=>setEdit(null)}>বাতিল</button><button className="primary">সংরক্ষণ</button></div>
                  <p className="wide hint">ডেমোতে মিডিয়া ব্রাউজারে সংরক্ষিত হয়। প্রোডাকশনে নির্ভরযোগ্য স্থায়ী মিডিয়া স্টোরেজের জন্য Cloudinary/S3-এর মতো স্টোরেজ সংযোগ করুন।</p>
                </form>
              ):(
                <div className="tablewrap">
                  <table>
                    <thead><tr><th>পণ্য</th><th>ক্যাটাগরি</th><th>দাম</th><th>স্টক</th><th>কাজ</th></tr></thead>
                    <tbody>
                      {products.map(p=>(
                        <tr key={p.id}>
                          <td>{p.emoji} {p.name}<small>{(p.sizes||[]).join(', ')} • {(p.colors||[]).join(', ')}</small></td>
                          <td>{p.category}</td>
                          <td>{money(p.price)}</td>
                          <td>{p.stock}</td>
                          <td className="actions">
                            <button onClick={()=>setEdit(p)}><Pencil size={15}/></button>
                            <button onClick={()=>setProducts(ps=>ps.map(x=>x.id===p.id?{...x,visible:x.visible===false}:x))}>{p.visible===false?<EyeOff size={15}/>:<Eye size={15}/>}</button>
                            <button onClick={()=>{setProducts(ps=>ps.filter(x=>x.id!==p.id));flash('পণ্য মুছে ফেলা হয়েছে')}}><Trash2 size={15}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>}

            {tab==='categories'&&<section className="panel">
              <h2>ক্যাটাগরি তৈরি ও পরিচালনা</h2>
              <form className="addcat" onSubmit={e=>{e.preventDefault();if(newCat.trim()&&!cats.includes(newCat.trim())){setCats([...cats,newCat.trim()]);setNewCat('');flash('ক্যাটাগরি যোগ হয়েছে')}}}>
                <input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="নতুন ক্যাটাগরির নাম" required/>
                <button className="primary"><Plus size={16}/> যোগ করুন</button>
              </form>
              {cats.map(c=><div className="catrow" key={c}><Tags size={16}/><span>{c}</span><small>{products.filter(p=>p.category===c).length} পণ্য</small>{c!=='সব পণ্য'&&<button onClick={()=>{if(products.some(p=>p.category===c)){flash('এই ক্যাটাগরিতে পণ্য আছে; আগে অন্য ক্যাটাগরিতে সরান।');return}setCats(cs=>cs.filter(x=>x!==c))}}><Trash2 size={15}/></button>}</div>)}
            </section>}

            {tab==='orders'&&<section className="panel">
              <h2>সব অর্ডার</h2>
              {orders.length?orders.map(o=><div className="fullorder" key={o.id}>
                <div><b>{o.id} · {o.name}</b><small>{o.phone} · {o.address}</small><small>{o.items.map(i=>`${i.name} × ${i.qty} (${i.size}, ${i.color})`).join(' | ')}</small><strong>{money(o.total)} · {o.payment==='cod'?'COD':'ম্যানুয়াল বিকাশ'}</strong></div>
                <label>অর্ডার স্ট্যাটাস<select value={o.status} onChange={e=>setOrders(os=>os.map(x=>x.id===o.id?{...x,status:e.target.value}:x))}>{['নতুন অর্ডার','নিশ্চিত','প্রস্তুত','কুরিয়ারে পাঠানো','ডেলিভারি সম্পন্ন','বাতিল'].map(s=><option key={s}>{s}</option>)}</select></label>
                {o.payment==='bkash'&&<label>পেমেন্ট যাচাই<select value={o.paymentStatus} onChange={e=>setOrders(os=>os.map(x=>x.id===o.id?{...x,paymentStatus:e.target.value}:x))}><option>যাচাই বাকি</option><option>যাচাই হয়েছে</option><option>পেমেন্ট বাতিল</option></select></label>}
                <button className="secondary" onClick={()=>flash('ডেমো: SMS পাঠানো হয়নি; বাস্তব SMS গেটওয়ে লাগবে।')}>SMS প্রিভিউ</button>
              </div>):<p className="empty">এখনো অর্ডার নেই। দোকান থেকে একটি ডেমো অর্ডার দিন।</p>}
            </section>}

            {tab==='settings'&&<section className="panel">
              <h2>ডেলিভারি ও স্টোর সেটিংস</h2>
              <form className="settings" onSubmit={e=>{e.preventDefault();flash('সেটিংস সংরক্ষণ হয়েছে')}}>
                <label>স্লোগান<input value={settings.tagline} onChange={e=>setSettings({...settings,tagline:e.target.value})}/></label>
                <label>স্থানীয় এলাকা<input value={settings.localArea||'ধোবাউড়া'} onChange={e=>setSettings({...settings,localArea:e.target.value})}/></label>
                <label>স্থানীয় ডেলিভারি চার্জ (৳)<input type="number" min="0" value={settings.localFee} onChange={e=>setSettings({...settings,localFee:+e.target.value})}/></label>
                <label>ডিফল্ট কুরিয়ার চার্জ (৳)<input type="number" min="0" value={settings.courierFee} onChange={e=>setSettings({...settings,courierFee:+e.target.value})}/></label>
                <label className="wide">পার্সোনাল বিকাশ নম্বর (ডেমো)<input value={settings.bkash} onChange={e=>setSettings({...settings,bkash:e.target.value})} placeholder="বাস্তব নম্বর পরে সেট করুন"/></label>
                <p className="wide hint">কুরিয়ারভেদে আলাদা লাইভ চার্জ, GPS, SMS, বিকাশ যাচাই ও ক্লাউড ব্যাকআপ এখনো সংযুক্ত নয়।</p>
                <button className="primary">সেটিংস সংরক্ষণ</button>
                <button type="button" className="secondary" onClick={backup}><Download size={16}/> ব্যাকআপ ডাউনলোড</button>
              </form>
            </section>}
          </div>
        </main>
      )}

      <footer>
        <div><span className="logo"><Store/></span><b>Shohag Online Store</b><p>{settings.tagline}</p></div>
        <span>© {new Date().getFullYear()} Shohag Online Store • ব্যক্তিগত ডেমো</span>
      </footer>

      {/* প্রোডাক্ট মডাল */}
      {modal?.type==='product'&&(
        <div className="shade" onClick={()=>setModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <button className="close" onClick={()=>setModal(null)}><X/></button>
            <div className="modalart">
              {modal.p.images?.[0] ? <img src={modal.p.images[0]} alt={modal.p.name}/> : <span>{modal.p.emoji}</span>}
            </div>
            <div className="modalbody">
              <h2>{modal.p.name}</h2>
              <div className="price"><b>{money(modal.p.price)}</b>{modal.p.oldPrice&&<del>{money(modal.p.oldPrice)}</del>}</div>
              <p>{modal.p.desc}</p>
              {modal.p.videos?.length>0&&(
                <div className="modal-videos">
                  {modal.p.videos.map((v,idx)=>String(v).startsWith('data:video/')?<video key={idx} src={v} controls style={{width:'100%',borderRadius:'8px',marginTop:'8px'}}/>:<a key={idx} href={v} target="_blank" rel="noreferrer" style={{display:'block',marginTop:'4px'}}>ভিডিও দেখুন</a>)}
                </div>
              )}
              <div className="pfoot" style={{marginTop:'15px'}}>
                <button className="primary" disabled={!modal.p.stock} onClick={()=>add(modal.p)}>কার্টে যোগ করুন</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* কার্ট মডাল */}
      {modal?.type==='cart'&&(
        <div className="shade" onClick={()=>setModal(null)}>
          <div className="drawer" onClick={e=>e.stopPropagation()}>
            <div className="drawerhead"><h2>শপিং কার্ট</h2><button onClick={()=>setModal(null)}><X/></button></div>
            <div className="drawerbody">
              {cart.length?cart.map(i=>(
                <div className="cartitem" key={i.key}>
                  <div><b>{i.name}</b><small>{money(i.price)} × {i.qty}</small></div>
                  <div className="qtyactions">
                    <button onClick={()=>setCart(cart.map(x=>x.key===i.key?{...x,qty:Math.max(1,x.qty-1)}:x))}>-</button>
                    <span>{i.qty}</span>
                    <button onClick={()=>setCart(cart.map(x=>x.key===i.key?{...x,qty:Math.min(i.max,x.qty+1)}:x))}>+</button>
                    <button onClick={()=>setCart(cart.filter(x=>x.key!==i.key))}><Trash2 size={14}/></button>
                  </div>
                </div>
              )):<p className="empty">কার্ট খালি</p>}
            </div>
            {cart.length>0&&(
              <div className="drawerfoot">
                <div className="totalrow"><span>মোট:</span><b>{money(subtotal)}</b></div>
                <button className="primary" onClick={()=>{setModal(null);setCheckout(true)}}>অর্ডার করতে এগিয়ে যান</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* চেকআউট ফর্ম */}
      {checkout&&(
        <div className="shade" onClick={()=>setCheckout(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <button className="close" onClick={()=>setCheckout(false)}><X/></button>
            <h2>অর্ডার কনফার্ম করুন</h2>
            <form onSubmit={order} className="checkoutform">
              <label>নাম<input name="name" required placeholder="আপনার নাম"/></label>
              <label>ফোন নম্বর<input name="phone" required placeholder="017xxxxxxxx"/></label>
              <label>ডেলিভারি ঠিকানা<textarea name="address" required placeholder="গ্রাম/রোড, থানা, জেলা"/></label>
              <label>ডেলিভারি এরিয়া
                <select name="area" onChange={e=>setCheckout({...checkout,area:e.target.value})}>
                  <option value="inside">ধোবাউড়া (লোকাল ডেলিভারি: ৳{settings.localFee})</option>
                  <option value="outside">অন্যান্য এলাকা (কুরিয়ার: ৳{settings.courierFee})</option>
                </select>
              </label>
              <label>পেমেন্ট পদ্ধতি
                <select name="payment" onChange={e=>setCheckout({...checkout,payment:e.target.value})}>
                  <option value="cod">ক্যাশ অন ডেলিভারি (COD)</option>
                  <option value="bkash">বিকাশ (ম্যানুয়াল)</option>
                </select>
              </label>
              {checkout?.payment==='bkash'&&<label>বিকাশ TrxID<input name="tx" placeholder="TrxID দিন" required/></label>}
              <div className="totalrow"><span>সর্বমোট পরিশোধ:</span><b>{money(total)}</b></div>
              <button className="primary">অর্ডার প্লেস করুন</button>
            </form>
          </div>
        </div>
      )}

      {/* অর্ডার সম্পন্ন কনফার্মেশন */}
      {done&&(
        <div className="shade" onClick={()=>setDone(null)}>
          <div className="modal center" onClick={e=>e.stopPropagation()}>
            <CheckCircle2 size={48} color="#10b981"/>
            <h2>ধন্যবাদ! অর্ডার গৃহীত হয়েছে</h2>
            <p>অর্ডার নম্বর: <b>{done.id}</b></p>
            <p>মোট বিল: <b>{money(done.total)}</b></p>
            <button className="primary" onClick={()=>setDone(null)}>ঠিক আছে</button>
          </div>
        </div>
      )}
    </div>
  );
}

const root=createRoot(document.getElementById('root'));
root.render(<App/>);
                      

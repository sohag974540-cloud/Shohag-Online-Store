# Shohag Online Store — Netlify Lightweight Pack v10

## এই প্যাকে যা আছে
- `src/main.jsx` — বর্তমান React অ্যাপ
- `src/style.css` — ডিজাইন
- `package.json` — dependencies ও build scripts
- `index.html` — অ্যাপের HTML entry
- `MASTER_BUILD_PROMPT_BN.md` — সব নির্দেশনা এক ফাইলে

## Netlify-এর জন্য
- Build command: `npm run build`
- Publish directory: `dist`

## Android মোবাইলে সহজ পথ
1. ZIP ডাউনলোড করে নিরাপদে রাখুন।
2. GitHub-এ একটি private repository তৈরি করে ZIP-এর ভেতরের ফাইলগুলো আপলোড করুন (ZIP-এর বাইরের ফোল্ডার নয়; `src`, `package.json`, `index.html` একই root-এ থাকবে)।
3. Netlify-তে GitHub repository connect করুন।
4. Build command `npm run build` এবং publish directory `dist` দিন।
5. Deploy হলে demo site পরীক্ষা করুন।

**সতর্কতা:** বর্তমান অ্যাপটি demo। Admin login নিরাপদ নয় এবং data browser `localStorage`-এ থাকে। বাস্তব গ্রাহকের তথ্য/অর্ডার নেওয়ার আগে secure backend, database, authentication, media storage ও payment integration যোগ করতে হবে।


## v11: ছবি/ভিডিও ও ইমেইল OTP
- অ্যাডমিন পণ্য ফর্মে একাধিক ছবি (প্রতি ছবি সর্বোচ্চ 3 MB), ছোট ভিডিও (প্রতি ফাইল 8 MB) অথবা ভিডিও URL যোগ করা যায়।
- ডেমো মিডিয়া browser localStorage-এ থাকে; বড় ভিডিও/প্রোডাকশনের জন্য Cloudinary/S3-জাতীয় স্থায়ী storage সংযোগ করুন। localStorage সীমিত, তাই এটি production media storage নয়।
- Admin login এখন Netlify Functions-এর `request-otp` ও `verify-otp` endpoint ব্যবহার করে।
- Netlify Site configuration → Environment variables-এ `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `OTP_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM` সেট করুন। `ADMIN_PASSWORD_HASH` হলো পাসওয়ার্ডের SHA-256 hex digest; এটি তৈরি করতে স্থানীয় নিরাপদ terminal-এ `node -e "console.log(require('crypto').createHash('sha256').update(process.argv[1]).digest('hex'))" 'YOUR_STRONG_PASSWORD'` চালান। পাসওয়ার্ড chat-এ শেয়ার করবেন না।
- Resend-এ account তৈরি করে sender domain/email verify করে API key তৈরি করুন। `EMAIL_FROM` verified sender হতে হবে।
- OTP 6 সংখ্যা, 5 মিনিটে মেয়াদ শেষ। এই lightweight demo-তে rate limiting ও durable server-side order/product database এখনও যোগ করা হয়নি; বাস্তব ব্যবসার আগে server-side rate limit, database, object storage, protected admin APIs এবং session validation যোগ/পরীক্ষা করুন।
- Build: `npm install && npm run build`; Netlify publish directory: `dist`; functions directory: `netlify/functions`.

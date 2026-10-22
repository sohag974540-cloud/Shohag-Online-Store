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

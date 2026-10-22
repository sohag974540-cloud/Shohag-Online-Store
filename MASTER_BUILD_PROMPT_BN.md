# Shohag Online Store — একক বাংলা মাস্টার নির্দেশনা

আপনি একজন অভিজ্ঞ React/Vite ই-কমার্স ডেভেলপার। এই প্রজেক্টটি Android মোবাইল থেকে পরিচালনা করার উপযোগী করে ধাপে ধাপে সম্পূর্ণ করুন। প্রজেক্টের নাম **Shohag Online Store**। স্লোগান: **আপনার চাহিদার সব সমাধান, এখন এক ঠিকানায়**। ডিজাইন আধুনিক, প্রফেশনাল, দ্রুত এবং সম্পূর্ণ মোবাইল-ফ্রেন্ডলি হবে। প্রথমে সাইটটি ব্যক্তিগত ডেমো হিসেবে রাখুন; মালিকের অনুমতি ছাড়া পাবলিক করবেন না।

## খুব গুরুত্বপূর্ণ নিয়ম
1. সম্পাদনার আগে বর্তমান কোডের ব্যাকআপ নিন।
2. শুধু পরামর্শ দেবেন না—অনুমোদিত হলে প্রজেক্টের প্রকৃত ফাইল সম্পাদনা করুন।
3. একবারে একটি ধাপ শেষ করুন; শেষে বাংলায় কী করেছেন, কী পরীক্ষা করেছেন এবং পরের ধাপ কী তা জানান।
4. কাজের ফিচার মুছে দিয়ে ফাইল ছোট করবেন না। অপ্রয়োজনীয়/ডুপ্লিকেট কোড ও নির্ভরতা থাকলে কারণ জানিয়ে সরান।
5. প্রতিটি বড় পরিবর্তনের পরে `npm run build` চালিয়ে ত্রুটি ঠিক করুন।
6. কোনো ফিচার কাজ না করলে সেটিকে “সম্পূর্ণ” বলবেন না। বাস্তবায়িত, ডেমো, পরীক্ষা করা, এবং বাকি—এই চারটি অবস্থা আলাদা করে রিপোর্ট করুন।
7. পাসওয়ার্ড, API key, database credentials বা secret কখনো frontend কোডে রাখবেন না।
8. Netlify-তে static frontend প্রকাশ করা যায়; কিন্তু বাস্তব লগইন, ডেটাবেস, নিরাপদ অর্ডার, ইমেইল OTP, SMS, পেমেন্ট ও মিডিয়া স্টোরেজের জন্য প্রয়োজনীয় backend/সার্ভিস আলাদাভাবে সংযোগ করতে হবে। কোনো সীমাহীন বা সবসময় বিনামূল্যের পরিষেবার প্রতিশ্রুতি দেবেন না।

## বর্তমান কোডে যা আছে
- React 18 + Vite অ্যাপ
- বাংলা storefront, নমুনা পণ্য, ক্যাটাগরি, সার্চ
- পণ্যের বিবরণ, সাইজ/রং, কার্ট ও checkout UI
- COD এবং ম্যানুয়াল bKash-এর ডেমো UI
- ডেমো অর্ডার, অর্ডার স্ট্যাটাস, পণ্য ও স্টক পরিচালনা
- ডেলিভারি চার্জ ও স্টোর সেটিংস
- JSON ব্যাকআপ ডাউনলোড
- তথ্য browser `localStorage`-এ থাকে
- অ্যাডমিন প্রবেশপথটি ডেমো মাত্র; নিরাপদ authentication নয়
- পণ্যের বাস্তব ছবি/ভিডিও আপলোড, ক্লাউড ডেটাবেস, SMS, GPS, বাস্তব পেমেন্ট, ইমেইল OTP, live chat এবং AI chatbot পূর্ণভাবে সংযুক্ত নয়

## ব্যবসার প্রয়োজনীয়তা
- স্টোর: Shohag Online Store
- স্লোগান: আপনার চাহিদার সব সমাধান, এখন এক ঠিকানায়
- ডেলিভারি: ধোবাউড়ায় নিজস্ব/স্থানীয় ডেলিভারি এবং অন্যত্র কুরিয়ার
- প্রাথমিক চার্জ: ঢাকার ভিতরে ৳৭০, ঢাকার বাইরে ৳১৫০—এগুলো বর্তমান অ্যাপের ধোবাউড়া স্থানীয়/কুরিয়ার চার্জের সঙ্গে গুলিয়ে ফেলবেন না। মালিক অ্যাডমিনে চূড়ান্ত চার্জ নির্ধারণ করবেন।
- পেমেন্ট: প্রথমে Cash on Delivery; পরে manual bKash
- অ্যাডমিনে পণ্য, দাম, স্টক, সাইজ, রং, ক্যাটাগরি, অর্ডার, কাস্টমার, ডেলিভারি চার্জ এবং সেটিংস পরিচালনা
- প্রোডাক্টে একাধিক ছবি ও ভিডিও আপলোড/স্টোরেজের ব্যবস্থা ভবিষ্যৎ ধাপে
- বিভাগ/জেলা/থানা নির্বাচন এবং GPS ব্যবহারের আগে গ্রাহকের অনুমতি
- অর্ডার নম্বর, অর্ডার ও ডেলিভারি আপডেট; SMS সার্ভিস সংযোগ লাগবে
- নিরাপত্তা: server-side authentication, role protection, email OTP/2FA এবং secret management
- ভবিষ্যৎ ফিচার: কুপন/ডিসকাউন্ট, ব্যানার, Wishlist, customer account, order tracking, reviews/ratings, FAQ, SEO, newsletter, sales analytics, backup, live chat, WhatsApp, Facebook Messenger, AI chatbot, tax/shipping settings, push notifications, marketing campaigns, supplier/staff management, activity log এবং বাংলা/ইংরেজি ভাষা

## বাস্তবায়নের ধাপ
### ধাপ ১ — বর্তমান ডেমো স্থিতিশীল করা
- ফাইল ও component পরীক্ষা করুন, responsive layout পরীক্ষা করুন।
- পণ্য খোঁজা, ক্যাটাগরি, কার্ট, checkout, অর্ডার তৈরি, স্টক কমা, status পরিবর্তন, settings save এবং backup download পরীক্ষা করুন।
- `npm run build` চালিয়ে সব error ঠিক করুন।
- এই পর্যায়ে কোনো বাস্তব পেমেন্ট/লগইন আছে বলে দাবি করবেন না।

### ধাপ ২ — ডেটা স্থায়ী করার পরিকল্পনা
- নিরাপদ backend/database নির্বাচন করে schema প্রস্তাব দিন: products, categories, customers, orders, order_items, settings, reviews, coupons, media।
- বর্তমান localStorage ডেটা migration/backup পরিকল্পনা দিন।
- credentials শুধুমাত্র server-side environment variables-এ রাখুন।
- backend প্রস্তুত না হলে mock/demo mode স্পষ্টভাবে দেখান।

### ধাপ ৩ — নিরাপদ অ্যাডমিন
- আসল authentication ও server-side authorization; শুধু frontend-এ পাসওয়ার্ড যাচাই গ্রহণযোগ্য নয়।
- admin role, email verification/OTP, rate limiting এবং নিরাপদ session যোগ করুন।
- অননুমোদিত ব্যবহারকারী যেন admin data বা order mutation করতে না পারে তা পরীক্ষা করুন।

### ধাপ ৪ — অর্ডার ও ব্যবসার কাজ
- পণ্য/স্টক/অর্ডার, অর্ডার নম্বর, স্ট্যাটাস, customer details, ডেলিভারি চার্জ, COD এবং manual bKash verification।
- stock race condition, duplicate order, input validation এবং ভুল/খালি তথ্য পরীক্ষা করুন।
- SMS, email, payment gateway বা bKash API ব্যবহার করতে হলে সঠিক provider credentials এবং অনুমোদিত integration লাগবে; demo-তে টাকা পাঠাতে বলবেন না।

### ধাপ ৫ — অতিরিক্ত ফিচার অগ্রাধিকার অনুযায়ী
- প্রথমে: product image storage, customer accounts, order tracking, coupon, wishlist, review, FAQ ও SEO।
- পরে: live chat, WhatsApp/Messenger, AI chatbot, push notification, newsletter, analytics, marketing ও supplier/staff tools।
- সব ফিচার একসঙ্গে বানানোর চেষ্টা না করে ছোট milestone-এ কাজ করুন। প্রতিটি milestone build/test করুন।

### ধাপ ৬ — Netlify deployment
- এটি Vite project; build command `npm run build`, publish directory `dist`।
- GitHub repository-তে source রাখুন এবং Netlify-তে “Add new project / Import an existing project” দিয়ে repository connect করুন।
- Build settings: `npm run build`; publish directory: `dist`।
- কোনো backend/API secret frontend environment variable-এ রাখবেন না। Vite-এর `VITE_` variable browser-এ প্রকাশিত হতে পারে।
- Deploy শেষে live site, mobile layout, console/build errors ও core shopping flow পরীক্ষা করুন।
- frontend-only demo deploy হওয়া মানে production e-commerce ready হওয়া নয়। ডেটাবেস, auth, storage ও payment আলাদা করে configure/test করতে হবে।

## প্রতিটি ধাপ শেষে রিপোর্ট
বাংলায় এই পাঁচটি বিষয় জানান:
1. কী পরিবর্তন হয়েছে
2. কোন ফাইল পরিবর্তন হয়েছে
3. Build সফল হয়েছে কি না
4. কোন পরীক্ষা সফল/ব্যর্থ হয়েছে
5. পরবর্তী একটিমাত্র করণীয় ধাপ

প্রথম কাজ: বর্তমান প্রজেক্ট পরীক্ষা করে ধাপ ১ সম্পন্ন করুন। কিছু পরিবর্তনের আগে ব্যাকআপ নিন।


## v11 আপডেটের নোট
বর্তমান কোডে admin product form-এ image/video file/link UI এবং Netlify Functions-ভিত্তিক email OTP flow যোগ করা হয়েছে। OTP চালু করতে README_BN.md-এর environment variables সেটআপ করতে হবে। Media demo-তে localStorage-এ থাকে; production object storage ও server-side database/auth enforcement যোগ না করে বাস্তব অর্ডার চালু করবেন না।

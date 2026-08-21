# Deploy and Host

To deploy and host your CityU Hall 14 Web Application online for free with low maintenance, the best option is to pair **Vercel** for the frontend with **Supabase** for the backend database and storage.

---

### Step 1: Deploy the Database & Storage (Supabase)

Since you are already using Supabase, your database and storage buckets are hosted live in the cloud by default.

1. Go to your **[Supabase Dashboard](https://supabase.com)**.
2. Go to **Project Settings** $\rightarrow$ **API**.
3. Locate and copy your project credentials:
* **Project URL** (e.g., `[https://xyzcompany.supabase.co](https://xyzcompany.supabase.co)`)
* **`anon` public key** (safe to use in frontend JS)
* **`service_role` secret key** (strictly for backend administrative tasks)



---

### Step 2: Push Your Code to GitHub

1. Create a free account on **[GitHub](https://github.com)**.
2. Create a new repository (e.g., `hall14-vacuum-tracker`).
3. Commit your code and push it to GitHub:
```bash
git init
git add .
git commit -m "Initial commit for Hall 14 app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hall14-vacuum-tracker.git
git push -u origin main

```



---

### Step 3: Deploy the Frontend Application (Vercel)

Vercel provides native, free hosting tailored for React and Next.js applications, offering an automatic global CDN for fast page loads.

1. Sign up for a free account at **[Vercel](https://vercel.com)** using your GitHub account.
2. Click **Add New** $\rightarrow$ **Project** and select your `hall14-vacuum-tracker` repository.
3. In the project setup screen, expand **Environment Variables** and add your Supabase credentials:
* `NEXT_PUBLIC_SUPABASE_URL` = *Your Supabase Project URL*
* `NEXT_PUBLIC_SUPABASE_ANON_KEY` = *Your Supabase Anon Key*


4. Click **Deploy**. Vercel will build your project and generate a live public URL (e.g., `[https://hall14-vacuum-tracker.vercel.app](https://hall14-vacuum-tracker.vercel.app)`).

---

### Step 4: Configure Authentication Redirects (Google OAuth & OTP)

Once Vercel gives you your live URL, update your authentication settings so redirects function properly:

1. In your **Supabase Dashboard**, navigate to **Authentication** $\rightarrow$ **URL Configuration**.
2. Set the **Site URL** to your live Vercel domain:
`[https://hall14-vacuum-tracker.vercel.app](https://hall14-vacuum-tracker.vercel.app)`
3. Add your Vercel URL and local development URL to **Redirect URLs**:
* `[https://hall14-vacuum-tracker.vercel.app/](https://hall14-vacuum-tracker.vercel.app/)**`
* `http://localhost:3000/**`



---

### Deployment Workflow Summary

* **Automated CI/CD:** Every time you push an update or bug fix to your GitHub `main` branch, Vercel automatically builds and redeploys the live site within seconds.
* **Cost:** $0/month (covered by the Vercel Hobby Free Tier and Supabase Free Tier).
* **NTAG213 Programming:** You can now write your final production URLs directly to your physical NTAG213 stickers using *NFC Tools*:
`[https://hall14-vacuum-tracker.vercel.app/checkout?v=3&key=YOUR_SECRET_KEY](https://hall14-vacuum-tracker.vercel.app/checkout?v=3&key=YOUR_SECRET_KEY)`
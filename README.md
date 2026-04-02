# ComplianceShield AI 🛡️
### AI-Powered GDPR & HIPAA Compliance Generator

> **Stop paying $3,000 for legal compliance.** Generate enterprise-grade compliance bundles in under 5 minutes — powered by a 2-step AI engine, secured with rate limiting, bot protection, and Supabase Row Level Security.

---

## 🌟 What You're Getting

This is a **fully production-ready SaaS template** built with the latest stack:

| Feature | Details |
|---------|---------|
| 🤖 2-Step AI Engine | Architect → Expert Writer for higher quality output |
| 🔐 Google OAuth | One-click sign-in, sessions stored in Supabase |
| 🗄️ Supabase Database | Row Level Security — users only see their own data |
| 🛡️ Bot Protection | API-level bot score check |
| ⏱️ Rate Limiting | 5 reports/hour per IP (memory-based, upgradeable to Redis) |
| 🌙 Dark / Light Mode | Full theme toggle across all pages |
| 📄 PDF Download | Native browser print → PDF, audit-logged |
| 🔒 Immutable Reports | No UPDATE policy — reports can't be tampered with |
| 📊 Dashboard | Stats, industry-coded report cards, per-report view/download |
| ✅ Input Validation | Zod schema validation on all AI inputs |

---

## ⚡ Quick Start (5 Steps to Live)

### Step 1 — Clone & Install

```bash
git clone <your-repo-url>
cd your-project
npm install
```

### Step 2 — Create Your Supabase Project

1. Go to **[supabase.com](https://supabase.com)** → New Project
2. Copy your **Project URL** and **Publishable Key** (under Project Settings → API)
3. Create a `.env.local` file in the project root:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY_HERE

# OpenRouter AI (required)
OPENROUTER_API_KEY=sk-or-v1-YOUR_OPENROUTER_KEY_HERE
```

### Step 3 — Set Up the Database

Run these SQL files **in order** in your Supabase SQL Editor (Dashboard → SQL Editor):

```
1. supabase_schema.sql     ← Creates tables
2. supabase_phase_4.sql    ← Adds user_id columns
3. supabase_phase_5.sql    ← Complete RLS security policies + indexes
```

That's it — your database is live and locked down.

### Step 4 — Get Your API Keys

#### OpenRouter (AI Engine) — Free to start
1. Go to **[openrouter.ai](https://openrouter.ai)** → Sign Up → Keys
2. Create a new API key
3. Add to `.env.local` as `OPENROUTER_API_KEY`
4. The app uses **Google Gemma 2 9B** (free tier) by default — zero cost to test

#### Supabase Google OAuth (optional but recommended)
1. Go to your Supabase Dashboard → Authentication → Providers → Google
2. Follow the [Google OAuth setup guide](https://supabase.com/docs/guides/auth/social-login/auth-google)
3. Set **Authorized redirect URI** to: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`

### Step 5 — Run It

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** — your app is live! 🎉

---

## 🏗️ Project Structure

```
├── app/
│   ├── page.tsx              ← Landing page (hero, pricing, CTA)
│   ├── login/page.tsx        ← Email + Google Sign-in
│   ├── dashboard/page.tsx    ← User's compliance archive
│   ├── wizard/page.tsx       ← 10-step AI questionnaire
│   ├── actions/
│   │   ├── generateCompliance.ts  ← 2-step AI engine + DB save
│   │   ├── audit.ts               ← PDF download audit logging
│   │   └── questions.ts           ← Dynamic AI question generation
│   └── auth/
│       ├── callback/         ← OAuth redirect handler
│       └── signout/          ← Sign-out route
├── components/
│   ├── ComplianceWizard.tsx  ← Multi-step form + report display
│   ├── ReportCard.tsx        ← Per-report view/download (client)
│   ├── ThemeToggle.tsx       ← Dark/light mode toggle
│   └── ThemeProvider.tsx     ← next-themes wrapper
├── lib/
│   ├── ai-client.ts          ← OpenRouter API wrapper + Zod schema
│   ├── client.ts             ← Supabase browser client
│   ├── server.ts             ← Supabase server client
│   ├── middleware.ts         ← Session refresh middleware
│   ├── rate-limit.ts         ← IP-based rate limiting (5/hour)
│   └── bot-protection.ts     ← Bot score check
├── supabase_schema.sql       ← Initial DB tables
├── supabase_phase_4.sql      ← Auth columns
└── supabase_phase_5.sql      ← Complete RLS security
```

---

## 🔒 Security Architecture

### Database Security (Supabase RLS)
```
Anonymous users → Can INSERT reports (no login required to try)
Authenticated users → Can INSERT their OWN reports only (user_id = JWT uid)
Authenticated users → Can SELECT their OWN reports only
Authenticated users → Can DELETE their OWN reports only
No UPDATE policy → Reports are immutable (audit integrity)
```

### Application Security
- **Bot Protection** — API-level bot score check on every generation
- **Rate Limiting** — 5 reports per IP per hour (memory store, upgradeable to Redis/Upstash)
- **Zod Validation** — All AI inputs sanitized before processing
- **RLS Enforcement** — Even if someone guesses a UUID, Supabase blocks cross-user access
- **Session Middleware** — All `/dashboard` routes require authentication

---

## 🚀 Deploying to Production (Vercel)

```bash
# 1. Push to GitHub
git add . && git commit -m "production ready" && git push

# 2. Import repo at vercel.com/new

# 3. Add environment variables in Vercel dashboard:
#    NEXT_PUBLIC_SUPABASE_URL
#    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
#    OPENROUTER_API_KEY

# 4. Deploy — done!
```

> **Important:** After deploying, update your Supabase OAuth redirects to include your Vercel production URL.

---

## 🎨 Customization Guide

### Change the Brand Name
Search & replace `ComplianceShield AI` across all `.tsx` files.

### Change the Pricing
Edit the `$49` value in `app/page.tsx` → pricing section.

### Upgrade to a Better AI Model
In `app/actions/generateCompliance.ts`, replace:
```ts
'google/gemma-2-9b-it:free'
```
With any OpenRouter model, e.g.:
```ts
'anthropic/claude-3-haiku'     // Fast + cheap
'openai/gpt-4o-mini'           // Great quality
'meta-llama/llama-3.1-70b-instruct:free'  // Free, powerful
```

### Upgrade Rate Limiting to Redis
Replace the memory store in `lib/rate-limit.ts` with [Upstash Redis](https://upstash.com/) for production-grade limiting across serverless instances.

### Add Stripe Payments
Use the [Vercel + Stripe tutorial](https://vercel.com/guides/getting-started-with-nextjs-typescript-stripe) to add a paywall on `/wizard` after free usage.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL + Auth) |
| AI | OpenRouter (model-agnostic) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Theme | next-themes |
| Validation | Zod |

---

## 📋 Environment Variables Reference

| Variable | Required | Where to Get It |
|----------|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ Yes | Supabase Dashboard → Settings → API |
| `OPENROUTER_API_KEY` | ✅ Yes | openrouter.ai → Keys |

---

## ❓ FAQ

**Q: Does the AI generation cost money?**
A: No — the default model (`google/gemma-2-9b-it:free`) is completely free on OpenRouter. You can upgrade to paid models for better quality.

**Q: Can I use this without setting up Google OAuth?**
A: Yes. Email/password login works out of the box. Google OAuth is optional.

**Q: What happens if a user isn't logged in?**
A: They can still use the wizard and generate reports. Reports are saved with their IP. Once they sign up, future reports are tied to their account.

**Q: Is the database secure against SQL injection?**
A: Yes. Supabase uses parameterized queries exclusively. RLS enforces user isolation at the database level.

---

*Built with ❤️ by ComplianceShield AI — The modern compliance platform for the 2026 legal landscape.*

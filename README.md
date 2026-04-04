# ComplianceShield AI 🛡️ — Premium Enterprise AI Compliance Asset
### Launch a Turnkey AI Legal SaaS in 15 Minutes.

ComplianceShield AI is a state-of-the-art, production-ready SaaS codebase designed for high-value resale. It features a unique **AI-Powered Questionnaire** that generates tailored compliance audits using exclusively free-tier cloud infrastructure.

---

## 🏛️ 💎 Commercial Resale: Buyer Pre-Requisites
**This is a professional, turnkey codebase. To launch this business, the owner/buyer will need the following accounts and keys:**

1.  **Supabase Backend**: Required for secure database storage, User Auth (Google OAuth), and Row Level Security (RLS).
2.  **Puter.js (Free AI)**: No API key needed. Puter.js provides free GPT-4o access directly in the browser.
3.  **Google Cloud Console**: Required to enable the high-converting "Continue with Google" sign-in flow.

---

## ⚡ 15-Minute Executive Launch Guide

### 1. Environment Configuration
Create a `.env.local` file using the provided `.env.example` template. You must provide your own Supabase keys.

```env
# ── CORE INFRASTRUCTURE
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_public_key
```

### 2. Database Synchronization
Run the `supabase_production.sql` master script in your Supabase SQL Editor. This instantly provisions:
-   **Multi-Tenant Reports Table**: Each user only sees their own data (RLS enforced).
-   **Security Audit Logs**: Tracks every download for traceability.
-   **Performance Indexes**: Optimized for sub-millisecond dashboard loading.

### 3. Deploy & Profit
Deploy to Vercel with one click. Simply add your environment variables in the Vercel dashboard and you are live.

---

## 💎 The "Resale Edge" (The Selling Points)

| Feature | Market Value |
|---------|-------------|
| 🚀 **15s Speed Cycle** | Tuned for executive patience. Reports generate in seconds. |
| 🛡️ **Free AI Engine** | Puter.js provides free GPT-4o access — no API keys, no costs. |
| 🎨 **Executive UI** | Premium staggered animations, light/dark mode, and glassmorphism. |
| ⚖️ **Legal Grade** | IP-based rate limiting, bot protection, and full database security. |

---

## 🏗️ Technical Architecture
-   **Framework**: Next.js 16 (Turbopack + App Router)
-   **Logic**: AI-Powered Questionnaire + Report Generator
-   **AI Engine**: Puter.js (Free GPT-4o in browser)
-   **DB/Auth**: Supabase (Postgres)
-   **Styling**: Tailwind CSS v4 + Framer Motion 12

---
*Commercial Resale License: This source code is sold as a foundation for your own AI agency or SaaS business. Rebrand, Deploy, and Scale.*

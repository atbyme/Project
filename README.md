# ComplianceShield AI 🛡️ — The Enterprise-Grade AI Compliance Engine
### Launch Your Own AI Legal Practice or Agency in 15 Minutes.

ComplianceShield AI is a high-value, production-ready SaaS MVP designed for the 2026 legal landscape. It transforms complex regulatory requirements (GDPR, HIPAA, AI Act) into professional, audit-ready PDF bundles using a sophisticated **2-Step AI "Architect & Expert" Engine**.

> **Commercial Ready**: This isn't just a demo. It includes professional grade security (RLS), IP-based rate limiting, Bot protection, and a seamless Google OAuth funnel.

---

## 💎 The "Buyer's Advantage" (Why this sells)

| Feature | The "Magic" Behind It |
|---------|---------|
| 🤖 **2-Step AI Engine** | Uses a "Senior Partner" architect to outline, then an "Expert Writer" to draft. Result: Superior legal tone. |
| 🚀 **Live Demo Mode** | Convert buyers instantly with a pre-built "High-Value Sample" they can see without signing up. |
| 🛡️ **Trial Funnel** | Unsigned users can generate 1 real report (IP-restricted) to see the value before they buy a subscription. |
| 🔐 **Premium Security** | Full Supabase Row Level Security (RLS). User A can NEVER see User B's data—enforced at the DB level. |
| 📊 **Modern Dashboard** | A sleek, dark-mode focused archive where users can manage, view, and re-download their compliance bundles. |
| ⚡ **Next.js 16 Proxy** | Built on the latest "Advanced Agentic Coding" standards with the new Proxy convention. |

---

## ⚡ 15-Minute Launch Guide (Quick Start)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd compliance-shield-ai
npm install
```

### 2. Connect Your Backend (Supabase)
1. Create a project at **[supabase.com](https://supabase.com)**.
2. Go to **Settings > API** and copy your `URL` and `Anon/Public Key`.
3. Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
OPENROUTER_API_KEY=your-key-from-openrouter.ai
```

### 3. One-Click Database Setup
Go to your **Supabase SQL Editor** and run the contents of this file:
- `supabase_production.sql` — This sets up all tables, indexes, and strict security policies in one go.

### 4. Enable Google Sign-In (Optional)
- Go to **Authentication > Providers > Google** in Supabase and toggle it **ON**.
- Add your Google Client ID and Secret (from Google Cloud Console).
- *Benefit*: This enables the high-converting "Continue with Google" button.

### 5. Go Live
```bash
npm run dev
```
Navigate to `http://localhost:3000` and view your new empire! 🚀

---

## 🏗️ Project Architecture (For Developers)

```text
├── app/
│   ├── page.tsx              ← High-converting landing page (built for sales)
│   ├── login/page.tsx        ← "Humanized" welcome & signup flow
│   ├── dashboard/page.tsx    ← Secure user archive
│   ├── wizard/page.tsx       ← 10-step dynamic AI questionnaire
│   ├── actions/
│   │   ├── generateCompliance.ts  ← The AI Engine (Architect + Expert flows)
│   │   ├── audit.ts               ← Security audit logging for downloads
│   │   └── questions.ts           ← Dynamic context-aware AI questions
│   └── proxy.ts              ← Root session refresh (Next.js v16 convention)
├── components/
│   └── ComplianceWizard.tsx  ← State-of-the-art multi-step generator
├── lib/
│   ├── demo-data.ts          ← The "View Sample" high-quality data
│   ├── ai-client.ts          ← OpenRouter + Zod schema validation
│   ├── proxy.ts              ← Server-side session management
│   ├── rate-limit.ts         ← IP-based trail protection (5/hour)
│   └── bot-protection.ts     ← Anti-bot shield
└── supabase_production.sql   ← Master database & security script
```

---

## 🚀 Scaling & Monetization

- **Stripe Integration**: Easily add a paywall to the `/wizard` completion step to charge for PDF downloads.
- **Agency Whitelabel**: Change the brand name in `app/page.tsx` and resell this as a service to law firms.
- **Enterprise Plan**: Upgrade the AI Model in `generateCompliance.ts` to `anthropic/claude-3-5-sonnet` for ultra-premium reports.

---

## 🛠️ Tech Stack: The 2026 Ready Bundle

- **Framework**: Next.js 16 (App Router + Proxy Convention)
- **Styling**: Tailwind CSS v4 (Rich aesthetics, glassmorphism)
- **Database/Auth**: Supabase (Postgres + RLS)
- **AI Infrastructure**: OpenRouter (Model-agnostic)
- **Animations**: Framer Motion 12 (Fluid transitions)
- **Security**: Bot Protection + IP Rate Limiting + Zod Validation

## 🛠️ System Requirements
- **Node.js 20.x or higher** — Required for Next.js 16 App Router.
- **npm 10.x or higher** — For dependency management.
- **Supabase Account** — Free tier is perfectly fine for launch.
- **OpenRouter Account** — To power the AI Engine (Gemma 2 is free).

---

## 📈 Deep-Dive Usage Guide

### 🧱 For the Owner: Scaling & Customization
- **Change the Brand**: Search & replace `ComplianceShield AI` across all `.tsx` files.
- **Set Pricing**: Edit the pricing cards in `app/page.tsx`.
- **Switch AI Models**: In `app/actions/generateCompliance.ts`, replace the model string with any [OpenRouter Model ID](https://openrouter.ai/models).

### 📋 For the End-User: The Wizard Experience
The **ComplianceShield AI Wizard** uses 10 dynamic steps. Instead of static forms, it asks questions based on previous answers to build a 100% custom context.

1. **Step 1-10**: User answers simple industry and data-handling questions.
2. **AI Generation**: The 2-Step Engine builds the structure and then fills in legal details.
3. **One-Time Trial**: Unsigned users can generate **one report** from their IP. Their second attempt will prompt a "Trial Limit Reached" message, driving conversion.
4. **Secure Download**: Clicking **Download PDF** logs the access in the `audit_logs` table for full traceability.

---

## 📋 Commercial License Setup

This source code is designed to be a foundation for your business. Replace "ComplianceShield AI" with your own brand name and you are ready to ship.

*Built with ❤️ for the next generation of legal startups.*


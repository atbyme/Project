# ComplianceShield AI (Phase 2 MVP)

**ComplianceShield AI** is a world-class SaaS engine designed to automate GDPR, HIPAA, and industry-standard security audits for small-to-medium businesses. Built for the 2026 legal landscape.

## 🚀 Phase 2 Features (Current)
- **Dynamic AI Consultant**: 10 context-aware questions generated on-the-fly by an AI Architect.
- **2-Step AI Synthesis**: An "Architect" agent builds the prompt, and an "Expert" agent writes the final 2,000-word bundle.
- **Professional PDF Engine**: 1-click high-fidelity PDF generation with linkable Table of Contents.
- **Security Audit Trail**: Every download is silenty logged with IP, Device Type, and Timestamp for legal traceability.
- **Enterprise Security**: Built-in IP-based Rate Limiting (5/hour) and Anti-Bot/Scraper protection.

---

## 🛠️ How to Use

1. **Clone & Install**:
   ```bash
   git clone <your-repo-url>
   cd complianceshield-ai
   npm install
   ```

2. **Environment Setup**:
   Create a `.env.local` file in the root:
   ```env
   OPENROUTER_API_KEY=your_key_here
   GEMINI_API_KEY=your_fallback_key_here
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Start the Audit**:
   Navigate to [http://localhost:3000/wizard](http://localhost:3000/wizard) and answer the 10 dynamic AI questions.

---

## 🏗️ Technical Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS (Dark Mode / Glassmorphism)
- **Animations**: Framer Motion
- **AI Models**: OpenRouter (Llama 3 70B Expert / 8B Architect)
- **PDF Engine**: jsPDF + html2canvas
- **Validation**: Zod (Strict Schema Enforcement)

---

## 📧 Reviews & Feedback
For any reviews, feedback, or custom implementation requests, please contact:
**Email**: `cat.elegion38`

---

## 📊 Phase 3 Roadmap
- [ ] **MongoDB Integration**: Permanent report storage & user sessions.
- [ ] **Pro Dashboard**: A Bento-style dashboard for managing multiple compliance projects.
- [ ] **Stripe Billing**: Tiered access for Professional and Enterprise users.

---
*Phase 2 Status: Professional MVP Ready.*

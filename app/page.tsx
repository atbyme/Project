import { Shield, CheckCircle2, ArrowRight, Lock, Zap, FileText, Sparkles, AlertTriangle, Clock, DollarSign, TrendingUp, Users, Globe, Award } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { createClient } from '@/lib/server';
import React from 'react';


export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-emerald-500/30 selection:text-emerald-700 dark:selection:text-emerald-300">
      {/* Glow background mesh */}
      <div className="fixed inset-0 glow-mesh pointer-events-none opacity-60 z-0" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-foreground/[0.07] bg-background/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_14px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-transform">
              <Shield className="w-4 h-4 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-emerald-500">
              ComplianceShield <span className="text-emerald-500">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-6 text-sm text-foreground/50">
            <a href="#why"      className="hidden md:block hover:text-foreground transition-colors">Why Us</a>
            <a href="#how"     className="hidden md:block hover:text-foreground transition-colors">How it works</a>
            <a href="#pricing" className="hidden md:block hover:text-foreground transition-colors">Pricing</a>
            {user && <Link href="/dashboard" className="hidden md:block hover:text-emerald-500 transition-colors font-medium">Archive</Link>}
            <ThemeToggle />
            <Link
              href={user ? "/dashboard" : "/login"}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all text-sm shadow-[0_0_12px_rgba(16,185,129,0.25)]"
            >
              {user ? 'Go to Dashboard' : 'Sign In'}
            </Link>
          </div>
        </div>
      </nav>


      <main className="relative z-10">
        {/* Hero */}
        <section className="px-6 pt-32 pb-24 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold animate-fade-in">
              <Zap className="w-3.5 h-3.5" />
              <span>Next-Gen Compliance for 2026</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
              Stop paying $3,000 <br />for compliance.
            </h1>
            <p className="text-xl text-foreground/40 max-w-2xl mx-auto leading-relaxed">
              Generate legally-formatted GDPR and HIPAA bundles in 5 minutes for the price of a coffee.
              Designed with ❤️ for small firms that need enterprise security without the bureaucracy.

            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/wizard"
                className="w-full sm:w-auto px-8 py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(16,185,129,0.3)]"
              >
                Generate Your First Document Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/wizard?demo=true"
                className="w-full sm:w-auto px-8 py-4 bg-foreground/5 text-foreground font-semibold rounded-xl hover:bg-foreground/10 border border-foreground/10 transition-all text-center flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-500" />
                View Live Sample
              </Link>
            </div>

          </div>
        </section>

        {/* Social Proof */}
        <section className="px-6 py-12 border-y border-foreground/[0.06] bg-foreground/[0.015]">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-xs font-bold text-foreground/40 dark:text-foreground/25 uppercase tracking-widest mb-8">
              Trusted by 500+ law clinics and accounting startups
            </p>

            <div className="flex flex-wrap justify-center gap-x-16 gap-y-6 opacity-30">
              {['ACME LEGAL', 'MEDIX', 'DUE DILIGENCE', 'SECURELY', 'SHIELD LAW'].map((name) => (
                <span key={name} className="text-xl font-bold tracking-tighter cursor-default hover:opacity-70 transition-opacity">{name}</span>
              ))}
            </div>
          </div>
        </section>

        {/* What It Solves */}
        <section className="px-6 py-32 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent">
          <div className="max-w-7xl mx-auto space-y-20">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">The Compliance Crisis</h2>
              <p className="text-foreground/40 max-w-2xl mx-auto text-lg">Every day, businesses lose clients, face fines, and lose trust because they can't afford enterprise compliance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: DollarSign,
                  title: '$3,000+ Per Audit',
                  desc: 'Traditional compliance consultants charge thousands for a single report. Most small firms simply can\'t afford it — and risk everything.',
                  stat: '73% of SMBs skip compliance due to cost',
                  color: 'red',
                },
                {
                  icon: Clock,
                  title: 'Weeks of Delays',
                  desc: 'Manual audits take 2-6 weeks. By the time you get your report, regulations may have changed. Speed is a competitive advantage.',
                  stat: 'Average wait: 14 business days',
                  color: 'amber',
                },
                {
                  icon: AlertTriangle,
                  title: 'Generic Templates',
                  desc: 'Off-the-shelf compliance templates don\'t address your specific industry, size, or risk profile. One-size-fits-all means one-size-fits-none.',
                  stat: '89% of templates miss key requirements',
                  color: 'orange',
                },
              ].map((item) => (
                <div key={item.title} className="glass-card p-8 rounded-3xl space-y-6 relative overflow-hidden group hover:border-red-500/20 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
                    <item.icon className="w-7 h-7 text-red-500" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-foreground/40 leading-relaxed text-sm">{item.desc}</p>
                  </div>
                  <div className="pt-4 border-t border-foreground/5">
                    <p className="text-xs font-bold text-red-400/60 uppercase tracking-wider">{item.stat}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why ComplianceShield AI */}
        <section id="why" className="px-6 py-32 scroll-mt-20">
          <div className="max-w-7xl mx-auto space-y-20">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                <Award className="w-3.5 h-3.5" />
                <span>The ComplianceShield Advantage</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">Why Firms Choose Us</h2>
              <p className="text-foreground/40 max-w-2xl mx-auto text-lg">AI-powered compliance that's faster, smarter, and built for the way modern businesses actually operate.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: Zap,
                  title: '10-Question AI Audit',
                  desc: 'Answer 10 smart, adaptive questions and get a complete compliance report in under 5 minutes. Our AI reads every answer and tailors the next question to your exact situation.',
                  highlight: '5 minutes vs 14 days',
                },
                {
                  icon: Shield,
                  title: 'Industry-Specific Reports',
                  desc: 'Healthcare, SaaS, Finance, Legal — every report is customized to your sector\'s specific regulations. No generic templates. No copy-paste compliance.',
                  highlight: 'GDPR, HIPAA, SOC 2 & more',
                },
                {
                  icon: TrendingUp,
                  title: 'Close Deals Faster',
                  desc: 'Enterprise clients demand compliance proof. Show them a professional, board-ready audit in minutes — not weeks. Win contracts your competitors lose.',
                  highlight: '3x faster deal closure',
                },
                {
                  icon: Globe,
                  title: 'Built for Global Business',
                  desc: 'Multi-jurisdiction compliance handled automatically. Whether you serve EU, US, or global clients — your reports cover every applicable regulation.',
                  highlight: 'Multi-region support',
                },
              ].map((item) => (
                <div key={item.title} className="glass-card p-10 rounded-3xl space-y-6 relative overflow-hidden group hover:border-emerald-500/20 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                    <item.icon className="w-7 h-7 text-emerald-500" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-foreground/40 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="pt-4 border-t border-foreground/5">
                    <p className="text-xs font-bold text-emerald-500/60 uppercase tracking-wider">{item.highlight}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Importance / Trust Section */}
        <section className="px-6 py-32 bg-foreground/[0.015] border-y border-foreground/[0.06]">
          <div className="max-w-5xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">Why Compliance Can't Wait</h2>
              <p className="text-foreground/40 max-w-2xl mx-auto text-lg">Non-compliance isn't just a legal risk — it's a business survival risk.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {[
                { number: '$2.4M', label: 'Average GDPR fine per violation', sublabel: 'Source: EU Data Protection Board 2025' },
                { number: '68%', label: 'of clients check compliance before signing', sublabel: 'Source: B2B Trust Survey 2025' },
                { number: '43%', label: 'of data breaches happen at non-compliant firms', sublabel: 'Source: CyberRisk Intelligence Report' },
              ].map((stat) => (
                <div key={stat.label} className="space-y-3">
                  <div className="text-5xl md:text-6xl font-black text-emerald-500">{stat.number}</div>
                  <p className="text-foreground/60 font-semibold">{stat.label}</p>
                  <p className="text-xs text-foreground/25">{stat.sublabel}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how" className="px-6 py-32">
          <div className="max-w-7xl mx-auto space-y-20">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">The 10-Question Success Path</h2>
              <p className="text-foreground/40 max-w-xl mx-auto">Skip the consultants. Our AI prompts you for exactly what it needs and builds the rest.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Answer', desc: 'Complete our guided questionnaire in under 10 minutes.', icon: FileText },
                { step: '02', title: 'Generate', desc: 'Our AI synthesizes legal requirements for your specific niche.', icon: Zap },
                { step: '03', title: 'Secure', desc: 'Download your bundle and close that high-value deal.', icon: Lock },
              ].map((item) => (
                <div key={item.step} className="glass-card p-10 rounded-3xl space-y-6 relative overflow-hidden group hover:border-emerald-500/20 transition-all">
                  <div className="absolute top-0 right-0 p-6 text-8xl font-black text-foreground/5 group-hover:text-emerald-500/5 transition-colors">{item.step}</div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{item.title}</h3>
                    <p className="text-foreground/40 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="px-6 py-32">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-5xl font-bold leading-tight">Simple Pricing.<br />Zero Surprise.</h2>
                <p className="text-foreground/40 max-w-sm">No yearly commitments. Cancel anytime. All the documents you need to be compliant.</p>
                <div className="space-y-4">
                  {['GDPR & HIPAA Templates', 'Automatic Law Updates', 'Secure Document Storage', 'Unlimited Export'].map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-foreground/60">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-px bg-gradient-to-b from-emerald-500/40 to-transparent rounded-[2.5rem]">
                <div className="bg-background p-10 rounded-[2.4rem] space-y-8 border border-foreground/[0.06]">
                  <div>
                    <h3 className="text-lg font-medium text-emerald-500">Unlimited Plan</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-6xl font-bold tracking-tighter">$49</span>
                      <span className="text-foreground/40">/month</span>
                    </div>
                  </div>
                  <Link
                    href="/login"
                    className="block w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black text-center font-bold rounded-xl transition-all"
                  >
                    Start Your Trial Free
                  </Link>
                  <p className="text-center text-xs text-foreground/30">No credit card required for trial</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-32">
          <div className="max-w-7xl mx-auto glass-card rounded-[3rem] p-16 md:p-28 text-center space-y-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] pointer-events-none" />
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Ready to close that deal?</h2>
            <p className="text-xl text-foreground/40 max-w-xl mx-auto leading-relaxed">
              Join 500+ firms that secure their clients using ComplianceShield AI.
            </p>
            <Link
              href="/wizard"
              className="inline-block px-12 py-5 bg-emerald-500 text-black font-bold rounded-2xl hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_40px_rgba(16,185,129,0.2)]"
            >
              Generate Your First Document Free
            </Link>
          </div>
        </section>
      </main>

      <footer className="px-6 py-12 border-t border-foreground/[0.06] text-center text-foreground/25 text-sm">
        <p>© 2026 ComplianceShield AI. Built with ❤️ for the modern firm. Secure, AI-Driven, Human-Focused.</p>

      </footer>
    </div>
  );
}

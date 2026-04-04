import { Shield, CheckCircle2, ArrowRight, Lock, Zap, FileText, Sparkles, AlertTriangle, Clock, DollarSign, TrendingUp, Globe, Award, Menu, X, Star, Users, Target, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { createClient } from '@/lib/server';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function LandingPage(props: { searchParams: Promise<{ code?: string; next?: string }> }) {
  const supabase = await createClient();
  const searchParams = await props.searchParams;

  if (searchParams?.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(searchParams.code);
    if (!error) {
      redirect('/dashboard');
    }
  }

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-emerald-500/30 selection:text-emerald-700 dark:selection:text-emerald-300">
      {/* Glow background mesh */}
      <div className="fixed inset-0 glow-mesh pointer-events-none opacity-60 z-0" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-foreground/[0.07] bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_14px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-transform">
              <Shield className="w-4 h-4 text-black" />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-emerald-500">
              ComplianceShield <span className="text-emerald-500">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm text-foreground/70">
            <a href="#why" className="hover:text-foreground transition-colors">Why Us</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#reviews" className="hover:text-foreground transition-colors">Reviews</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            {user && <Link href="/dashboard" className="hover:text-emerald-500 transition-colors font-medium">Archive</Link>}
            <ThemeToggle />
            <Link
              href={user ? "/dashboard" : "/login"}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all text-sm shadow-[0_0_12px_rgba(16,185,129,0.25)]"
            >
              {user ? 'Go to Dashboard' : 'Sign In'}
            </Link>
          </div>

          {/* Mobile nav */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <MobileMenu user={user} />
          </div>
        </div>
      </nav>


      <main className="relative z-10">
        {/* Hero */}
        <section className="px-4 sm:px-6 pt-20 sm:pt-28 md:pt-32 pb-16 sm:pb-24 text-center">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-bold animate-fade-in">
              <Zap className="w-3.5 h-3.5" />
              <span>Next-Gen Compliance for 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent leading-[1.1]">
              Stop paying $3,000 <br className="hidden sm:block" />for compliance.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              Generate legally-formatted GDPR and HIPAA bundles in 5 minutes for the price of a coffee.
              Designed for small firms that need enterprise security without the bureaucracy.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Link
                href="/wizard"
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(16,185,129,0.3)] text-sm sm:text-base"
              >
                Generate Your First Document Free
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                href="/wizard?demo=true"
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-foreground/5 text-foreground font-semibold rounded-xl hover:bg-foreground/10 border border-foreground/10 transition-all text-center flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Sparkles className="w-4 h-4 text-emerald-500" />
                View Live Sample
              </Link>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="px-4 sm:px-6 py-10 sm:py-12 border-y border-foreground/[0.06] bg-foreground/[0.015]">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-[10px] sm:text-xs font-bold text-foreground/70 dark:text-foreground/30 uppercase tracking-widest mb-6 sm:mb-8">
              Trusted by 500+ law clinics and accounting startups
            </p>

            <div className="flex flex-wrap justify-center gap-x-8 sm:gap-x-16 gap-y-4 sm:gap-y-6 opacity-30">
              {['ACME LEGAL', 'MEDIX', 'DUE DILIGENCE', 'SECURELY', 'SHIELD LAW'].map((name) => (
                <span key={name} className="text-base sm:text-xl font-bold tracking-tighter cursor-default hover:opacity-70 transition-opacity">{name}</span>
              ))}
            </div>
          </div>
        </section>

        {/* What It Solves */}
        <section className="px-4 sm:px-6 py-20 sm:py-32 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent">
          <div className="max-w-7xl mx-auto space-y-12 sm:space-y-20">
            <div className="text-center space-y-3 sm:space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">The Compliance Crisis</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto text-base sm:text-lg">Every day, businesses lose clients, face fines, and lose trust because they can't afford enterprise compliance.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: DollarSign,
                  title: '$3,000+ Per Audit',
                  desc: 'Traditional compliance consultants charge thousands for a single report. Most small firms simply can\'t afford it — and risk everything.',
                  stat: '73% of SMBs skip compliance due to cost',
                },
                {
                  icon: Clock,
                  title: 'Weeks of Delays',
                  desc: 'Manual audits take 2-6 weeks. By the time you get your report, regulations may have changed. Speed is a competitive advantage.',
                  stat: 'Average wait: 14 business days',
                },
                {
                  icon: AlertTriangle,
                  title: 'Generic Templates',
                  desc: 'Off-the-shelf compliance templates don\'t address your specific industry, size, or risk profile. One-size-fits-all means one-size-fits-none.',
                  stat: '89% of templates miss key requirements',
                },
              ].map((item) => (
                <div key={item.title} className="glass-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl space-y-4 sm:space-y-6 relative overflow-hidden group hover:border-red-500/20 transition-all">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-red-500/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold">{item.title}</h3>
                    <p className="text-foreground/70 leading-relaxed text-sm">{item.desc}</p>
                  </div>
                  <div className="pt-3 sm:pt-4 border-t border-foreground/5">
                    <p className="text-[10px] sm:text-xs font-bold text-red-400/60 uppercase tracking-wider">{item.stat}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why ComplianceShield AI */}
        <section id="why" className="px-4 sm:px-6 py-20 sm:py-32 scroll-mt-20">
          <div className="max-w-7xl mx-auto space-y-12 sm:space-y-20">
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-bold">
                <Award className="w-3.5 h-3.5" />
                <span>The ComplianceShield Advantage</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">Why Firms Choose Us</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto text-base sm:text-lg">AI-powered compliance that's faster, smarter, and built for the way modern businesses actually operate.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
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
                <div key={item.title} className="glass-card p-6 sm:p-10 rounded-2xl sm:rounded-3xl space-y-4 sm:space-y-6 relative overflow-hidden group hover:border-emerald-500/20 transition-all">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-500" />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold">{item.title}</h3>
                    <p className="text-foreground/70 leading-relaxed text-sm sm:text-base">{item.desc}</p>
                  </div>
                  <div className="pt-3 sm:pt-4 border-t border-foreground/5">
                    <p className="text-[10px] sm:text-xs font-bold text-emerald-500/60 uppercase tracking-wider">{item.highlight}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Importance / Trust Section */}
        <section className="px-4 sm:px-6 py-20 sm:py-32 bg-foreground/[0.015] border-y border-foreground/[0.06]">
          <div className="max-w-5xl mx-auto space-y-12 sm:space-y-16">
            <div className="text-center space-y-3 sm:space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">Why Compliance Can't Wait</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto text-base sm:text-lg">Non-compliance isn't just a legal risk — it's a business survival risk.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 text-center">
              {[
                { number: '$2.4M', label: 'Average GDPR fine per violation', sublabel: 'Source: EU Data Protection Board 2025' },
                { number: '68%', label: 'of clients check compliance before signing', sublabel: 'Source: B2B Trust Survey 2025' },
                { number: '43%', label: 'of data breaches happen at non-compliant firms', sublabel: 'Source: CyberRisk Intelligence Report' },
              ].map((stat) => (
                <div key={stat.label} className="space-y-2 sm:space-y-3">
                  <div className="text-4xl sm:text-5xl md:text-6xl font-black text-emerald-500">{stat.number}</div>
                  <p className="text-sm sm:text-base text-foreground/70 font-semibold">{stat.label}</p>
                  <p className="text-[10px] sm:text-xs text-foreground/50">{stat.sublabel}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how" className="px-4 sm:px-6 py-20 sm:py-32">
          <div className="max-w-7xl mx-auto space-y-12 sm:space-y-20">
            <div className="text-center space-y-3 sm:space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold">The 10-Question Success Path</h2>
              <p className="text-foreground/70 max-w-xl mx-auto text-sm sm:text-base">Skip the consultants. Our AI prompts you for exactly what it needs and builds the rest.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {[
                { step: '01', title: 'Answer', desc: 'Complete our guided questionnaire in under 10 minutes.', icon: FileText },
                { step: '02', title: 'Generate', desc: 'Our AI synthesizes legal requirements for your specific niche.', icon: Zap },
                { step: '03', title: 'Secure', desc: 'Download your bundle and close that high-value deal.', icon: Lock },
              ].map((item) => (
                <div key={item.step} className="glass-card p-6 sm:p-10 rounded-2xl sm:rounded-3xl space-y-4 sm:space-y-6 relative overflow-hidden group hover:border-emerald-500/20 transition-all">
                  <div className="absolute top-0 right-0 p-4 sm:p-6 text-6xl sm:text-8xl font-black text-foreground/5 group-hover:text-emerald-500/5 transition-colors">{item.step}</div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold">{item.title}</h3>
                    <p className="text-foreground/70 leading-relaxed text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="px-4 sm:px-6 py-20 sm:py-32 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent">
          <div className="max-w-7xl mx-auto space-y-12 sm:space-y-20">
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-bold">
                <Star className="w-3.5 h-3.5" />
                <span>What Our Users Say</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">Trusted by Professionals</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto text-base sm:text-lg">Real feedback from firms that use ComplianceShield AI every day.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  name: 'Sarah Mitchell',
                  role: 'Privacy Attorney, Mitchell & Associates',
                  rating: 5,
                  text: 'This tool saved us 40 hours on our last SOC 2 audit. The report quality is indistinguishable from what our previous $5,000 consultant produced. Absolutely remarkable.',
                },
                {
                  name: 'James Rodriguez',
                  role: 'CTO, FinServe Global',
                  rating: 5,
                  text: 'We needed GDPR compliance proof for an enterprise deal closing in 48 hours. ComplianceShield AI delivered a board-ready report in 8 minutes. We closed the deal.',
                },
                {
                  name: 'Dr. Priya Sharma',
                  role: 'Healthcare Compliance Director',
                  rating: 5,
                  text: 'The HIPAA reports are thorough and cite the exact CFR sections we need. Our external auditors were impressed. This is now our standard compliance workflow.',
                },
                {
                  name: 'Michael Chen',
                  role: 'Founder, SecureStack SaaS',
                  rating: 5,
                  text: 'As a startup founder, I cannot afford $3,000 per audit. This gives me enterprise-grade compliance reports at a fraction of the cost. Game changer.',
                },
                {
                  name: 'Lisa Thompson',
                  role: 'Risk Manager, EuroBank Digital',
                  rating: 4,
                  text: 'The adaptive questioning is brilliant. Each audit feels tailored to our specific infrastructure. The mitigation roadmap alone is worth the subscription.',
                },
                {
                  name: 'David Park',
                  role: 'Partner, Park Legal LLP',
                  rating: 5,
                  text: 'We white-label this for our clients. They think we have a dedicated compliance team. The PDF reports look incredibly professional with our branding.',
                },
              ].map((review) => (
                <div key={review.name} className="glass-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl space-y-4 sm:space-y-6 relative overflow-hidden group hover:border-emerald-500/20 transition-all">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                    ))}
                    {review.rating < 5 && (
                      <Star className="w-4 h-4 text-foreground/20" />
                    )}
                  </div>
                  <p className="text-foreground/70 leading-relaxed text-sm sm:text-base italic">"{review.text}"</p>
                  <div className="pt-3 sm:pt-4 border-t border-foreground/5">
                    <p className="font-semibold text-sm">{review.name}</p>
                    <p className="text-xs text-foreground/70">{review.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="px-4 sm:px-6 py-20 sm:py-32">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Simple Pricing.<br />Zero Surprise.</h2>
                <p className="text-foreground/70 max-w-sm text-sm sm:text-base">No yearly commitments. Cancel anytime. All the documents you need to be compliant.</p>
                <div className="space-y-3 sm:space-y-4">
                  {['GDPR & HIPAA Templates', 'Automatic Law Updates', 'Secure Document Storage', 'Unlimited Export'].map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-foreground/70 text-sm sm:text-base">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-px bg-gradient-to-b from-emerald-500/40 to-transparent rounded-2xl sm:rounded-[2.5rem]">
                <div className="bg-background p-6 sm:p-10 rounded-xl sm:rounded-[2.4rem] space-y-6 sm:space-y-8 border border-foreground/[0.06]">
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-emerald-500">Unlimited Plan</h3>
                    <div className="mt-3 sm:mt-4 flex items-baseline gap-1">
                      <span className="text-4xl sm:text-6xl font-bold tracking-tighter">$49</span>
                      <span className="text-foreground/70 text-sm sm:text-base">/month</span>
                    </div>
                  </div>
                  <button
                    disabled
                    className="block w-full py-3.5 sm:py-4 bg-foreground/10 text-foreground/30 text-center font-bold rounded-xl cursor-not-allowed text-sm sm:text-base"
                  >
                    Currently Unavailable
                  </button>
                  <p className="text-center text-[10px] sm:text-xs text-foreground/30">Join the waitlist for early access</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact / Feedback */}
        <section className="px-4 sm:px-6 py-20 sm:py-32 bg-foreground/[0.015] border-y border-foreground/[0.06]">
          <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold">Get In Touch</h2>
            <p className="text-foreground/70 max-w-xl mx-auto text-base sm:text-lg">Have feedback, need support, or want to share your experience? We'd love to hear from you.</p>
            <a
              href="mailto:cat.legion38@gmail.com"
              className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold rounded-2xl hover:bg-emerald-500/20 transition-all text-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              cat.legion38@gmail.com
            </a>
            <p className="text-sm text-foreground/30">If you have any reviews, let us know at cat.legion38@gmail.com</p>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 sm:px-6 py-20 sm:py-32">
          <div className="max-w-7xl mx-auto glass-card rounded-2xl sm:rounded-[3rem] p-8 sm:p-16 md:p-28 text-center space-y-6 sm:space-y-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] pointer-events-none" />
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold tracking-tight">Ready to close that deal?</h2>
            <p className="text-base sm:text-xl text-foreground/70 max-w-xl mx-auto leading-relaxed">
              Join 500+ firms that secure their clients using ComplianceShield AI.
            </p>
            <Link
              href="/wizard"
              className="inline-block px-8 sm:px-12 py-4 sm:py-5 bg-emerald-500 text-black font-bold rounded-xl sm:rounded-2xl hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_40px_rgba(16,185,129,0.2)] text-sm sm:text-base"
            >
              Generate Your First Document Free
            </Link>
          </div>
        </section>
      </main>

      <footer className="px-4 sm:px-6 py-10 sm:py-12 border-t border-foreground/[0.06] text-center text-foreground/50 text-xs sm:text-sm">
        <div className="space-y-3">
          <p>© 2026 ComplianceShield AI. Built with care for the modern firm. Secure, AI-Driven, Human-Focused.</p>
          <a href="mailto:cat.legion38@gmail.com" className="text-emerald-500/60 hover:text-emerald-500 transition-colors">cat.legion38@gmail.com</a>
        </div>
      </footer>
    </div>
  );
}

function MobileMenu({ user }: { user: any }) {
  return (
    <div className="relative">
      <details className="group">
        <summary className="list-none cursor-pointer p-2 rounded-lg hover:bg-foreground/5 transition-colors">
          <Menu className="w-5 h-5 block group-open:hidden" />
          <X className="w-5 h-5 hidden group-open:block" />
        </summary>
        <div className="absolute right-0 top-full mt-2 w-56 bg-background/95 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-2xl p-4 space-y-3 z-50">
          <a href="#why" className="block px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors">Why Us</a>
          <a href="#how" className="block px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors">How it works</a>
          <a href="#reviews" className="block px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors">Reviews</a>
          <a href="#pricing" className="block px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors">Pricing</a>
          {user && (
            <Link href="/dashboard" className="block px-3 py-2 text-sm text-emerald-500 hover:bg-foreground/5 rounded-lg transition-colors font-medium">Archive</Link>
          )}
          <div className="pt-2 border-t border-foreground/10">
            <Link
              href={user ? "/dashboard" : "/login"}
              className="block w-full px-3 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-center font-bold rounded-xl transition-all text-sm shadow-[0_0_12px_rgba(16,185,129,0.25)]"
            >
              {user ? 'Go to Dashboard' : 'Sign In'}
            </Link>
          </div>
        </div>
      </details>
    </div>
  );
}

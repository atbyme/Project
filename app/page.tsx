import React from 'react';
import { Shield, CheckCircle2, ArrowRight, Lock, Zap, FileText } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 selection:text-emerald-400">
      {/* Glow background mesh */}
      <div className="fixed inset-0 glow-mesh pointer-events-none opacity-50 z-0" />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-500" />
            <span className="text-xl font-bold tracking-tight">ComplianceShield AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <button className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-emerald-50 transition-all">
              Login
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="px-6 pt-32 pb-24 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium animate-fade-in">
              <Zap className="w-3.5 h-3.5" />
              <span>Next-Gen Compliance for 2026</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              Stop paying $3,000 <br /> for compliance.
            </h1>
            <p className="text-xl text-white/40 max-w-2xl mx-auto leading-relaxed">
              Generate legally-formatted GDPR and HIPAA bundles in 5 minutes for the price of a coffee. 
              Designed for small firms that need security without the bureaucracy.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/wizard" className="w-full sm:w-auto px-8 py-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                Generate Your First Document Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white font-semibold rounded-xl hover:bg-white/10 border border-white/10 transition-all">
                View Sample Report
              </button>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="px-6 py-12 border-y border-white/5 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-sm font-semibold text-white/30 uppercase tracking-widest mb-8">
              Trusted by 500+ law clinics and accounting startups
            </p>
            <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 opacity-40 grayscale group overflow-hidden">
              {['ACME LEGAL', 'MEDIX', 'DUE DILIGENCE', 'SECURELY', 'SHIELD LAW'].map((name) => (
                <span key={name} className="text-2xl font-bold tracking-tighter hover:text-emerald-400 transition-colors cursor-default">{name}</span>
              ))}
            </div>
          </div>
        </section>

        {/* The '10-Question' Process Section */}
        <section id="how" className="px-6 py-32 bg-black">
          <div className="max-w-7xl mx-auto space-y-24">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">The 10-Question Success Path</h2>
              <p className="text-white/40 max-w-xl mx-auto">Skip the consultants. Our AI prompts you for exactly what it needs and builds the rest.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Answer', desc: 'Complete our guided questionnaire in under 10 minutes.', icon: FileText },
                { step: '02', title: 'Generate', desc: 'Our AI synthesizes legal requirements for your specific niche.', icon: Zap },
                { step: '03', title: 'Secure', desc: 'Download your bundle and close that high-value deal.', icon: Lock }
              ].map((item) => (
                <div key={item.step} className="glass-card p-12 rounded-3xl space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 text-8xl font-black text-white/5 group-hover:text-emerald-500/5 transition-colors">{item.step}</div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{item.title}</h3>
                    <p className="text-white/40 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="px-6 py-32 relative">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h2 className="text-5xl font-bold leading-tight">Simple Pricing.<br />Zero Surprise.</h2>
                <p className="text-white/40 max-w-sm">No yearly commitments. Cancel anytime. All the documents you need to be compliant.</p>
                <div className="space-y-4">
                  {['GDPR & HIPAA Templates', 'Automatic Law Updates', 'Secure Document Storage', 'Unlimited Export'].map(feature => (
                    <div key={feature} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="text-white/60">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-1 px-1 bg-gradient-to-b from-emerald-500/50 to-transparent rounded-[2.5rem]">
                <div className="bg-[#050505] p-12 rounded-[2.4rem] space-y-8">
                  <div>
                    <h3 className="text-xl font-medium text-emerald-400">Unlimited Plan</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-6xl font-bold tracking-tighter">$49</span>
                      <span className="text-white/40">/month</span>
                    </div>
                  </div>
                  <Link href="/wizard" className="block w-full py-4 bg-white text-black text-center font-bold rounded-xl hover:bg-emerald-50 transition-all">
                    Start Your Trial Free
                  </Link>
                  <p className="text-center text-xs text-white/30">No credit card required for trial</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA Section */}
        <section className="px-6 py-32">
          <div className="max-w-7xl mx-auto glass-card rounded-[3rem] p-16 md:p-32 text-center space-y-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] pointer-events-none" />
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Ready to close that deal?</h2>
            <p className="text-xl text-white/40 max-w-xl mx-auto leading-relaxed">
              Join 500+ firms that secure their clients using ComplianceShield AI.
            </p>
            <Link href="/wizard" className="inline-block px-12 py-5 bg-emerald-500 text-black font-bold rounded-2xl hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_40px_rgba(16,185,129,0.2)]">
              Generate Your First Document Free
            </Link>
          </div>
        </section>
      </main>

      <footer className="px-6 py-12 border-t border-white/5 text-center text-white/20 text-sm">
        <p>&copy; 2026 ComplianceShield AI. Built for the modern firm.</p>
      </footer>
    </div>
  );
}

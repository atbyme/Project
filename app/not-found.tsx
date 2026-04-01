'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-emerald-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none opacity-50 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 text-center space-y-8 max-w-lg">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-emerald-400 font-medium">
          <Shield className="w-5 h-5" />
          <span>Security Protocol 404</span>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent">
            Lost?
          </h1>
          <p className="text-xl text-white/40 leading-relaxed">
            The page you're looking for has been moved, deleted, or never existed in our secure database.
          </p>
        </div>

        <div className="pt-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-black font-bold rounded-2xl hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_40px_rgba(16,185,129,0.2)]"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>
      </main>

      <footer className="fixed bottom-12 text-white/10 text-sm">
        &copy; 2026 ComplianceShield AI &bull; Encrypted Session
      </footer>
    </div>
  );
}

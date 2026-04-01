'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Runtime Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-emerald-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none opacity-50 z-0 text-red-500/10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 text-center space-y-8 max-w-lg">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-emerald-400 font-medium animate-pulse">
          <AlertCircle className="w-5 h-5 text-emerald-500" />
          <span>System Breach: {error.digest || 'Unknown Application Error'}</span>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Something went <br /> wrong.
          </h1>
          <p className="text-xl text-white/40 leading-relaxed">
            The application encountered an unexpected error. Our system has logged this incident and our security team will investigate.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 text-black font-bold rounded-2xl hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_0_40px_rgba(16,185,129,0.2)]"
          >
            <RefreshCw className="w-5 h-5" />
            Try to Recover
          </button>
          
          <Link 
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-white font-semibold rounded-2xl hover:bg-white/10 border border-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Return Home
          </Link>
        </div>
      </main>

      <footer className="fixed bottom-12 text-white/10 text-sm">
        &copy; 2026 ComplianceShield AI &bull; Encrypted Session
      </footer>
    </div>
  );
}

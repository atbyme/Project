'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-emerald-500/30 font-sans">
        {/* Background Glow */}
        <div className="fixed inset-0 pointer-events-none opacity-50 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 blur-[120px] rounded-full" />
        </div>

        <main className="relative z-10 text-center space-y-8 max-w-lg">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-red-400 font-medium animate-pulse">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span>Critical System Error</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent leading-tight">
              Fatal Application Exception
            </h1>
            <p className="text-xl text-white/40 leading-relaxed uppercase tracking-widest text-sm font-semibold">
              Internal Server Error: {error.digest || '0x5A2F'}
            </p>
          </div>

          <div className="pt-8">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-12 py-5 bg-white text-black font-bold rounded-2xl hover:bg-emerald-50 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              <RefreshCw className="w-5 h-5" />
              Reboot Application
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}

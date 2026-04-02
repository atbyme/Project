import React from 'react';
import ComplianceWizard from '@/components/ComplianceWizard';
import { Shield } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

export const dynamic = 'force-dynamic';

export default function WizardPage() {

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-emerald-500/30">
      <div className="fixed inset-0 glow-mesh opacity-30 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-[0_0_16px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              ComplianceShield <span className="text-emerald-500">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className="text-sm font-medium text-foreground/30 hover:text-foreground transition-colors"
            >
              Exit Wizard
            </Link>
          </div>
        </div>

        {/* Wizard Content */}
        <ComplianceWizard />
      </div>
    </div>
  );
}

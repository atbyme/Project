'use client';

import React from 'react';
import ComplianceWizard from '@/components/ComplianceWizard';
import { Shield } from 'lucide-react';

export default function WizardPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-24 selection:bg-emerald-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 glow-mesh opacity-20 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-24">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Shield className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold tracking-tight">ComplianceShield <span className="text-emerald-500">AI</span></span>
          </div>
          <button 
            className="text-sm font-medium text-white/30 hover:text-white transition-colors"
            onClick={() => window.location.href = '/'}
          >
            Exit Wizard
          </button>
        </div>

        {/* Wizard Content */}
        <ComplianceWizard />
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, ChevronLeft, Shield, Zap, Lock, Info, FileText, Download, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateComplianceReport } from '@/app/actions/generateCompliance';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const QUESTIONS = [
  {
    id: 'industry',
    title: 'What industry are you in?',
    description: 'We tailor the legal language to your specific sector.',
    options: ['Healthcare / Medical', 'Software / SaaS', 'Legal / Professional Services', 'Finance / Fintech', 'E-commerce', 'Other']
  },
  {
    id: 'data_types',
    title: 'What types of sensitive data do you handle?',
    description: 'Select all that apply to your business operations.',
    multi: true,
    options: ['Emails & Names', 'Home Addresses', 'Health Records (PHI)', 'Credit Card Info (PCI)', 'Passport/ID Numbers', 'Biometric Data']
  },
  {
    id: 'storage',
    title: 'Where do you store most of your data?',
    description: 'This determines your data residency requirements.',
    options: ['AWS / Google / Azure', 'On-premise Servers', 'Third-party SaaS (e.g. HubSpot)', 'Physical Filing']
  },
  {
    id: 'access',
    title: 'Do you enforce Multi-Factor Authentication (MFA)?',
    description: 'Crucial for GDPR and HIPAA security standards.',
    options: ['Yes, everywhere', 'Only for admins', 'No, but planning to', 'Not yet']
  },
  {
    id: 'training',
    title: 'Are your employees trained on Security Awareness?',
    description: 'Staff training is a mandatory administrative safeguard.',
    options: ['Regularly (Annually+)', 'Ocassionally', 'Only during onboarding', 'No training yet']
  },
  {
    id: 'vendors',
    title: 'Do you use third-party vendors (like Cloud Hosting)?',
    description: 'Ensures we generate the correct "Data Processing Agreements."',
    options: ['Yes (10+ vendors)', 'Yes (1-10 vendors)', 'No, everything is internal', 'Not sure']
  },
  {
    id: 'breach',
    title: 'Do you have a 72-hour breach notification process?',
    description: 'Mandatory under GDPR Article 33.',
    options: ['Yes, documented', 'Informal process', 'No process yet']
  },
  {
    id: 'rights',
    title: 'How do you handle "Data Deletion" requests?',
    description: 'The "Right to be Forgotten" is a core user right.',
    options: ['Automated system', 'Manual process', 'No process yet']
  },
  {
    id: 'backup',
    title: 'How often do you test your data backups?',
    description: 'Backup testing is required for disaster recovery compliance.',
    options: ['Monthly or more', 'Quarterly', 'Annually', 'Never tested']
  },
  {
    id: 'officer',
    title: 'Do you have a designated Privacy/Security Officer?',
    description: 'A formal requirement for many HIPAA/GDPR entities.',
    options: ['Yes, internal', 'Yes, external consultant', 'No, shared responsibility', 'None']
  }
];

export default function ComplianceWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({
    industry: '',
    data_types: [],
    storage: '',
    access: '',
    training: '',
    vendors: '',
    breach: '',
    rights: '',
    backup: '',
    officer: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    const question = QUESTIONS[currentStep];
    if (question.multi) {
      const current = (answers[question.id] as string[]) || [];
      const updated = current.includes(option) 
        ? current.filter(o => o !== option)
        : [...current, option];
      setAnswers({ ...answers, [question.id]: updated });
    } else {
      setAnswers({ ...answers, [question.id]: option });
    }
  };

  const generateReport = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateComplianceReport(answers);
      if (result.success) {
        setReport(result.data || '');
      } else {
        setError(result.error || 'Failed to generate report.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };

  const next = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateReport();
    }
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  if (report) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-12 pb-32"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase overflow-hidden">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Generation Successful</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight">Compliance Shield Bundle</h2>
            <p className="text-white/40">Verified for 2026 legal standards.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.print()}
              className="px-6 py-4 bg-emerald-500 text-black font-bold rounded-2xl hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="p-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 border border-white/10 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="glass-card p-12 rounded-[2.5rem] prose prose-invert prose-emerald max-w-none">
          <ReactMarkdown>
            {report}
          </ReactMarkdown>
        </div>
      </motion.div>
    );
  }

  if (isGenerating) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-12">
        <div className="relative">
          <motion.div 
            className="absolute inset-0 bg-emerald-500/20 blur-[80px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <Shield className="w-32 h-32 text-emerald-500 relative z-10" />
        </div>
        <div className="space-y-4 max-w-sm">
          <h2 className="text-4xl font-bold">Generating Dashboard...</h2>
          <p className="text-white/40 leading-relaxed">
            Gemini AI is cross-referencing your answers with state secrets and 2026 GDPR/HIPAA standards.
          </p>
        </div>
        <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white/30">
          <span>{currentStep + 1} of {QUESTIONS.length} Questions</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-12"
        >
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">{currentQuestion.title}</h2>
            <p className="text-xl text-white/40 flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-500/40" />
              {currentQuestion.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option) => {
              const isSelected = currentQuestion.multi 
                ? (answers[currentQuestion.id] as string[] || []).includes(option)
                : answers[currentQuestion.id] === option;
              
              return (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "p-8 rounded-[2rem] text-left transition-all border-2 group relative overflow-hidden",
                    isSelected 
                      ? "bg-emerald-500/10 border-emerald-500 text-white" 
                      : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10"
                  )}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-lg font-bold">{option}</span>
                    {isSelected && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between pt-12 border-t border-white/5">
        <button 
          onClick={prev}
          disabled={currentStep === 0}
          className="flex items-center gap-2 text-white/30 hover:text-white transition-colors disabled:opacity-0"
        >
          <ChevronLeft className="w-5 h-5" />
          Go Back
        </button>
        <button 
          onClick={next}
          disabled={!answers[currentQuestion.id] || (currentQuestion.multi && (answers[currentQuestion.id] as string[]).length === 0)}
          className="px-10 py-5 bg-emerald-500 text-black font-extrabold rounded-2xl hover:bg-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          {currentStep === QUESTIONS.length - 1 ? 'See Your Bundle' : 'Continue'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

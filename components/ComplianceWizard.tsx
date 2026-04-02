'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2, ChevronRight, ChevronLeft, Shield, Zap, Lock, Info, FileText, Download, RotateCcw, Loader2, Sparkles } from 'lucide-react';

import ReactMarkdown from 'react-markdown';
import { generateComplianceReport } from '@/app/actions/generateCompliance';
import { logReportDownload } from '@/app/actions/audit';
import { generateNextQuestion } from '@/app/actions/questions';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// The only static question is the first one to kick off the AI context
const INITIAL_QUESTION = {
  id: 'industry',
  title: 'What industry are you in?',
  description: 'We tailor the dynamic AI logic to your specific sector.',
  options: ['Healthcare / Medical', 'Software / SaaS', 'Legal / Professional Services', 'Finance / Fintech', 'E-commerce', 'Other']
};

export default function ComplianceWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<any>(INITIAL_QUESTION);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isThinking, setIsThinking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isTrial, setIsTrial] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Check for Demo Mode in URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === 'true') {
      import('@/lib/demo-data').then(mod => setReport(mod.DEMO_REPORT));
    }

    // 2. Check login status for Trial Mode UI
    import('@/lib/client').then(mod => {
      const supabase = mod.createClient();
      if (supabase.auth) {
        supabase.auth.getUser().then((res: any) => {
          setIsTrial(!res.data?.user);
        });
      }
    });

  }, []);


  const handleSelect = (option: string) => {
    // Record both the ID for internal tracking and also mapping the Title to Answer for AI contextual awareness
    setAnswers({ ...answers, [currentQuestion.id]: option, [currentQuestion.title]: option });
  };

  const next = async () => {
    if (currentStep < 9) { // We want 10 questions total
      setIsThinking(true);
      setError(null);
      try {
        const result = await generateNextQuestion(answers, currentStep + 1);
        if (result.success) {
          setCurrentQuestion(result.data);
          setCurrentStep(currentStep + 1);
        } else {
          throw new Error("AI failed to generate next step.");
        }
      } catch (err) {
        setError("AI Engine timeout. Please try again.");
      } finally {
        setIsThinking(false);
      }
    } else {
      generateReport();
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
      setError('An unexpected error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = async () => {
    if (isDownloading || !reportRef.current) return;
    setIsDownloading(true);
    
    try {
      // 1. Audit Log 
      await logReportDownload("Shield AI Audit Bundle");
      
      // 2. Direct-to-file Download (Professional PDF Engine)
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Better resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#0a0a0a' // Matches dark mode
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ComplianceShieldAI_Report_${new Date().toISOString().split('T')[0]}.pdf`);

    } catch (err) {
      console.error('Download failed:', err);
      // Fallback for extreme cases
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };


  if (report) {
    const isDemo = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('demo') === 'true';

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-12 pb-32">
        {/* Trial Banner */}
        {isTrial && !isDemo && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 font-medium">
              <Zap className="w-5 h-5" />
              <span>You are viewing a **One-Time Trial Report**. Sign up to save it permanently to your dashboard.</span>
            </div>
            <Link href="/login" className="px-4 py-2 bg-amber-500 text-black text-sm font-bold rounded-lg hover:bg-amber-400 transition-all">
              Sign Up & Save
            </Link>
          </div>
        )}

        {isDemo && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-medium">
              <Sparkles className="w-5 h-5" />
              <span>Viewing **Live AI Sample**. This is the quality of document our engine produces.</span>
            </div>
            <Link href="/wizard" className="px-4 py-2 bg-emerald-500 text-black text-sm font-bold rounded-lg hover:bg-emerald-400 transition-all">
              Generate Your Own
            </Link>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-foreground/[0.07] pb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase overflow-hidden">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isDemo ? 'Live Demo Bundle' : 'Compliance Bundle Ready'}</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight">ComplianceShield AI</h2>
            <p className="text-foreground/40">{isDemo ? 'Sample: Global Fintech SaaS' : 'AI-generated audit bundle for your specific niche.'}</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            {!isDemo && (
              <a href={isTrial ? "/login?next=/dashboard" : "/dashboard"} className="w-full md:w-auto px-6 py-4 bg-foreground/5 hover:bg-foreground/10 text-foreground border border-foreground/10 font-bold rounded-2xl transition-all text-center">
                {isTrial ? "Sign In to Save" : "View Dashboard"}
              </a>
            )}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button onClick={downloadPDF} disabled={isDownloading} className="flex-1 md:flex-none px-6 py-4 bg-emerald-500 text-black font-bold rounded-2xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                {isDownloading ? 'Logging Access...' : (isTrial ? 'Download Trial PDF' : 'Download Bundle')}
              </button>
              <button 
                onClick={() => isDemo ? window.location.href = '/wizard' : window.location.reload()} 
                className="p-4 bg-foreground/5 text-foreground rounded-2xl hover:bg-foreground/10 border border-foreground/10 transition-all" 
                title="Start Over"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div ref={reportRef} className="glass-card p-10 rounded-[2.5rem] prose prose-emerald dark:prose-invert max-w-none shadow-2xl">
          <ReactMarkdown>{report}</ReactMarkdown>
        </div>

        {/* Post-Report CTA for Trials */}
        {isTrial && !isDemo && (
          <div className="p-12 glass-card rounded-[3rem] text-center space-y-8 relative overflow-hidden border border-emerald-500/20">
            <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] pointer-events-none" />
            <h3 className="text-3xl font-bold">Impressive, isn't it?</h3>
            <p className="text-foreground/40 max-w-lg mx-auto">
              This report is powered by our Enterprise AI Engine. Sign up today to secure your account, unlock unlimited generations, and receive automatic regulatory updates for 2026.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="px-10 py-5 bg-emerald-500 text-black font-extrabold rounded-2xl hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                Create Account & Claim Report
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    );
  }


  if (isGenerating || isThinking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-12">
        <div className="relative">
          <motion.div
            className="absolute inset-0 bg-emerald-500/20 blur-[80px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          {isThinking ? <Sparkles className="w-32 h-32 text-emerald-500 relative z-10 animate-pulse" /> : <Shield className="w-32 h-32 text-emerald-500 relative z-10" />}
        </div>
        <div className="space-y-4 max-w-sm">
          <h2 className="text-4xl font-bold">{isThinking ? 'Consulting...' : 'Expertly Building...'}</h2>
          <p className="text-white/40 leading-relaxed">
            {isThinking ? 'We are analyzing your niche to provide the most relevant next step.' : 'Your Senior Legal Partner is synthesizing your 2026 Table of Contents...'}
          </p>
        </div>
        <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div className="h-full bg-emerald-500" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 5, repeat: Infinity }} />
        </div>
      </div>
    );
  }

  const progress = ((currentStep + 1) / 10) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white/30">
          <span>{currentStep + 1} of 10 Dynamic Steps</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div className="h-full bg-emerald-500" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">{currentQuestion.title}</h2>
            <p className="text-xl text-white/40 flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-500/40" />
              {currentQuestion.description}
            </p>
            {/* [HUMAN TOUCH]: Pro-Tip for the buyer */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-emerald-500/5 border-l-4 border-emerald-500 rounded-r-xl text-emerald-400 text-sm italic shadow-[0_0_15px_rgba(16,185,129,0.1)]"
            >
              {currentStep === 0 && "Pro-Tip: Choosing the right industry helps our AI target the exact GDPR Article that applies to you."}
              {currentStep > 0 && currentStep < 5 && "Great progress! You're building a solid foundation for your legal audit."}
              {currentStep >= 5 && currentStep < 9 && "Almost there. These final details are what differentiate a good report from an expert one."}
              {currentStep === 9 && "Final step! Our engine is ready to synthesize your custom 2026 Table of Contents."}
            </motion.div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option: string) => {
              const isSelected = answers[currentQuestion.id] === option;
              return (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "p-8 rounded-[2rem] text-left transition-all border-2 group relative overflow-hidden",
                    isSelected ? "bg-emerald-500/10 border-emerald-500 text-white" : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
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

      {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">{error}</div>}

      <div className="flex items-center justify-end pt-12 border-t border-white/5">
        <button
          onClick={next}
          disabled={!answers[currentQuestion.id] || isThinking}
          className="px-10 py-5 bg-emerald-500 text-black font-extrabold rounded-2xl hover:bg-emerald-400 disabled:opacity-30 flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
        >
          {currentStep === 9 ? 'Generate Table of Contents & Report' : 'Continue'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

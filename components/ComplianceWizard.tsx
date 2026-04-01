'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, ChevronLeft, Shield, Zap, Lock, Info, FileText, Download, RotateCcw, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateComplianceReport } from '@/app/actions/generateCompliance';
import { logReportDownload } from '@/app/actions/audit';
import { generateNextQuestion } from '@/app/actions/questions';
import jsPDF from 'jspdf';
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
  const reportRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: option });
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
    if (!reportRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      await logReportDownload("Shield AI Audit Bundle");
      const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: '#000000' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Compliance_Audit_${Date.now()}.pdf`);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (report) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-12 pb-32">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase overflow-hidden">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Audit Bundle Ready</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight">Compliance Shield AI</h2>
            <p className="text-white/40">Context-aware audit generated for your niche.</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={downloadPDF} disabled={isDownloading} className="px-6 py-4 bg-emerald-500 text-black font-bold rounded-2xl hover:bg-emerald-400 transition-all flex items-center gap-2 disabled:opacity-50">
              {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {isDownloading ? 'Logging Access...' : 'Download PDF'}
            </button>
            <button onClick={() => window.location.reload()} className="p-4 bg-white/5 text-white rounded-2xl hover:bg-white/10 border border-white/10 transition-all">
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div ref={reportRef} className="glass-card p-12 rounded-[2.5rem] prose prose-invert prose-emerald max-w-none bg-black">
          <ReactMarkdown>{report}</ReactMarkdown>
        </div>
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
              className="p-4 bg-emerald-500/5 border-l-4 border-emerald-500 rounded-r-xl text-emerald-400 text-sm italic"
            >
              "Pro-Tip: Most firms miss this detail, but getting it right here saves you $2,000 in future audit fees."
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

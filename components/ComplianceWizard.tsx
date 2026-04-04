'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2, ChevronRight, ChevronLeft, Shield, Zap, Lock, Info, FileText, Download, RotateCcw, Loader2, Sparkles } from 'lucide-react';

import ReactMarkdown from 'react-markdown';
import { generateComplianceReport } from '@/app/actions/generateCompliance';
import { logReportDownload } from '@/app/actions/audit';
import { generateProfessionalPDF } from '@/lib/pdf-engine';
import { callPuterAI } from '@/lib/ai-client';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Fallback question bank (used only if puter.js is unavailable) ─────────
const FALLBACK_BANK: Record<number, { title: string; description: string; options: string[] }> = {
  0: { title: 'What industry are you in?', description: 'Determines your primary compliance framework.', options: ['Financial Services', 'Healthcare & Life Sciences', 'Legal / Professional Services', 'Technology / SaaS'] },
  1: { title: 'What is your company size?', description: 'Scale determines audit scope and obligations.', options: ['1–10 employees', '11–50 employees', '51–250 employees', '250+ employees'] },
  2: { title: 'Which encryption standard is in use?', description: 'Encryption at rest is a standard legal requirement.', options: ['AES-256 (Military Grade)', 'Standard TLS', 'Legacy WEP', 'None / Plaintext'] },
  3: { title: 'What is your Incident Response timeframe?', description: 'GDPR requires breach notification within 72 hours.', options: ['Under 2 hours', 'Within 24 hours', 'Under 72 hours (GDPR)', 'Best effort'] },
  4: { title: 'How are access logs reviewed?', description: 'Audit trails are critical for forensic compliance.', options: ['Daily Automated', 'Weekly Manual', 'On-demand only', 'No logging'] },
  5: { title: 'Where is your primary data center?', description: 'Jurisdiction affects data residency laws.', options: ['European Union (GDPR Zone)', 'United States', 'Multi-region Global', 'Local On-premise'] },
  6: { title: 'Who has admin access to databases?', description: 'Principle of Least Privilege is a core audit point.', options: ['Designated Security Admins', 'All Engineering staff', 'Third-party vendors', 'Shared root access'] },
  7: { title: 'How often are vulnerability scans run?', description: 'Proactive scanning is a baseline compliance requirement.', options: ['Continuous Real-time', 'Weekly Scheduled', 'Quarterly Audit', 'Annually / Never'] },
  8: { title: 'Is staff trained on phishing attacks?', description: 'Human factors are the top compliance risk vector.', options: ['Yes, Quarterly Training', 'Annually', 'Onboarding only', 'No formal training'] },
  9: { title: 'Are backups stored in immutable storage?', description: 'Immutable backups protect against ransomware attacks.', options: ['Yes (WORM / Immutable)', 'Standard Cloud Backup', 'Local Tape / NAS', 'No backup policy'] },
};

const INITIAL_QUESTION = {
  id: 'industry',
  title: 'What industry are you in?',
  description: 'We tailor the AI audit logic to your specific sector.',
  options: ['Healthcare / Medical', 'Software / SaaS', 'Legal / Professional Services', 'Finance / Fintech', 'E-commerce / Retail', 'Other'],
};

// ── AI helpers (Pollinations — free, no sign-in) ────────────────────────

async function puterChat(prompt: string, model = 'gpt-4o-mini'): Promise<string> {
  const result = await callPuterAI(prompt, model);
  return result ?? '';
}

async function generateQuestionWithPuter(answers: Record<string, any>, stepCount: number): Promise<any> {
  const industry = answers.industry || 'General Business';
  const uid = `${stepCount}_${Date.now().toString(36)}`;

  const answeredSoFar = Object.entries(answers)
    .filter(([k, v]) => v && k !== 'step')
    .map(([q, a]) => `Q: ${q} → A: ${a}`)
    .join('\n');

  const prompt = `You are an elite compliance auditor for ${industry} companies.

Previous answers in this audit:
${answeredSoFar || 'This is the first question.'}

Generate a UNIQUE compliance question for step ${stepCount + 1} of 10. Rules:
1. NEVER repeat any topic from previous answers
2. Ask about real compliance practices (encryption, access control, data retention, incident response, vendor management, audit trails, employee training, disaster recovery, etc.)
3. Each option must be SPECIFIC and REALISTIC — show different maturity levels
4. Options must be detailed enough to be meaningful (not just "Option A")
5. Make the question valuable and relevant to their industry

Return ONLY raw JSON, no markdown, no code blocks:
{"id":"q_${uid}","title":"Specific compliance question under 15 words?","description":"Why this matters in under 20 words","options":["Specific realistic option describing a real practice","Another specific option with different maturity level","Third realistic compliance practice option","Fourth option showing a different approach"]}`;

  const text = await puterChat(prompt, 'gpt-4o-mini');

  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Bad JSON from AI');

  const q = JSON.parse(match[0]);
  if (!q.title || !Array.isArray(q.options) || q.options.length < 2) throw new Error('Incomplete question');
  return q;
}

async function generateReportWithPuter(answers: Record<string, any>): Promise<string> {
  const industry = answers.industry || 'General Business';
  const selections = Object.entries(answers)
    .filter(([k]) => k !== 'step')
    .map(([q, a]) => `- ${q}: ${a}`)
    .join('\n');

  const prompt = `You are a senior compliance consultant at a Big 4 firm. Write a professional, pitch-ready compliance audit report for a ${industry} company.

AUDIT RESPONSES:
${selections}

REQUIRED FORMAT (clean Markdown, professional tone, concise):

# Compliance Audit Report: ${industry} Sector

## 1. Executive Summary
A brief overview of the audit scope, key findings, and overall risk rating (Low/Medium/High/Critical).

## 2. Regulatory Framework
List the specific regulations and standards applicable to this sector (GDPR, HIPAA, SOC 2, etc.) with brief explanations.

## 3. Risk Assessment & Findings
For each answer provided, assess the risk level and provide findings. Use **bold** for key terms. Format:
- **Area**: Finding description
- **Risk Level**: Low/Medium/High/Critical

## 4. Compliance Scorecard
Create a quick scorecard table showing each area and its compliance status (Compliant/Partial/Non-Compliant).

## 5. Mitigation Roadmap
Prioritized action items with timelines:
- **Immediate (0-30 days)**: Critical fixes
- **Short-term (30-90 days)**: Important improvements
- **Long-term (90+ days)**: Strategic enhancements

## 6. Summary & Next Steps
A concise closing summary with the top 3 recommendations and a clear call to action for the client.

Rules: Be specific to the answers. Use authoritative, board-ready language. Keep it concise and actionable. No filler content.`;

  const report = await puterChat(prompt, 'gpt-4o-mini');
  if (!report || report.trim().length < 50) throw new Error('Report generation failed');
  return report;
}

// ─────────────────────────────────────────────────────────────────────────

export default function ComplianceWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [questionHistory, setQuestionHistory] = useState<any[]>([INITIAL_QUESTION]);
  const [currentQuestion, setCurrentQuestion] = useState<any>(INITIAL_QUESTION);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isThinking, setIsThinking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isTrial, setIsTrial] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // ── Persist wizard state across refreshes ──────────────────────────
  useEffect(() => {
    if (currentQuestion && questionHistory.length > 0) {
      sessionStorage.setItem('wizard_state', JSON.stringify({
        currentStep, questionHistory, currentQuestion, answers, timestamp: Date.now()
      }));
    }
  }, [currentStep, questionHistory, currentQuestion, answers]);

  useEffect(() => {
    // 1. Demo mode
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === 'true') {
      import('@/lib/demo-data').then(mod => setReport(mod.DEMO_REPORT));
    }

    // 2. Trial mode detection
    import('@/lib/client').then(mod => {
      const supabase = mod.createClient();
      if (supabase.auth) {
        supabase.auth.getUser().then((res: any) => setIsTrial(!res.data?.user));
      }
    });

    // 3. Restore session
    const savedStr = sessionStorage.getItem('wizard_state');
    if (savedStr) {
      try {
        const saved = JSON.parse(savedStr);
        if (Date.now() - saved.timestamp < 2 * 60 * 60 * 1000) {
          setCurrentStep(saved.currentStep);
          setQuestionHistory(saved.questionHistory);
          setCurrentQuestion(saved.currentQuestion);
          setAnswers(saved.answers);
        } else {
          sessionStorage.removeItem('wizard_state');
        }
      } catch { /* ignore */ }
    }
  }, []);

  const handleSelect = (option: string) => {
    if (currentQuestion) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id || '']: option,
        [currentQuestion.title || '']: option,
      }));
    }
  };

  const next = async () => {
    if (currentStep < 9) {
      // Use cached question if we have it
      if (currentStep + 1 < questionHistory.length) {
        setCurrentQuestion(questionHistory[currentStep + 1]);
        setCurrentStep(prev => prev + 1);
        return;
      }

      // Generate new question via puter.js (client-side — free & fast)
      setIsThinking(true);
      setError(null);
      try {
        const newQuestion = await generateQuestionWithPuter(answers, currentStep + 1);
        setQuestionHistory(prev => [...prev, newQuestion]);
        setCurrentQuestion(newQuestion);
        setCurrentStep(prev => prev + 1);
      } catch (err: any) {
        const fb = { id: `fallback_${currentStep + 1}`, ...FALLBACK_BANK[currentStep + 1] ?? FALLBACK_BANK[1] };
        setQuestionHistory(prev => [...prev, fb]);
        setCurrentQuestion(fb);
        setCurrentStep(prev => prev + 1);
      } finally {
        setIsThinking(false);
      }
    } else {
      generateReport();
    }
  };

  const previous = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentQuestion(questionHistory[prevStep]);
      setCurrentStep(prevStep);
      setError(null);
    }
  };

  const generateReport = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const reportText = await generateReportWithPuter(answers);

      setReport(reportText);

      const saveResult: any = await generateComplianceReport(answers, reportText);
      if (!saveResult.success && saveResult.error?.includes('limit')) {
        setError(saveResult.error);
      }
    } catch (err: any) {
      setError(err.message || 'Report generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = async () => {
    if (isDownloading || !reportRef.current) return;
    setIsDownloading(true);
    try {
      await logReportDownload('Shield AI Audit Bundle');
      const industryName = answers.industry || 'Compliance';
      const fileName = `ComplianceShield_${industryName.replace(/\s+/g, '_')}_Report.pdf`;
      await generateProfessionalPDF(reportRef.current, fileName);
    } catch (err) {
      console.error('Download failed:', err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  // ── Report view ──────────────────────────────────────────────────────
  if (report) {
    const isDemo = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('demo') === 'true';

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-12 pb-32">
        {isTrial && !isDemo && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 font-medium">
              <Zap className="w-5 h-5" />
              <span>You are viewing a **One-Time Trial Report**. Sign up to save permanently.</span>
            </div>
            <Link href="/login" className="px-4 py-2 bg-amber-500 text-black text-sm font-bold rounded-lg hover:bg-amber-400 transition-all">Sign Up & Save</Link>
          </div>
        )}

        {isDemo && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-medium">
              <Sparkles className="w-5 h-5" />
              <span>Viewing **Live AI Sample**. This is the quality of document our engine produces.</span>
            </div>
            <Link href="/wizard" className="px-4 py-2 bg-emerald-500 text-black text-sm font-bold rounded-lg hover:bg-emerald-400 transition-all">Generate Your Own</Link>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium">{error}</div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-foreground/[0.07] pb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isDemo ? 'Live Demo Bundle' : 'Compliance Bundle Ready'}</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight">ComplianceShield AI</h2>
            <p className="text-foreground/40">{isDemo ? 'Sample: Global Fintech SaaS' : 'Elite Audit powered by Free AI Engine'}</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            {!isDemo && (
              <a href={isTrial ? '/login?next=/dashboard' : '/dashboard'} className="w-full md:w-auto px-6 py-4 bg-foreground/5 hover:bg-foreground/10 text-foreground border border-foreground/10 font-bold rounded-2xl transition-all text-center">
                {isTrial ? 'Sign In to Save' : 'View Dashboard'}
              </a>
            )}
            <div className="flex items-center gap-2 w-full md:w-auto">
              {/* Off-screen capture container for PDF rendering */}
              <div className="fixed -left-[9999px] top-0 pointer-events-none">
                <div ref={reportRef} className="w-[1000px] p-16 bg-white text-black prose prose-slate max-w-none" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <div className="text-right text-[10px] text-zinc-400 mb-12 uppercase tracking-widest font-bold">ComplianceShield AI | Official Audit Bundle v2026</div>
                  <ReactMarkdown>{report}</ReactMarkdown>
                </div>
              </div>
              <button onClick={downloadPDF} disabled={isDownloading} className="flex-1 md:flex-none px-6 py-4 bg-emerald-500 text-black font-bold rounded-2xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                {isDownloading ? 'Downloading...' : 'Download Report'}
              </button>
              <button onClick={() => { sessionStorage.removeItem('wizard_state'); isDemo ? window.location.href = '/wizard' : window.location.reload(); }} className="p-4 bg-foreground/5 text-foreground rounded-2xl hover:bg-foreground/10 border border-foreground/10 transition-all" title="Start Over">
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="glass-card p-10 rounded-[2.5rem] prose prose-emerald dark:prose-invert max-w-none shadow-2xl">
          <ReactMarkdown>{report}</ReactMarkdown>
        </div>

        {isTrial && !isDemo && (
          <div className="p-12 glass-card rounded-[3rem] text-center space-y-8 relative overflow-hidden border border-emerald-500/20">
            <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] pointer-events-none" />
            <h3 className="text-3xl font-bold">Impressive, isn&apos;t it?</h3>
            <p className="text-foreground/40 max-w-lg mx-auto">Sign up today to save this report, unlock unlimited generations, and receive automatic regulatory updates for 2026.</p>
            <Link href="/login" className="inline-block px-10 py-5 bg-emerald-500 text-black font-extrabold rounded-2xl hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              Create Account & Claim Report
            </Link>
          </div>
        )}
      </motion.div>
    );
  }

  // ── Generating / Thinking loader ─────────────────────────────────────
  if (isGenerating || isThinking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-12">
        <div className="relative">
          <motion.div className="absolute inset-0 bg-emerald-500/20 blur-[80px]" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 3, repeat: Infinity }} />
          {isThinking ? <Sparkles className="w-32 h-32 text-emerald-500 relative z-10 animate-pulse" /> : <Shield className="w-32 h-32 text-emerald-500 relative z-10" />}
        </div>
        <div className="space-y-4 max-w-sm px-6">
          <h2 className="text-4xl font-bold text-foreground">
            {isThinking ? (
              currentStep < 3 ? 'Analyzing Context...' : currentStep < 7 ? 'Mapping Risk Profile...' : 'Finalizing Strategy...'
            ) : 'Generating 2026 Audit Bundle...'}
          </h2>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-emerald-500/10 border-l-4 border-emerald-500 rounded-r-xl text-emerald-600 dark:text-emerald-400 text-sm font-bold uppercase tracking-tight shadow-sm flex items-center gap-2">
            <Zap className="w-4 h-4 animate-pulse" />
            <span>POWERED BY PUTER.JS FREE AI ENGINE</span>
          </motion.div>
          <p className="text-foreground/40 leading-relaxed font-medium">
            {isThinking ? 'Generating a unique question tailored to your risk profile.' : 'Our GPT-4o engine is building your high-fidelity compliance bundle.'}
          </p>
        </div>
        <div className="w-64 h-1.5 bg-foreground/5 rounded-full overflow-hidden">
          <motion.div className="h-full bg-emerald-500" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: isGenerating ? 15 : 4, repeat: Infinity }} />
        </div>
      </div>
    );
  }

  // ── Wizard questions ─────────────────────────────────────────────────
  const progress = ((currentStep + 1) / 10) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-foreground/30">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-emerald-500" />
            <span>{isTrial ? 'GUEST: 1/hr limit' : 'PRO: 7/hr limit'}</span>
          </div>
          <span>Step {currentStep + 1} of 10</span>
        </div>
        <div className="h-1.5 bg-foreground/5 rounded-full overflow-hidden">
          <motion.div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
          {currentQuestion && (
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">{currentQuestion.title}</h2>
              <p className="text-xl text-foreground/40 flex items-center gap-2">
                <Info className="w-5 h-5 text-emerald-500/40" />
                {currentQuestion.description}
              </p>
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-4 bg-emerald-500/5 border-l-4 border-emerald-500 rounded-r-xl text-emerald-600 dark:text-emerald-400 text-sm italic shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                {currentStep === 0 && <div className="space-y-1"><p>Step 1: Foundational Analysis. Our AI adapts entirely based on this primary vector.</p><p className="text-[10px] uppercase tracking-widest opacity-60">Powered by Puter.js — Free & Unlimited</p></div>}
                {currentStep > 0 && currentStep < 5 && 'Great progress! Building a solid foundation for your legal audit.'}
                {currentStep >= 5 && currentStep < 9 && 'Almost there. These details differentiate a good report from an expert one.'}
                {currentStep === 9 && 'Final step! Our engine is ready to synthesize your custom 2026 compliance bundle.'}
              </motion.div>
            </div>
          )}

          {currentQuestion && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option: string, idx: number) => {
                const isSelected = answers[currentQuestion?.id || ''] === option;
                return (
                  <motion.button
                    key={option}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(option)}
                    className={cn(
                      'p-8 rounded-[2rem] text-left transition-all border-2 group relative overflow-hidden',
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-foreground'
                        : 'bg-foreground/[0.03] border-foreground/[0.05] text-foreground/40 hover:bg-foreground/[0.05] hover:border-foreground/10'
                    )}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-lg font-bold transition-colors group-hover:text-foreground">{option}</span>
                      {isSelected && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                    </div>
                    <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/[0.02] transition-colors" />
                  </motion.button>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">{error}</div>}

      <div className="flex items-center justify-between pt-12 border-t border-foreground/5">
        {currentStep > 0 && (
          <button onClick={previous} disabled={isThinking} className="px-8 py-5 border-2 border-foreground/5 hover:border-foreground/10 text-foreground/40 hover:text-foreground font-bold rounded-2xl transition-all flex items-center gap-2 group">
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Previous
          </button>
        )}
        <div className={cn('ml-auto', currentStep === 0 && 'w-full flex justify-end')}>
          <button
            onClick={next}
            disabled={!currentQuestion || !answers[currentQuestion?.id || ''] || isThinking}
            className="px-10 py-5 bg-emerald-500 text-black font-extrabold rounded-2xl hover:bg-emerald-400 disabled:opacity-30 flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
          >
            {currentStep === 9 ? 'Generate Report' : 'Continue'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

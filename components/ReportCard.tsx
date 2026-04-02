'use client';

import React, { useState, useRef } from 'react';

import { Download, Loader2, Eye, EyeOff, FileText, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { logReportDownload } from '@/app/actions/audit';
import { generateProfessionalPDF } from '@/lib/pdf-engine';

interface ReportCardActionsProps {
  reportContent: string;
  industry: string;
}

export function ReportCardActions({ reportContent, industry }: ReportCardActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const pdfSourceRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (isDownloading || !pdfSourceRef.current) return;
    setIsDownloading(true);
    try {
      await logReportDownload(`${industry} Compliance Bundle`);
      
      const fileName = `ComplianceShield_${industry.replace(/\s+/g, '_')}_Archive.pdf`;
      await generateProfessionalPDF(pdfSourceRef.current, fileName);

    } catch (err) {
      console.error('Download failed:', err);
      window.print(); // Final emergency fallback
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden container for PDF capture to ensure perfect light-mode formatting */}
      <div className="hidden">
        <div ref={pdfSourceRef} className="p-12 bg-white text-black prose max-w-none">
          <ReactMarkdown>{reportContent}</ReactMarkdown>
        </div>
      </div>

      {isExpanded && (
        <div className="rounded-2xl bg-background border border-foreground/10 p-6 prose prose-sm prose-emerald dark:prose-invert max-w-none overflow-auto max-h-[600px] text-sm leading-relaxed shadow-inner">
          <ReactMarkdown>{reportContent}</ReactMarkdown>
        </div>
      )}
      
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 px-4 py-3 bg-foreground/5 hover:bg-foreground/10 text-foreground border border-foreground/10 hover:border-foreground/20 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm"
        >
          {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {isExpanded ? 'Collapse' : 'View Full Report'}
        </button>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 shadow-lg shadow-emerald-500/20"
        >
          {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {isDownloading ? 'Downloading...' : 'Download PDF'}
        </button>
      </div>
    </div>
  );
}


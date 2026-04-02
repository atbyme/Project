'use client';

import { useState } from 'react';
import { Download, Loader2, Eye, EyeOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { logReportDownload } from '@/app/actions/audit';

interface ReportCardActionsProps {
  reportContent: string;
  industry: string;
}

export function ReportCardActions({ reportContent, industry }: ReportCardActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      await logReportDownload(`${industry} Compliance Bundle`);
      setTimeout(() => window.print(), 300);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      {isExpanded && (
        <div className="rounded-2xl bg-background border border-foreground/10 p-6 prose prose-sm prose-emerald dark:prose-invert max-w-none overflow-auto max-h-[500px] text-sm leading-relaxed">
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
          className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {isDownloading ? 'Logging...' : 'Download PDF'}
        </button>
      </div>
    </div>
  );
}

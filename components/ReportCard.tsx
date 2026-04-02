'use client';

import React, { useState, useRef } from 'react';
import { Download, Loader2, Eye, EyeOff, FileText, CheckCircle2, Trash2, X, AlertCircle } from 'lucide-react';

import ReactMarkdown from 'react-markdown';
import { logReportDownload } from '@/app/actions/audit';
import { generateProfessionalPDF } from '@/lib/pdf-engine';
import { deleteReport } from '@/app/actions/deleteReport';

interface ReportCardActionsProps {
  id?: string; // Optional report ID for deletion
  reportContent: string;
  industry: string;
}

export function ReportCardActions({ id, reportContent, industry }: ReportCardActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
      alert("PDF Gen Failed. Please try Chrome/Edge for best results.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || isDeleting) return;
    setIsDeleting(true);
    try {
      const res = await deleteReport(id);
      if (!res.success) throw new Error(res.error);
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Off-screen capture container for high-fidelity PDF rendering (hidden: none breaks canvas) */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none">
        <div 
          ref={pdfSourceRef} 
          className="w-[1000px] p-16 bg-white text-black prose prose-slate max-w-none"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <div className="text-right text-[10px] text-zinc-400 mb-12 uppercase tracking-widest font-bold">
            ComplianceShield AI | Official Audit Bundle v2026
          </div>
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
          {isDownloading ? 'Downlaod' : 'PDF Download'}
        </button>

        {id && (
          <div className="relative group">
            {showConfirm ? (
              <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 p-1 rounded-xl animate-fade-in">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-all disabled:opacity-50"
                >
                  {isDeleting ? '...' : 'Confirm'}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="p-2 text-foreground/40 hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="p-3.5 bg-foreground/5 hover:bg-red-500/20 text-foreground/40 hover:text-red-500 border border-foreground/10 hover:border-red-500/20 rounded-xl transition-all"
                title="Delete Report"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



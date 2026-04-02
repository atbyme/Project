import { createClient } from '@/lib/server';
import {
  Shield, Clock, Building2, FileText,
  Plus, LogOut, Calendar, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ReportCardActions } from '@/components/ReportCard';

// ── Industry colour mapping ─────────────────────────────────────────────────
const INDUSTRY_STYLES: Record<string, { bg: string; badge: string; dot: string }> = {
  'Healthcare / Medical':           { bg: 'bg-blue-500/10',    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',    dot: 'bg-blue-500'    },
  'Software / SaaS':                { bg: 'bg-emerald-500/10', badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-500' },
  'Legal / Professional Services':  { bg: 'bg-purple-500/10',  badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',  dot: 'bg-purple-500'  },
  'Finance / Fintech':              { bg: 'bg-amber-500/10',   badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',   dot: 'bg-amber-500'   },
  'E-commerce':                     { bg: 'bg-pink-500/10',    badge: 'bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20',    dot: 'bg-pink-500'    },
};

function getIndustryStyle(industry: string) {
  return INDUSTRY_STYLES[industry] ?? {
    bg: 'bg-slate-500/10',
    badge: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    dot: 'bg-slate-400',
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function getDeviceName(ua: string | null) {
  if (!ua) return 'Unknown';
  if (ua.includes('iPhone'))  return 'iPhone';
  if (ua.includes('iPad'))    return 'iPad';
  if (ua.includes('Mac'))     return 'Mac';
  if (ua.includes('Windows')) return 'Windows PC';
  if (ua.includes('Android')) return 'Android';
  return 'Desktop';
}

// ── Page ────────────────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let query = supabase.from('compliance_reports').select('*');
  if (user) {
    query = query.eq('user_id', user.id);
  }

  const { data: reports, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Dashboard DB error:', JSON.stringify(error, null, 2));
  }

  const totalReports    = reports?.length ?? 0;
  const uniqueIndustries = [...new Set(reports?.map(r => r.industry).filter(Boolean) ?? [])];
  const now = new Date();
  const thisMonth = reports?.filter(r => {
    const d = new Date(r.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length ?? 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 glow-mesh pointer-events-none opacity-60 z-0" />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-foreground/[0.07] bg-background/80 backdrop-blur-xl no-print">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_14px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-transform">
              <Shield className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold tracking-tight">
              ComplianceShield <span className="text-emerald-500">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/wizard"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-sm transition-all shadow-[0_0_14px_rgba(16,185,129,0.25)]"
            >
              <Plus className="w-4 h-4" />
              New Report
            </Link>
            <ThemeToggle />
            {user && (
              <form action="/auth/signout" method="POST">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-foreground/10 text-foreground/50 hover:text-foreground hover:bg-foreground/5 text-sm font-medium transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </form>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-10 relative z-10">

        {/* ── Header ── */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest">
            <Shield className="w-3.5 h-3.5" />
            Compliance Vault
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Your Compliance Archive
          </h1>
          <p className="text-foreground/40 text-lg">
            {user ? (
              <>Secure vault for <span className="font-semibold text-foreground">{user.email}</span></>
            ) : (
              'Your generated compliance reports'
            )}
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Reports',       value: totalReports,            icon: FileText,   color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: 'Industries Covered',  value: uniqueIndustries.length, icon: Building2,   color: 'text-blue-500',    bg: 'bg-blue-500/10'    },
            { label: 'Generated This Month', value: thisMonth,              icon: Calendar,    color: 'text-purple-500',  bg: 'bg-purple-500/10'  },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-2xl p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-extrabold">{s.value}</p>
                <p className="text-xs text-foreground/40 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Reports Grid ── */}
        {!reports || reports.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-foreground/10 rounded-3xl bg-foreground/[0.02]">
            <FileText className="w-14 h-14 text-foreground/20 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Reports Yet</h2>
            <p className="text-foreground/40 mb-8">Generate your first compliance bundle to see it here.</p>
            <Link
              href="/wizard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              <Plus className="w-5 h-5" />
              Generate First Report
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {reports.map((report) => {
              const style = getIndustryStyle(report.industry || 'Other');
              return (
                <div
                  key={report.id}
                  className="glass-card rounded-2xl p-6 md:p-8 space-y-6 hover:border-emerald-500/30 transition-all"
                >
                  {/* Card header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${style.badge}`}>
                        <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                        {report.industry || 'General'}
                      </div>
                      <h3 className="text-xl font-bold">
                        {report.industry || 'General'} Compliance Bundle
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-foreground/40">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(report.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          AI-Verified
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {getDeviceName(report.user_agent)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Preview snippet */}
                  <div className="relative rounded-xl bg-foreground/[0.03] border border-foreground/[0.06] p-5 overflow-hidden max-h-28">
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background/80 to-transparent z-10" />
                    <p className="text-sm text-foreground/50 leading-relaxed line-clamp-4 font-mono">
                      {report.report_content?.replace(/[#*>\-`]/g, '').slice(0, 300)}…
                    </p>
                  </div>

                  {/* Actions — client component */}
                  <ReportCardActions
                    reportContent={report.report_content}
                    industry={report.industry || 'Compliance'}
                  />
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="relative z-10 border-t border-foreground/[0.06] py-8 text-center text-foreground/25 text-sm no-print">
        <p>© 2026 ComplianceShield AI — Built for the modern firm.</p>
      </footer>
    </div>
  );
}

'use server';

import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { checkBotScore } from '@/lib/bot-protection';
import { headers } from 'next/headers';
import { createClient } from '@/lib/server';

/**
 * generateComplianceReport
 * AI generation happens CLIENT-SIDE via puter.js (window.puter.ai.chat).
 * This server action only handles: bot check, rate limiting, and DB insert.
 * @param rawAnswers  - The wizard answers
 * @param preGeneratedReport - The report already generated client-side by puter.js
 */
export async function generateComplianceReport(rawAnswers: any, preGeneratedReport?: string) {
  try {
    // ── Bot Protection ────────────────────────────────────────────────
    const botCheck = await checkBotScore();
    if (botCheck.isBot) {
      return { success: false, error: 'Access denied: automated request detected.' };
    }

    // ── Rate Limiting ─────────────────────────────────────────────────
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'localhost';

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const limit = user ? 7 : 1;
    const limitStatus = await checkRateLimit(ip, limit);

    if (!limitStatus.success) {
      return {
        success: false,
        error: user
          ? 'Professional limit reached: 7 reports/hour. Please try again shortly.'
          : 'Trial limit reached: 1 report/hour. Sign in for higher limits (7/hour).',
      };
    }

    // ── Validate input ────────────────────────────────────────────────
    const ComplianceSchema = z.record(z.string(), z.unknown());
    const result = ComplianceSchema.safeParse(rawAnswers);
    if (!result.success) {
      return { success: false, error: 'Invalid data. Please complete the questionnaire.' };
    }

    const answers = result.data;
    const industry = answers.industry || 'General Business';
    const seed = Math.random().toString(36).substring(2, 9);

    // ── Use the pre-generated report from client-side puter.js ────────
    const finalReport = preGeneratedReport;
    if (!finalReport || finalReport.trim().length === 0) {
      return { success: false, error: 'No report content received. Please try again.' };
    }

    // ── Persist to Supabase ───────────────────────────────────────────
    const userAgent = headersList.get('user-agent') || 'Unknown';

    const { error: dbError } = await supabase.from('compliance_reports').insert([{
      report_content: finalReport,
      ip_address:     ip,
      user_agent:     userAgent,
      industry:       industry,
      user_id:        user?.id ?? null,
    }]);

    if (dbError) {
      console.error('DB Insert Error (non-fatal):', JSON.stringify(dbError, null, 2));
    }

    return {
      success: true,
      data: finalReport,
      meta: {
        model:     'ComplianceShield AI (Puter.js)',
        reference: `CS-${seed.toUpperCase()}`,
        industry,
        secure:    true,
      },
    };

  } catch (error: any) {
    console.error('Compliance Engine Error:', error);
    return {
      success: false,
      error: `Save failed: ${error.message || 'Unexpected error. Please try again.'}`,
    };
  }
}

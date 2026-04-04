'use server';

import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { checkBotScore } from '@/lib/bot-protection';
import { headers } from 'next/headers';
import { createClient } from '@/lib/server';

// Strict input validation schema
const AnswersSchema = z.object({}).passthrough().refine(
  (data) => Object.keys(data).length > 0 && Object.keys(data).length <= 20,
  'Answers must have between 1 and 20 fields'
);

const ReportContentSchema = z.string().min(100).max(50000);

/**
 * Generate and save a compliance report.
 * 
 * Rate limits:
 * - Unsigned users: 1 report per hour (tracked by IP)
 * - Signed-in users: 7 reports per hour (tracked by userId)
 */
export async function generateComplianceReport(rawAnswers: unknown, preGeneratedReport?: string) {
  try {
    // Bot protection check
    const botCheck = await checkBotScore();
    if (botCheck.isBot) {
      return { success: false, error: 'Access denied: automated request detected.' };
    }

    // Validate input before processing
    const answersResult = AnswersSchema.safeParse(rawAnswers);
    if (!answersResult.success) {
      return { success: false, error: 'Invalid questionnaire data.' };
    }

    const answers = answersResult.data;

    // Validate report content
    if (!preGeneratedReport || typeof preGeneratedReport !== 'string') {
      return { success: false, error: 'No report content received.' };
    }

    const reportResult = ReportContentSchema.safeParse(preGeneratedReport);
    if (!reportResult.success) {
      return { success: false, error: 'Report content is invalid.' };
    }

    // Get client identity
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Rate limit key: use userId for signed-in, IP for anonymous
    const rateLimitKey = user ? `user:${user.id}` : `ip:${ip}`;
    const limit = user ? 7 : 1;

    const limitStatus = await checkRateLimit(rateLimitKey, limit);

    if (!limitStatus.success) {
      return {
        success: false,
        error: user
          ? 'Report limit reached: 7 reports per hour. Please try again shortly.'
          : 'Trial limit reached: 1 report per hour. Sign in for 7 reports per hour.',
      };
    }

    // Sanitize industry field
    const industry = String(answers.industry || 'General Business').slice(0, 100);
    const seed = Math.random().toString(36).substring(2, 9);
    const userAgent = (headersList.get('user-agent') || 'Unknown').slice(0, 500);

    // Persist to Supabase
    const { error: dbError } = await supabase.from('compliance_reports').insert([{
      report_content: reportResult.data,
      ip_address: ip,
      user_agent: userAgent,
      industry: industry,
      user_id: user?.id ?? null,
    }]);

    if (dbError) {
      console.error('DB Insert Error:', dbError.message);
      return {
        success: false,
        error: 'Failed to save report. Please try again.',
      };
    }

    return {
      success: true,
      data: reportResult.data,
      meta: {
        model: 'ComplianceShield AI',
        reference: `CS-${seed.toUpperCase()}`,
        industry,
        secure: true,
      },
    };

  } catch {
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

'use server';

import { callOpenRouter, ComplianceSchema, type ComplianceData } from '@/lib/ai-client';
import { checkRateLimit } from '@/lib/rate-limit';
import { checkBotScore } from '@/lib/bot-protection';
import { headers } from 'next/headers';
import { createClient } from '@/lib/server';

export async function generateComplianceReport(rawAnswers: any) {
  try {
    // ── 0a. Bot Protection ────────────────────────────────────────────────
    const botCheck = await checkBotScore();
    if (botCheck.isBot) {
      return { success: false, error: 'Access denied: automated request detected.' };
    }

    // ── 0b. IP Rate Limiting (5 reports per hour) ─────────────────────────
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'localhost';

    const limitStatus = await checkRateLimit(ip);
    if (!limitStatus.success) {
      return {
        success: false,
        error: 'Security limit reached: You can generate up to 5 reports per hour. Please try again shortly, or upgrade to PRO for unlimited access.',
      };
    }

    // ── 0c. One-Time Trial Check (for unsigned users) ───────────────────────
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const { data: existingTrial } = await supabase
        .from('compliance_reports')
        .select('id')
        .eq('ip_address', ip)
        .is('user_id', null)
        .maybeSingle();

      if (existingTrial) {
        return {
          success: false,
          error: 'Trial limit reached: You have already generated one free report from this IP. Please sign in to generate more or access your dashboard.',
        };
      }
    }


    // ── 1. Input Validation (Zod) ─────────────────────────────────────────
    const result = ComplianceSchema.safeParse(rawAnswers);
    if (!result.success) {
      return { success: false, error: 'Invalid data provided. Please complete the questionnaire.' };
    }
    const answers = result.data;

    const industry      = answers.industry      || 'General Business';
    const dataTypes     = answers.data_types?.join(', ') || 'personal data';
    const companySize   = answers.company_size   || 'small';
    const jurisdiction  = answers.jurisdiction   || 'Global / International';
    const seed          = Math.random().toString(36).substring(2, 9);

    // ── 2. Unified High-Speed Generation (2026 Engine) ───────────────────
    const selections = Object.entries(rawAnswers)
      .filter(([q, a]) => q !== 'industry' && q !== 'step')
      .map(([q, a]) => `- ${q}: ${a}`)
      .join('\n');

    const unifiedPrompt = `
      ROLE: You are the Senior Legal Partner at a global elite compliance firm.
      CONSTRAINTS: 15-Second Generation Window. High Quality. Brief & Powerful sections.
      CLIENT DATA (Dynamic Audit Selections):
      ${selections}
      
      CORE PROFILE:
      - Industry: ${industry}
      - Scale: ${companySize}
      - Risk Vectors: ${dataTypes}
      - Jurisdiction: ${jurisdiction}

      INSTRUCTIONS:
      Generate a strictly professional, board-ready COMPLIANCE AUDIT BUNDLE. 
      The tone must be authoritative, expert, and client-focused. 
      Use clean Markdown. NO random JSON, NO technical keys.

      STRUCTURE:
      1. # ComplianceShield 2026 Professional Audit
      2. ## Executive Summary (CEO Focus)
      3. ## Regulatory Landscape (${jurisdiction} specific)
      4. ## Operational Controls
      5. ## 6-Month Roadmap
      6. ## Final Checklist

      Return ONLY the Markdown.
    `;

    // Using the fastest available free model for 15s guarantee
    const finalReport = await callOpenRouter(unifiedPrompt, 'google/gemini-2.0-flash-exp:free', 3000); 


    if (!finalReport) throw new Error('AI Engine failed to produce a report.');

    // ── 3. Persist to Supabase ────────────────────────────────────────────
    const userAgent = headersList.get('user-agent') || 'Unknown';

    const { error: dbError } = await supabase.from('compliance_reports').insert([{
      report_content: finalReport,
      ip_address:     ip,
      user_agent:     userAgent,
      industry:       industry,
      user_id:        user?.id ?? null,
    }]);




    if (dbError) {
      // Log but don't fail — the report was generated successfully
      console.error('DB Insert Error (non-fatal):', JSON.stringify(dbError, null, 2));
    }

    return {
      success: true,
      data: finalReport,
      meta: {
        model:      'ComplianceShield AI Engine (2-Step)',
        reference:  `CS-${seed.toUpperCase()}`,
        industry,
        secure:     true,
      },
    };

  } catch (error: any) {
    console.error('Compliance Engine Error:', error);
    return {
      success: false,
      error: `Generation failed: ${error.message || 'Unexpected error. Please try again.'}`,
    };
  }
}

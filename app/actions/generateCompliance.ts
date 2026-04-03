'use server';

import { callPuterAI, ComplianceSchema, type ComplianceData } from '@/lib/ai-client';
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

    // ── 0b. Dynamic Rate Limiting ─────────────────────────────────────────
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'localhost';

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Guests: 1 per hour | Users: 7 per hour
    const limit = user ? 7 : 1; 
    const limitStatus = await checkRateLimit(ip, limit);
    
    if (!limitStatus.success) {
      return {
        success: false,
        error: user 
          ? 'Daily Professional limit reached: You have used your 7 reports for this hour. Please try again shortly.'
          : 'Trial limit reached: Guests can generate 1 report per hour. Please sign in for higher limits (7/hour).',
      };
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
      ROLE: You are the Lead Compliance & Security Architect at a top-tier advisory firm.
      CONSTRAINTS: 15-Second Generation Window. High Quality. Brief, Impactful, and Pitch-Ready.
      MAX LENGTH: 600 words. Do not ramble. Every sentence must hold value for a board member or CEO.

      CLIENT DISCOVERIES (Dynamic Audit Selections):
      ${selections}
      
      CORE PROFILE:
      - Industry: ${industry}
      - Scale: ${companySize}
      - Risk Vectors: ${dataTypes}
      - Jurisdiction: ${jurisdiction}

      INSTRUCTIONS for PITCH-READY REPORT:
      1. Synthesize the 'CLIENT DISCOVERIES' into a strictly professional, board-ready COMPLIANCE AUDIT BUNDLE.
      2. The report must be highly persuasive and designed to be presented to C-suite executives and external auditors.
      3. Tone MUST be authoritative, expert, and highly polished. Do not use generic filler. 
      4. Highlight specific, actionable risks based on their exact selections.
      5. Output MUST be clean Markdown. NO random JSON, NO conversational openings. Start directly with the title.

      STRUCTURE:
      # ComplianceShield 2026 Executive Audit Bundle
      ## 1. Executive Summary & Strategic Importance
      ## 2. Targeted Regulatory Frameworks (${jurisdiction} / ${industry} specific)
      ## 3. Critical Operational Security Posture (Based on their answers)
      ## 4. Priority 6-Month Mitigation Roadmap
      ## 5. Certification & Readiness Checklist
    `;

    const finalReport = await callPuterAI(unifiedPrompt, 'claude-3-5-sonnet', 3000); 


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

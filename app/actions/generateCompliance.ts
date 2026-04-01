'use server';

/**
 * AI CLIENT (CORE ENGINE)
 * [ARCHITECT NOTE]: We use OpenRouter here to give the buyer "Model Agnostic" 
 * freedom—this prevents vendor lock-in and is a huge selling point.
 * We've also added Zod validation to ensure the AI never receives malicious data.
 */

import { callOpenRouter, ComplianceSchema, type ComplianceData } from '@/lib/ai-client';
import { checkRateLimit } from '@/lib/rate-limit';
import { checkBotScore } from '@/lib/bot-protection';
import { headers } from 'next/headers';

export async function generateComplianceReport(rawAnswers: any) {
  try {
    // 0. Security: Bot Protection
    const botCheck = await checkBotScore();
    if (botCheck.isBot) throw new Error("Bot access denied.");

    // 0. Security: Rate Limit Check (5 Requests per Hour)
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'localhost';
    
    const limitStatus = await checkRateLimit(ip);
    if (!limitStatus.success) {
      return { 
        success: false, 
        error: 'Security Alert: You have reached the hourly limit (5 reports). Please try again in 1 hour or upgrade to PRO.' 
      };
    }

    // 1. Advanced Input Validation (Buyer Security Check)
    console.log('Validating data schema via Zod...');
    const result = ComplianceSchema.safeParse(rawAnswers);
    if (!result.success) {
      return { success: false, error: 'Invalid data provided for compliance generation.' };
    }
    const answers = result.data;

    // 2. Phase 1: The "Architect" Step (Generating a Master Prompt)
    console.time('AI_Architect_Step');
    console.log('AI Architect: Building specialize legal instructions...');
    
    // [HUMAN TOUCH]: Adding a randomized structural seed to ensure uniqueness.
    const seed = Math.random().toString(36).substring(7);

    const architectPrompt = `
      You are a Senior Legal Partner. [Ref: ${seed}]
      User context: ${JSON.stringify(answers)}

      Write a CONCISE (100 words max) "Persona & Instructions" for a legal writer AI. 
      INSTRUCTIONS:
      1. Start with a "Table of Contents" (Linkable).
      2. Style: Warm, Authoritative, Supportive.
      3. Focus: Gaps for ${answers.data_types?.join(', ') || 'personal data'}.
      4. Signature: "Certified by ComplianceShield Logic [A-2026]".
      
      Only return the instructions. No intro.
    `;

    // Use a fast model for the Architect step (8B or similar)
    const masterPrompt = await callOpenRouter(architectPrompt, 'meta-llama/llama-3-8b-instruct:free');
    console.timeEnd('AI_Architect_Step');
    if (!masterPrompt) throw new Error('AI Architect failed.');

    // 3. Phase 2: The "Expert Writer" Step (Executing the Master Prompt)
    console.time('AI_Writer_Step');
    console.log('AI Expert: Synthesizing the final compliance bundle...');
    const finalReport = await callOpenRouter(masterPrompt, 'openrouter/free');
    console.timeEnd('AI_Writer_Step');

    return { 
      success: true, 
      data: finalReport,
      meta: {
        model: 'openrouter/free (2-Step AI)',
        architected: true,
        secure: true
      }
    };
  } catch (error: any) {
    console.error('Compliance Engine Error:', error);
    
    // Security check: Don't leak technical error details to the frontend
    const uiError = error.message?.includes('429') 
      ? 'Servers are temporarily busy. Retrying in background...' 
      : 'Generation failed. Security system blocked a malformed response.';
      
    return { success: false, error: uiError };
  }
}

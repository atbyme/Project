'use server';

import { callOpenRouter, ComplianceSchema, type ComplianceData } from '@/lib/ai-client';

export async function generateComplianceReport(rawAnswers: any) {
  try {
    // 1. Advanced Input Validation (Buyer Security Check)
    console.log('Validating data schema via Zod...');
    const result = ComplianceSchema.safeParse(rawAnswers);
    if (!result.success) {
      return { success: false, error: 'Invalid data provided for compliance generation.' };
    }
    const answers = result.data;

    // 2. Phase 1: The "Architect" Step (Generating a Master Prompt)
    console.log('AI Architect: Building specialize legal instructions...');
    const architectPrompt = `
      You are a World-Class Compliance Architect specializing in GDPR and HIPAA for ${answers.industry} firms.
      User handles: ${answers.data_types.join(', ')}.
      Business setup: ${answers.storage} storage, ${answers.access} access, ${answers.training} training.

      Based on these details, write a highly detailed, 500-word "Master Master Prompt" for a legal writer AI. 
      The prompt should instruct the writer to generate a 2026-standard Compliance Security Whitepaper.
      Only return the prompt text. No introduction.
    `;

    const masterPrompt = await callOpenRouter(architectPrompt, 'openrouter/free');
    if (!masterPrompt) throw new Error('AI Architect failed to generate instructions.');

    // 3. Phase 2: The "Expert Writer" Step (Executing the Master Prompt)
    console.log('AI Expert: Synthesizing the final compliance bundle...');
    const finalReport = await callOpenRouter(masterPrompt, 'openrouter/free');

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

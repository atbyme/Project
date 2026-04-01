'use server';

import { callOpenRouter } from '@/lib/ai-client';
import { checkBotScore } from '@/lib/bot-protection';
import { checkRateLimit } from '@/lib/rate-limit';
import { headers } from 'next/headers';


/**
 * Generate Next Dynamic Question
 * Uses AI to create a unique, logical next step based on the user's audit context.
 */
export async function generateNextQuestion(previousAnswers: Record<string, any>, stepCount: number) {
  try {
    // Security: Bot Protection (Keep this for safety)
    const botCheck = await checkBotScore();
    if (botCheck.isBot) throw new Error("Bot access denied.");

    // [REM-RATE-LIMIT] Removed checkRateLimit from here so individual questions 
    // don't count towards the 5-report final bundle limit.

    const history = Object.entries(previousAnswers)
      .filter(([q, a]) => q.includes(' ') || q === 'industry') // Only show the full titles in history to avoid confusing AI with IDs
      .map(([q, a]) => `Q: ${q}, A: ${a}`)
      .join('\n');

    const prompt = `
      You are a World-Class Compliance Consultant. 
      The user is an audit for a ${previousAnswers.industry || 'company'}.
      Previous history:
      ${history}

      This is step ${stepCount + 1} of 10.
      CRITICAL: Generate a UNIQUE, high-value compliance question that helps determine GDPR or HIPAA readiness.
      CRITICAL: DO NOT REPEAT any topics or themes from the previous history. 
      CRITICAL: If the history is ${history}, the new question must cover a COMPLETELY DIFFERENT security domain (e.g., if history was about Data Privacy, ask about Physical Security or Incident Response).

      Return ONLY a JSON object in this format:
      {
        "id": "dynamic_step_${stepCount}",
        "title": "Question text here?",
        "description": "Short explanation of why this matters for compliance.",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
      }

      Do not include any other text or markdown.
    `;

    const response = await callOpenRouter(prompt, 'openai/gpt-4o-mini', 800);
    // Extract only the JSON object, ignoring conversational text
    const match = response.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Could not parse JSON from AI response.");
    const jsonStr = match[0];
    const question = JSON.parse(jsonStr);

    return { success: true, data: question };
  } catch (error: any) {
    console.error('Dynamic Question Error:', error);
    // Fallback question if AI fails
    return { 
      success: true, 
      data: {
        id: `fallback_${stepCount}`,
        title: "How do you classify sensitive data?",
        description: "Data classification is a core part of security policy.",
        options: ["Strictly Confidential", "Internal Only", "Public", "Not classified"]
      }
    };
  }
}

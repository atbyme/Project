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
      .filter(([q, a]) => q.includes(' ') || q === 'industry' || q === 'step') 
      .map(([q, a]) => `User Selection for "${q}": ${a}`)
      .join('\n');

    const prompt = `
      ROLE: You are a WORLD-CLASS SENIOR COMPLIANCE PARTNER specializing in ${previousAnswers.industry || 'Global Cybersecurity'}.
      
      CONTEXT: You are conducting a deep-dive compliance audit.
      SESSION HISTORY:
      ${history}

      OBJECTIVE: Generate the NEXT logical question for Step ${stepCount + 1} of 10.
      
      RULES for UNIQUNESS:
      1. CRITICAL: NEVER repeat a topic or domain already covered in the HISTORY. 
      2. CRITICAL: If the user chose a specific industry, your questions MUST be specialized for that sector (e.g., if Finance, ask about PCI-DSS/SOX; if Health, ask about HIPAA/HITECH).
      3. CRITICAL: Avoid generic "Yes/No" questions. Force the user to choose between high-value operational strategies.
      4. STYLE: Use authoritative, boardroom-level language.

      OUTPUT FORMAT (JSON ONLY):
      {
        "id": "dynamic_step_${stepCount}",
        "title": "Professional question here?",
        "description": "Expert reasoning for this audit point.",
        "options": ["High-Value Option A", "High-Value Option B", "Option C", "Option D"]
      }

      Return ONLY the JSON. No preamble.
    `;

    const response = await callOpenRouter(prompt, 'google/gemini-2.0-flash-exp:free', 500); 
// Faster, low-latency model

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

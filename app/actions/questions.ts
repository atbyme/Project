'use server';

import { callPuterAI } from '@/lib/ai-client';
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
      
      RULES for UNIQUNESS & SPEED:
      1. CRITICAL: NEVER repeat a topic already covered. 
      2. CRITICAL: If the user chose a specific industry, specialize immediately.
      3. CRITICAL: TITLE must be under 12 words. DESCRIPTION must be under 20 words.
      4. STYLE: Authoritative, boardroom-level language.

      OUTPUT FORMAT (JSON ONLY):
      {
        "id": "dynamic_step_${stepCount}_${Math.random().toString(36).substring(7)}",
        "title": "Short Professional Question?",
        "description": "Expert reasoning (brief).",
        "options": ["Option A", "Option B", "Option C", "Option D"]
      }

      Return ONLY the JSON.
    `;


    // Using Puter's GPT-4o-mini for ultra-fast (sub-second) dynamic logic
    const response = await callPuterAI(prompt, 'gpt-4o-mini', 500); 

    // Extract only the JSON object, ignoring conversational text
    const match = response.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Could not parse JSON from AI response.");
    const jsonStr = match[0];
    const question = JSON.parse(jsonStr);

    return { success: true, data: question };
  } catch (error: any) {
    console.error('Dynamic Question Error:', error);
    
    // ── SMART FALLBACK BANK ──────────────────────────────────────────────
    // If AI fails, we pick a relevant expert question based on the step count
    // to ensure the user never sees repetitive "filler" data.
    const fallbackBank: Record<number, any> = {
      1: { title: "How do you classify sensitive data?", description: "Data classification is a core part of security policy.", options: ["Strictly Confidential", "Internal Only", "Public", "Not classified"] },
      2: { title: "Which encryption standard is currently in use?", description: "Encryption at rest is a standard legal requirement.", options: ["AES-256 (Military Grade)", "Standard TLS", "Legacy WEP", "None / Plaintext"] },
      3: { title: "What is your Incident Response timeframe?", description: "Articles define specific breach notification windows.", options: ["Under 2 hours", "Within 24 hours", "Under 72 hours (GDPR Standard)", "Best effort"] },
      4: { title: "How are access logs reviewed?", description: "Audit trails are critical for forensic compliance.", options: ["Daily Automated", "Weekly Manual", "On-demand only", "No logging"] },
      5: { title: "Where is your primary data center located?", description: "Jurisdiction affects data residency laws.", options: ["European Union (GDPR Zone)", "United States", "Multi-region Global", "Local On-premise"] },
      6: { title: "Who has administrative access to databases?", description: "Principle of Least Privilege is a core audit point.", options: ["Designated Security Admins", "All Engineering staff", "Third-party vendors", "Shared root access"] },
      7: { title: "How often are vulnerability scans performed?", description: "Proactive security is a baseline requirement.", options: ["Continuous Real-time", "Weekly Scheduled", "Quarterly Audit", "Annually / Never"] },
      8: { title: "Is your staff trained on Phishing & Social Engineering?", description: "Human factors are the #1 compliance risk.", options: ["Yes (Quarterly Training)", "Annually", "Onboarding only", "No formal training"] },
      9: { title: "Are backups stored in an immutable environment?", description: "Ransomware protection for compliance integrity.", options: ["Yes (WORM / Immutable)", "Standard Cloud Backup", "Local Tape / NAS", "No backup policy"] },
    };

    const fallback = fallbackBank[stepCount] || fallbackBank[1];

    return { 
      success: true, 
      data: {
        id: `fallback_${stepCount}`,
        ...fallback
      }
    };
  }
}


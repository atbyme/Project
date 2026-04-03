/**
 * PUTER AI SECURITY CLIENT
 * [ARCHITECT NOTE]: Migrated to Puter.js for high-speed, free Claude models.
 * Uses PUTER_TOKEN for backend authentication.
 */

import { z } from 'zod';

export const ComplianceSchema = z.any();
export type ComplianceData = z.infer<typeof ComplianceSchema>;

const FALLBACK_MODELS = [
  "claude-3-5-sonnet",
  "claude-3-opus",
  "gpt-4o",
  "gpt-4o-mini",
  "meta-llama/llama-3.1-70b-instruct"
];

export async function callPuterAI(prompt: string, model: string = "claude-3-5-sonnet", maxTokens: number = 2000) {
  const apiKey = process.env.PUTER_TOKEN;

  if (!apiKey) {
    throw new Error("No PUTER_TOKEN found in your .env.local file. Please sign up at puter.com and add your token.");
  }

  const modelsToTry = [model, ...FALLBACK_MODELS.filter(m => m !== model)];
  let lastErrorSummary = "";

  for (const currentModel of modelsToTry) {
    try {
      console.log(`[AI-DIAGNOSTIC] Trying Puter model ${currentModel}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s for Puter

      const response = await fetch("https://api.puter.com/puterai/openai/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: currentModel,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7, 
          max_tokens: maxTokens,
        }),
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.choices?.[0]?.message?.content) {
          return data.choices[0].message.content;
        }
      }

      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error?.message || response.statusText;
      console.warn(`[AI-DIAGNOSTIC] ${currentModel} failed (${response.status}): ${errorMsg}`);
      lastErrorSummary = `Detailed Reason: "${errorMsg}" (on model: ${currentModel})`;
      
    } catch (err: any) {
      console.warn(`[AI-DIAGNOSTIC] Connection error for ${currentModel}:`, err.message);
      lastErrorSummary = `Connection Error: ${err.message}`;
    }
  }

  throw new Error(`AI GENERATION FAILED after trying ${modelsToTry.length} models. \n\n${lastErrorSummary}`);
}

// Keep the old export for backward compatibility during migration if needed, but pointing to the new engine
export const callOpenRouter = callPuterAI;


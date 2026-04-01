/**
 * OPENROUTER SECURITY CLIENT
 * [ARCHITECT NOTE]: Using x-title and http-referer allows us to 
 * professionalize our API footprint, preventing rate limits and 
 * showcasing the "ComplianceShield" brand to AI providers.
 */

import { z } from 'zod';

// Security Schema for Buyer Impression
export const ComplianceSchema = z.object({
  industry: z.string().min(2).max(50),
  data_types: z.array(z.string()).min(1),
  storage: z.string().min(2),
  access: z.string(),
  training: z.string(),
  vendors: z.string(),
  breach: z.string(),
  rights: z.string(),
  backup: z.string(),
  officer: z.string(),
});


export type ComplianceData = z.infer<typeof ComplianceSchema>;

/**
 * OPENROUTER SECURITY CLIENT
 * [ARCHITECT NOTE]: Using x-title and http-referer allows us to 
 * professionalize our API footprint, preventing rate limits and 
 * showcasing the "ComplianceShield" brand.
 */
export async function callOpenRouter(prompt: string, model: string = "openrouter/free") {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY missing");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "https://complianceshield.ai", // Mock URL for professional look
      "X-Title": "ComplianceShield AI MVP",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(`OpenRouter Error: ${response.status} - ${JSON.stringify(errorBody)}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

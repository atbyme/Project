/**
 * COMPLIANCE AI ENGINE
 * Uses Pollinations.ai via local API route (avoids browser CORS).
 * Free, no API key, no sign-in required.
 * Returns null on failure so callers can use local fallback.
 */

export async function callPuterAI(
  prompt: string,
  model: string = 'gpt-4o-mini',
  maxTokens: number = 2000
): Promise<string | null> {
  try {
    console.log(`[AI] Calling AI (model: ${model})...`);

    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn(`[AI] Failed (${res.status}): ${err.error || 'unknown'}`);
      return null;
    }

    const data = await res.json();
    if (!data.text || data.text.trim().length === 0) {
      console.warn('[AI] Empty response');
      return null;
    }

    console.log('[AI] Success');
    return data.text;
  } catch (err: any) {
    console.warn(`[AI] Error: ${err.message}`);
    return null;
  }
}

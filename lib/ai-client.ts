/**
 * COMPLIANCE AI ENGINE
 * Routes AI requests through the server-side API route to avoid CORS.
 * Uses Groq (fast, 1-2s) with Pollinations as unlimited fallback.
 * Free, no API key, no sign-in required.
 * Returns null on failure so callers can use local fallback.
 */

export async function callPuterAI(
  prompt: string,
  model: string = 'gpt-4o-mini',
  isReport: boolean = false
): Promise<string | null> {
  try {
    console.log(`[AI] Calling AI (model: ${model}, report: ${isReport})...`);

    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model, isReport }),
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

    console.log(`[AI] Success (${data.source || 'unknown'}, ${data.text.length} chars)`);
    return data.text;
  } catch (err: any) {
    console.warn(`[AI] Error: ${err.message}`);
    return null;
  }
}

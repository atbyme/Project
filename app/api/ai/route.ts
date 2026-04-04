import { NextResponse } from 'next/server';

const GROQ_KEYS = (process.env.GROQ_API_KEYS || '')
  .split(',')
  .map(k => k.trim())
  .filter(k => k.length > 0 && k !== 'gsk_your_key_here');

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'mixtral-8x7b-32768',
];

let keyIndex = 0;
let modelIndex = 0;

function getNextGroqKey(): string | null {
  if (GROQ_KEYS.length === 0) return null;
  const key = GROQ_KEYS[keyIndex % GROQ_KEYS.length];
  keyIndex++;
  return key;
}

function getNextModel(): string {
  const model = GROQ_MODELS[modelIndex % GROQ_MODELS.length];
  modelIndex++;
  return model;
}

async function tryGroq(prompt: string, maxAttempts: number = GROQ_KEYS.length * GROQ_MODELS.length): Promise<string | null> {
  if (GROQ_KEYS.length === 0) return null;

  for (let i = 0; i < maxAttempts; i++) {
    const key = getNextGroqKey();
    const model = getNextModel();
    if (!key) return null;

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8,
          max_tokens: 1024,
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text && text.trim().length > 0) {
          console.log(`[AI] Groq success (model: ${model})`);
          return text;
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        console.warn(`[AI] Groq key rotated (${res.status}): ${errData.error?.message || 'unknown'}`);
      }
    } catch (err: any) {
      console.warn(`[AI] Groq error, rotating key: ${err.message}`);
    }
  }

  return null;
}

async function tryPollinations(prompt: string): Promise<string | null> {
  try {
    const encodedPrompt = encodeURIComponent(prompt);
    const res = await fetch(`https://text.pollinations.ai/${encodedPrompt}?model=openai&json=true`, {
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      console.warn(`[AI] Pollinations failed (${res.status})`);
      return null;
    }

    const text = await res.text();
    if (!text || text.trim().length === 0) return null;

    console.log('[AI] Pollinations success');
    return text;
  } catch (err: any) {
    console.warn(`[AI] Pollinations error: ${err.message}`);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { prompt, model } = await request.json();

    // 1st: Try Groq (fast, 1-2s) with multi-key rotation
    const groqResult = await tryGroq(prompt);
    if (groqResult) {
      return NextResponse.json({ text: groqResult, source: 'groq' });
    }

    console.log('[AI] All Groq keys exhausted, falling back to Pollinations...');

    // 2nd: Fallback to Pollinations (free, unlimited, slower)
    const pollResult = await tryPollinations(prompt);
    if (pollResult) {
      return NextResponse.json({ text: pollResult, source: 'pollinations' });
    }

    return NextResponse.json({ error: 'All AI providers failed' }, { status: 500 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

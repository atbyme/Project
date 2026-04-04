import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

const GROQ_KEYS = (process.env.GROQ_API_KEYS || '')
  .split(',')
  .map(k => k.trim())
  .filter(k => k.length > 0 && k !== 'gsk_your_key_here');

// Use the fastest model by default
const DEFAULT_MODEL = 'llama-3.1-8b-instant';

let keyIndex = 0;

function getNextGroqKey(): string | null {
  if (GROQ_KEYS.length === 0) return null;
  const key = GROQ_KEYS[keyIndex % GROQ_KEYS.length];
  keyIndex++;
  return key;
}

async function tryGroq(prompt: string, maxTokens: number, timeoutMs: number): Promise<string | null> {
  if (GROQ_KEYS.length === 0) return null;

  // Try each key once with the fastest model
  for (let i = 0; i < GROQ_KEYS.length; i++) {
    const key = getNextGroqKey();
    if (!key) break;

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: maxTokens,
        }),
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text && text.trim().length > 0) {
          return text;
        }
      } else if (res.status === 429 || res.status >= 500) {
        // Rate limited or server error - try next key
        continue;
      } else {
        // Other errors - try next key
        continue;
      }
    } catch {
      continue;
    }
  }

  return null;
}

async function tryPollinations(prompt: string, timeoutMs: number): Promise<string | null> {
  try {
    const encodedPrompt = encodeURIComponent(prompt);
    const res = await fetch(`https://text.pollinations.ai/${encodedPrompt}?model=openai&json=true`, {
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!res.ok) return null;

    const text = await res.text();
    if (!text || text.trim().length === 0) return null;

    return text;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
    const rateLimitKey = `ai:${ip}`;

    const limitStatus = await checkRateLimit(rateLimitKey, 30);
    if (!limitStatus.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    if (!prompt || prompt.length > 15000) {
      return NextResponse.json(
        { error: 'Invalid request. Prompt is required (max 15000 characters).' },
        { status: 400 }
      );
    }

    const isReport = body.isReport === true;
    const maxTokens = isReport ? 4096 : 512;
    const timeoutMs = isReport ? 60000 : 10000;

    const groqResult = await tryGroq(prompt, maxTokens, timeoutMs);
    if (groqResult) {
      return NextResponse.json({ text: groqResult, source: 'groq' });
    }

    const pollResult = await tryPollinations(prompt, timeoutMs);
    if (pollResult) {
      return NextResponse.json({ text: pollResult, source: 'pollinations' });
    }

    return NextResponse.json(
      { error: 'Service temporarily unavailable. Please try again.' },
      { status: 503 }
    );
  } catch {
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

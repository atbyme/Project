import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

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

async function tryGroq(prompt: string, maxTokens: number = 4096, timeoutMs: number = 30000): Promise<string | null> {
  if (GROQ_KEYS.length === 0) return null;

  const maxAttempts = GROQ_KEYS.length * GROQ_MODELS.length;

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
      }
    } catch {
      // Rotate to next key on error
    }
  }

  return null;
}

async function tryPollinations(prompt: string, timeoutMs: number = 30000): Promise<string | null> {
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
    // Rate limit: 30 AI calls per minute per IP
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

    // Validate input
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    if (!prompt || prompt.length > 5000) {
      return NextResponse.json(
        { error: 'Invalid request. Prompt is required (max 5000 characters).' },
        { status: 400 }
      );
    }

    const isReport = body.isReport === true;
    const maxTokens = isReport ? 4096 : 1024;
    const timeoutMs = isReport ? 45000 : 15000;

    // Try Groq first (fast)
    const groqResult = await tryGroq(prompt, maxTokens, timeoutMs);
    if (groqResult) {
      return NextResponse.json({ text: groqResult, source: 'groq' });
    }

    // Fallback to Pollinations (unlimited, slower)
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

/**
 * Simple In-Memory Rate Limiter (For MVP/Demo)
 * Tracks IP addresses and their request counts in a sliding window.
 */

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 Hour
const MAX_REQUESTS = 5;

// Memory store: { [ip: string]: timestamp[] }
const tracker: Record<string, number[]> = {};

export async function checkRateLimit(ip: string): Promise<{ success: boolean; remaining: number }> {
  const now = Date.now();
  
  if (!tracker[ip]) {
    tracker[ip] = [];
  }

  // Filter out expired timestamps
  tracker[ip] = tracker[ip].filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

  if (tracker[ip].length >= MAX_REQUESTS) {
    return { success: false, remaining: 0 };
  }

  // Record new request
  tracker[ip].push(now);
  
  return { 
    success: true, 
    remaining: MAX_REQUESTS - tracker[ip].length 
  };
}

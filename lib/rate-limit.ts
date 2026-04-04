/**
 * Server-Side Rate Limiter
 * Tracks requests per IP (unsigned) or userId (signed-in).
 * Uses a sliding window of 1 hour.
 * 
 * Limits:
 * - Unsigned users: 1 report per hour
 * - Signed-in users: 7 reports per hour
 */

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

// In-memory store: { [key: string]: timestamp[] }
// Key is either IP address or userId
const tracker: Record<string, number[]> = {};

// Cleanup interval to prevent memory leaks (every 15 minutes)
setInterval(() => {
  const now = Date.now();
  for (const key of Object.keys(tracker)) {
    tracker[key] = tracker[key].filter(ts => now - ts < RATE_LIMIT_WINDOW);
    if (tracker[key].length === 0) {
      delete tracker[key];
    }
  }
}, 15 * 60 * 1000);

export async function checkRateLimit(
  key: string,
  maxRequests: number
): Promise<{ success: boolean; remaining: number }> {
  // Validate key is not empty
  if (!key || key.trim().length === 0) {
    return { success: false, remaining: 0 };
  }

  const now = Date.now();

  if (!tracker[key]) {
    tracker[key] = [];
  }

  // Filter out expired timestamps
  tracker[key] = tracker[key].filter(ts => now - ts < RATE_LIMIT_WINDOW);

  if (tracker[key].length >= maxRequests) {
    return { success: false, remaining: 0 };
  }

  // Record new request
  tracker[key].push(now);

  return {
    success: true,
    remaining: maxRequests - tracker[key].length,
  };
}

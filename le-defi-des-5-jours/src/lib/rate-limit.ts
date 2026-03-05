export const MAX_CONVERSATIONS_PER_HOUR = 10;
const WINDOW_MS = 3_600_000; // 1 heure

const requestLog = new Map<string, number[]>();

export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const timestamps = (requestLog.get(ip) || []).filter(t => t > windowStart);

  if (timestamps.length >= MAX_CONVERSATIONS_PER_HOUR) {
    requestLog.set(ip, timestamps);
    return {
      allowed: false,
      remaining: 0,
      resetAt: timestamps[0] + WINDOW_MS,
    };
  }

  timestamps.push(now);
  requestLog.set(ip, timestamps);

  return {
    allowed: true,
    remaining: MAX_CONVERSATIONS_PER_HOUR - timestamps.length,
    resetAt: timestamps[0] + WINDOW_MS,
  };
}

export function getRateLimitHeaders(result: {
  remaining: number;
  resetAt: number;
}): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(MAX_CONVERSATIONS_PER_HOUR),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
  };
}

// In-memory rate limiter using a fixed-window token bucket.
//
// LIMITATION: Each Vercel serverless instance has its own memory, so a
// burst that lands across instances will not be perfectly throttled.
// For current site volume (single-digit RPS) this is acceptable. Move
// to Upstash Redis (or similar) when traffic grows.
//
// Usage:
//   const rl = checkRateLimit(`leads:${ip}`, 5, 60_000);
//   if (!rl.allowed) return NextResponse.json({ error: "..." }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } });

type Bucket = { remaining: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { remaining: limit - 1, resetAt });
    return { allowed: true, remaining: limit - 1, retryAfterSec: 0 };
  }

  if (existing.remaining > 0) {
    existing.remaining -= 1;
    return {
      allowed: true,
      remaining: existing.remaining,
      retryAfterSec: 0,
    };
  }

  return {
    allowed: false,
    remaining: 0,
    retryAfterSec: Math.ceil((existing.resetAt - now) / 1000),
  };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

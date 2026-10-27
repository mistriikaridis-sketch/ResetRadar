type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** 进程内简易限流；Serverless 多实例不共享，仅作 MVP 防刷。 */
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true as const, remaining: limit - 1 };
  }
  if (current.count >= limit) {
    return { ok: false as const, remaining: 0, retryAfterMs: current.resetAt - now };
  }
  current.count += 1;
  return { ok: true as const, remaining: limit - current.count };
}

export function clientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return request.headers.get('x-real-ip') || 'unknown';
}

const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

/**
 * Basic in-memory rate limiter.
 * @param ip IP address or unique identifier of the user
 * @param limit Max number of requests allowed in the window
 * @param windowMs Time window in milliseconds
 * @returns boolean true if allowed, false if rate limited
 */
export function rateLimit(ip: string, limit: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || record.expiresAt < now) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false; // Rate limited
  }

  record.count += 1;
  return true;
}

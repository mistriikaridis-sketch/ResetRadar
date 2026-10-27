import { createHmac, timingSafeEqual } from 'node:crypto';

function secret() {
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || '';
}

function sign(payload: string) {
  const key = secret();
  return key ? createHmac('sha256', key).update(payload).digest('base64url') : '';
}

/** 邮箱管理链接 token，默认 24 小时有效。 */
export function createManageToken(email: string, ttlMs = 24 * 60 * 60 * 1000) {
  const exp = Date.now() + ttlMs;
  const payload = Buffer.from(JSON.stringify({ email: email.toLowerCase(), exp })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function readManageToken(token?: string | null) {
  if (!token || !secret()) return null;
  const [payload, received] = token.split('.');
  const expected = sign(payload || '');
  if (!payload || !received || !expected || received.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(received), Buffer.from(expected))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { email?: string; exp?: number };
    if (!data.email || !data.exp || data.exp < Date.now()) return null;
    return data.email.toLowerCase();
  } catch {
    return null;
  }
}

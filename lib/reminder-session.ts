import { createHmac, timingSafeEqual } from 'node:crypto';

export const REMINDER_SESSION_COOKIE = 'resetradar_reminder';

function sessionSecret() {
  const dedicated = process.env.SESSION_SECRET?.trim();
  if (dedicated) return dedicated;
  const fallback = process.env.ADMIN_PASSWORD?.trim();
  if (fallback && process.env.NODE_ENV === 'production') {
    console.warn('[reminder-session] SESSION_SECRET 未配置，临时回退到 ADMIN_PASSWORD；请尽快拆分独立密钥。');
  }
  return fallback || '';
}

function signature(payload: string) {
  const secret = sessionSecret();
  return secret ? createHmac('sha256', secret).update(payload).digest('base64url') : '';
}

export function createReminderSession(email: string) {
  const payload = Buffer.from(email).toString('base64url');
  return `${payload}.${signature(payload)}`;
}

export function readReminderSession(value?: string) {
  if (!value) return null;
  const [payload, received] = value.split('.');
  const expected = signature(payload || '');
  if (!payload || !received || !expected || received.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(received), Buffer.from(expected))) return null;
  try {
    return Buffer.from(payload, 'base64url').toString('utf8');
  } catch {
    return null;
  }
}

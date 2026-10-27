import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

/** 生产环境使用 __Host- 前缀（要求 Secure + Path=/ + 无 Domain）。 */
function cookieName() {
  return process.env.NODE_ENV === 'production' ? '__Host-resetradar_admin' : 'resetradar_admin';
}

function signature() {
  return createHmac('sha256', process.env.ADMIN_PASSWORD || 'unset').update('resetradar-admin').digest('hex');
}

function same(left: string, right: string) {
  return left.length === right.length && timingSafeEqual(Buffer.from(left), Buffer.from(right));
}

export function validAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected && same(password, expected));
}

export function hasAdminSession() {
  const received = cookies().get(cookieName())?.value;
  return Boolean(received && same(received, signature()));
}

export function adminCookie() {
  return {
    name: cookieName(),
    value: signature(),
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 12,
    },
  };
}

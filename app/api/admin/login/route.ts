import { NextResponse } from 'next/server';
import { adminCookie, validAdminPassword } from '@/lib/auth';
export async function POST(request: Request) { const { password } = await request.json(); if (!validAdminPassword(String(password || ''))) return NextResponse.json({ message: '密码错误。' }, { status: 401 }); const response = NextResponse.json({ ok: true }); const cookie = adminCookie(); response.cookies.set(cookie.name, cookie.value, cookie.options); return response; }

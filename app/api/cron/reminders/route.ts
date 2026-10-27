import { NextResponse } from 'next/server';
import { authorizeCron } from '@/lib/cron-auth';
import { deliverDuePersonalReminders } from '@/lib/personal-reminders';

export async function GET(request: Request) {
  const auth = await authorizeCron(request, '');
  if (!auth.ok) return NextResponse.json({ message: auth.message || '未授权。' }, { status: 401 });
  return NextResponse.json(await deliverDuePersonalReminders());
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const auth = await authorizeCron(request, rawBody);
  if (!auth.ok) return NextResponse.json({ message: auth.message || '未授权。' }, { status: 401 });
  return NextResponse.json(await deliverDuePersonalReminders());
}

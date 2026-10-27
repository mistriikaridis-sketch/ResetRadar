import { NextResponse } from 'next/server';
import { hasAdminSession } from '@/lib/auth';
import { deliverDuePersonalReminders } from '@/lib/personal-reminders';

export async function POST() {
  if (!hasAdminSession()) return NextResponse.json({ message: '未授权。' }, { status: 401 });
  const result = await deliverDuePersonalReminders();
  return NextResponse.json(result);
}

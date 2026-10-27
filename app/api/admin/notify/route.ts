import { NextResponse } from 'next/server';
import { hasAdminSession } from '@/lib/auth';
import { notifySubscribers } from '@/lib/notify';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  if (!hasAdminSession()) return NextResponse.json({ message: '未授权。' }, { status: 401 });
  const { eventId, testUserId, testEmail } = await request.json();
  if (!eventId) return NextResponse.json({ message: '缺少 eventId。' }, { status: 400 });
  const user = testUserId ? { id: String(testUserId) } : testEmail ? await prisma.user.findUnique({ where: { email: String(testEmail).trim().toLowerCase() }, select: { id: true } }) : null;
  if (testEmail && !user) return NextResponse.json({ message: '该测试邮箱尚未登记提醒方式。' }, { status: 404 });
  try {
    const logs = await notifySubscribers(eventId, user?.id);
    return NextResponse.json({ delivered: logs.filter(log => log.status === 'SENT').length, failed: logs.filter(log => log.status === 'FAILED').length, logs });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : '触发失败。' }, { status: 400 });
  }
}

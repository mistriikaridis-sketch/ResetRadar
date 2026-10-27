import { ReminderStatus } from '@prisma/client';
import { NextResponse } from 'next/server';
import { readManageToken } from '@/lib/manage-token';
import { prisma } from '@/lib/prisma';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { cancelReminderBodySchema, zodErrorMessage } from '@/lib/validate';

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    const limited = rateLimit(`cancel-reminder:${ip}`, 40, 60 * 60 * 1000);
    if (!limited.ok) return NextResponse.json({ message: '请求过于频繁，请稍后再试。' }, { status: 429 });

    const parsed = cancelReminderBodySchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ message: zodErrorMessage(parsed.error) }, { status: 400 });

    const email = readManageToken(parsed.data.token);
    if (!email) return NextResponse.json({ message: '管理链接无效或已过期。' }, { status: 401 });

    const reminder = await prisma.personalReminder.findFirst({
      where: { id: parsed.data.id, user: { email } },
    });
    if (!reminder) return NextResponse.json({ message: '未找到该提醒。' }, { status: 404 });
    const cancellable: ReminderStatus[] = [ReminderStatus.PENDING, ReminderStatus.PROCESSING, ReminderStatus.FAILED];
    if (!cancellable.includes(reminder.status)) {
      return NextResponse.json({ message: '该提醒当前状态不可取消。' }, { status: 400 });
    }

    await prisma.personalReminder.update({
      where: { id: reminder.id },
      data: { status: ReminderStatus.CANCELED, error: null },
    });

    return NextResponse.json({ ok: true, message: '已取消提醒。' });
  } catch {
    return NextResponse.json({ message: '取消失败。' }, { status: 400 });
  }
}

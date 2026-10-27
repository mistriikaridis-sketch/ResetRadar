import { ChannelType, EventModel, Plan, ReminderStatus } from '@prisma/client';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { createReminderSession, REMINDER_SESSION_COOKIE } from '@/lib/reminder-session';
import { personalReminderBodySchema, zodErrorMessage } from '@/lib/validate';

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    const limited = rateLimit(`reminder:${ip}`, 30, 60 * 60 * 1000);
    if (!limited.ok) return NextResponse.json({ message: '请求过于频繁，请稍后再试。' }, { status: 429 });

    const parsed = personalReminderBodySchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ message: zodErrorMessage(parsed.error) }, { status: 400 });

    const email = parsed.data.email;
    const model = parsed.data.model;
    const expectedAt = new Date(parsed.data.expectedAt);
    const advanceMinutes = parsed.data.advanceMinutes;

    const emailLimited = rateLimit(`reminder-email:${email}`, 15, 60 * 60 * 1000);
    if (!emailLimited.ok) return NextResponse.json({ message: '该邮箱创建提醒过于频繁。' }, { status: 429 });

    if (Number.isNaN(expectedAt.getTime()) || expectedAt <= new Date()) {
      return NextResponse.json({ message: '请选择未来的预计恢复时间。' }, { status: 400 });
    }

    const remindAt = new Date(expectedAt.getTime() - advanceMinutes * 60_000);
    if (remindAt <= new Date()) {
      return NextResponse.json({ message: '提醒时间必须晚于现在；请减少提前量或选择更晚的预计时间。' }, { status: 400 });
    }

    const user = await prisma.user.upsert({ where: { email }, create: { email }, update: {} });
    const activeCount = await prisma.personalReminder.count({
      where: { userId: user.id, status: { in: [ReminderStatus.PENDING, ReminderStatus.PROCESSING] } },
    });
    if (user.plan === Plan.FREE && activeCount >= 1) {
      return NextResponse.json({ message: '免费版一次只能保留 1 个个人提醒；该提醒发送后可再创建新的。' }, { status: 400 });
    }

    await prisma.notificationChannel.upsert({
      where: { userId_type_value: { userId: user.id, type: ChannelType.EMAIL, value: email } },
      create: { userId: user.id, type: ChannelType.EMAIL, value: email },
      update: { enabled: true },
    });

    const reminder = await prisma.personalReminder.create({
      data: {
        userId: user.id,
        model: model as EventModel,
        expectedAt,
        remindAt,
        advanceMinutes,
      },
    });

    const response = NextResponse.json(
      {
        id: reminder.id,
        message: advanceMinutes
          ? `已保存，会在预计时间前 ${advanceMinutes} 分钟提醒。`
          : '已保存，会在预计时间提醒。',
      },
      { status: 201 },
    );
    response.cookies.set({
      name: REMINDER_SESSION_COOKIE,
      value: createReminderSession(email),
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
    return response;
  } catch {
    return NextResponse.json({ message: '保存提醒失败，请稍后再试。' }, { status: 400 });
  }
}

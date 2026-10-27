import { ChannelType } from '@prisma/client';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { subscribeBodySchema, zodErrorMessage } from '@/lib/validate';

function isSafeWecom(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname.toLowerCase() === 'qyapi.weixin.qq.com';
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    const limited = rateLimit(`subscribe:${ip}`, 20, 60 * 60 * 1000);
    if (!limited.ok) return NextResponse.json({ message: '请求过于频繁，请稍后再试。' }, { status: 429 });

    const parsed = subscribeBodySchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ message: zodErrorMessage(parsed.error) }, { status: 400 });

    const email = parsed.data.email;
    const telegramChatId = parsed.data.telegramChatId?.trim() || '';
    const barkKey = parsed.data.barkKey?.trim() || '';
    const wecomWebhook = parsed.data.wecomWebhook?.trim() || '';

    if (wecomWebhook && !isSafeWecom(wecomWebhook)) {
      return NextResponse.json({ message: '企微 Webhook 仅支持 https://qyapi.weixin.qq.com/...' }, { status: 400 });
    }

    const emailLimited = rateLimit(`subscribe-email:${email}`, 10, 60 * 60 * 1000);
    if (!emailLimited.ok) return NextResponse.json({ message: '该邮箱操作过于频繁。' }, { status: 429 });

    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        telegramChatId: telegramChatId || null,
        barkKey: barkKey || null,
        wecomWebhook: wecomWebhook || null,
      },
      update: {
        ...(telegramChatId ? { telegramChatId } : {}),
        ...(barkKey ? { barkKey } : {}),
        ...(wecomWebhook ? { wecomWebhook } : {}),
      },
    });

    await prisma.notificationChannel.upsert({
      where: { userId_type_value: { userId: user.id, type: ChannelType.EMAIL, value: email } },
      create: { userId: user.id, type: ChannelType.EMAIL, value: email },
      update: { enabled: true },
    });

    if (telegramChatId) {
      await prisma.notificationChannel.upsert({
        where: { userId_type_value: { userId: user.id, type: ChannelType.TELEGRAM, value: telegramChatId } },
        create: { userId: user.id, type: ChannelType.TELEGRAM, value: telegramChatId },
        update: { enabled: true },
      });
    }
    if (barkKey) {
      await prisma.notificationChannel.upsert({
        where: { userId_type_value: { userId: user.id, type: ChannelType.BARK, value: barkKey } },
        create: { userId: user.id, type: ChannelType.BARK, value: barkKey },
        update: { enabled: true },
      });
    }
    if (wecomWebhook) {
      await prisma.notificationChannel.upsert({
        where: { userId_type_value: { userId: user.id, type: ChannelType.WECOM, value: wecomWebhook } },
        create: { userId: user.id, type: ChannelType.WECOM, value: wecomWebhook },
        update: { enabled: true },
      });
    }

    return NextResponse.json({
      ok: true,
      message:
        '已登记。邮箱可用于个人到点提醒；Telegram / Bark / 企微通道在升级 Pro 后，才会收到管理员核验事件的即时通知。',
    });
  } catch {
    return NextResponse.json({ message: '登记失败，请稍后再试。' }, { status: 400 });
  }
}

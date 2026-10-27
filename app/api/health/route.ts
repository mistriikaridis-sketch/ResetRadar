import { NextResponse } from 'next/server';
import { ReminderStatus } from '@prisma/client';
import { META_LAST_CRON_AT, getAppMeta } from '@/lib/app-meta';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const [lastCronAt, pendingReminders] = await Promise.all([
      getAppMeta(META_LAST_CRON_AT),
      prisma.personalReminder.count({ where: { status: ReminderStatus.PENDING } }).catch(() => -1),
    ]);
    return NextResponse.json({
      ok: true,
      database: 'connected',
      lastCronAt,
      pendingReminders,
      resendConfigured: Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL),
      cronSecretConfigured: Boolean(process.env.CRON_SECRET?.trim()),
      qstashConfigured: Boolean(
        process.env.QSTASH_CURRENT_SIGNING_KEY?.trim() && process.env.QSTASH_NEXT_SIGNING_KEY?.trim(),
      ),
      stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID),
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        database: 'unavailable',
        lastCronAt: null,
        pendingReminders: null,
        resendConfigured: Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL),
        cronSecretConfigured: Boolean(process.env.CRON_SECRET?.trim()),
        qstashConfigured: Boolean(
          process.env.QSTASH_CURRENT_SIGNING_KEY?.trim() && process.env.QSTASH_NEXT_SIGNING_KEY?.trim(),
        ),
        stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID),
      },
      { status: 503 },
    );
  }
}

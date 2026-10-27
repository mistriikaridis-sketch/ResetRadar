import { EventModel, ReminderStatus } from '@prisma/client';
import { Resend } from 'resend';
import { META_LAST_CRON_AT, setAppMeta } from './app-meta';
import { MODEL_LABEL } from './labels';
import { escapeHtml } from './html';
import { prisma } from './prisma';

const STALE_PROCESSING_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 3;

export function readableReminderError(error: string) {
  if (error.includes('only send testing emails to your own email address')) {
    return 'Resend 测试模式只能发给 Resend 账户自己的邮箱；要发给其他邮箱，请先验证自己的发信域名。';
  }
  if (error.includes('API key is invalid')) return 'Resend 密钥无效，请在 Resend 后台新建一把 Sending access 钥匙。';
  if (error.includes('domain')) return '发件地址的域名尚未在 Resend 验证。';
  return error;
}

function reminderEmail(model: string, expected: string) {
  const text = `你好，\n\n这是你设置的个人提醒：${model} 的预计恢复时间已到（${expected}）。\n\n请打开你的账户页面核实实际状态；不同账户的额度恢复时间可能不同。\n\n你收到这封邮件，是因为你主动在 ResetRadar 设置了个人提醒。ResetRadar 是独立的非官方工具。`;
  const html = `<!doctype html><html lang="zh-CN"><body style="margin:0;background:#f6f4ef;color:#24231f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Microsoft YaHei',sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td style="padding:32px 16px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:#fffdf9;border:1px solid #ded9cf"><tr><td style="padding:32px"><p style="margin:0;color:#b26018;font:12px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em">RESET RADAR · PERSONAL REMINDER</p><h1 style="margin:18px 0 8px;font-size:28px;line-height:1.25">预计恢复时间已到</h1><p style="margin:0;color:#5f5b53;font-size:16px;line-height:1.7">你设置的 <strong>${escapeHtml(model)}</strong> 提醒时间是：<br><strong style="color:#386b51">${escapeHtml(expected)}</strong></p><div style="margin-top:24px;padding:18px;background:#f6f4ef;border-left:3px solid #b26018;font-size:16px;line-height:1.7">请打开你的账户页面核实实际状态；不同账户的额度恢复时间可能不同。</div><hr style="margin:32px 0 18px;border:0;border-top:1px solid #ded9cf"><p style="margin:0;color:#777168;font-size:12px;line-height:1.7">你收到这封邮件，是因为你主动在 ResetRadar 设置了个人提醒。ResetRadar 为独立的非官方工具。</p></td></tr></table></td></tr></table></body></html>`;
  return { text, html };
}

async function reclaimStaleProcessing(now: Date) {
  const staleBefore = new Date(now.getTime() - STALE_PROCESSING_MS);

  await prisma.personalReminder.updateMany({
    where: {
      status: ReminderStatus.PROCESSING,
      updatedAt: { lt: staleBefore },
      attempts: { gte: MAX_ATTEMPTS },
    },
    data: {
      status: ReminderStatus.FAILED,
      error: `发送中断超过 ${STALE_PROCESSING_MS / 60000} 分钟且已达最大重试次数`,
    },
  });

  await prisma.personalReminder.updateMany({
    where: {
      status: ReminderStatus.PROCESSING,
      updatedAt: { lt: staleBefore },
      attempts: { lt: MAX_ATTEMPTS },
    },
    data: {
      status: ReminderStatus.PENDING,
      error: '上次发送中断，已重新排队',
    },
  });
}

export async function deliverDuePersonalReminders(now = new Date()) {
  await reclaimStaleProcessing(now);

  const reminders = await prisma.personalReminder.findMany({
    where: { status: ReminderStatus.PENDING, remindAt: { lte: now } },
    include: { user: { select: { email: true } } },
    orderBy: { remindAt: 'asc' },
    take: 100,
  });

  let delivered = 0;
  let failed = 0;
  let requeued = 0;

  for (const reminder of reminders) {
    const claimed = await prisma.personalReminder.updateMany({
      where: { id: reminder.id, status: ReminderStatus.PENDING },
      data: { status: ReminderStatus.PROCESSING, error: null },
    });
    if (!claimed.count) continue;

    try {
      if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) throw new Error('邮件服务尚未配置');
      const expected = new Intl.DateTimeFormat('zh-CN', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Shanghai',
      }).format(reminder.expectedAt);
      const model = MODEL_LABEL[reminder.model as EventModel];
      const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: reminder.user.email,
        subject: `ResetRadar 个人提醒：${model} 预计恢复时间已到`,
        ...reminderEmail(model, expected),
      });
      if (error) throw new Error(error.message);
      await prisma.personalReminder.update({
        where: { id: reminder.id },
        data: { status: ReminderStatus.SENT, sentAt: new Date(), error: null },
      });
      delivered += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : '发送失败';
      const attempts = reminder.attempts + 1;
      if (attempts >= MAX_ATTEMPTS) {
        await prisma.personalReminder.update({
          where: { id: reminder.id },
          data: { status: ReminderStatus.FAILED, attempts, error: message },
        });
        failed += 1;
      } else {
        await prisma.personalReminder.update({
          where: { id: reminder.id },
          data: { status: ReminderStatus.PENDING, attempts, error: message },
        });
        requeued += 1;
      }
    }
  }

  try {
    await setAppMeta(META_LAST_CRON_AT, now.toISOString());
  } catch {
    // 元数据写入失败不影响发信结果
  }

  return { scanned: reminders.length, delivered, failed, requeued };
}

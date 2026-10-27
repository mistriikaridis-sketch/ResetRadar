import { ChannelType, NotificationStatus, Plan, type ResetEvent, type User } from '@prisma/client';
import { Resend } from 'resend';
import { MODEL_LABEL } from './labels';
import { escapeHtml } from './html';
import { prisma } from './prisma';

type Target = User & { channels: { type: ChannelType; value: string; enabled: boolean }[] };

const STATUS_LABEL: Record<ResetEvent['status'], string> = {
  WATCHING: '正在监控',
  EXPECTED: '预计发生',
  ANNOUNCED: '已发布公告',
  CONFIRMED: '已确认',
  RESOLVED: '已恢复',
};

const WECOM_HOST_ALLOWLIST = new Set(['qyapi.weixin.qq.com']);

function assertSafeWecomWebhook(value: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error('企微 Webhook 不是合法 URL');
  }
  if (url.protocol !== 'https:') throw new Error('企微 Webhook 仅允许 https');
  if (!WECOM_HOST_ALLOWLIST.has(url.hostname.toLowerCase())) {
    throw new Error('企微 Webhook 域名不在白名单（仅允许 qyapi.weixin.qq.com）');
  }
  return url.toString();
}

function emailContent(event: ResetEvent) {
  const model = MODEL_LABEL[event.model];
  const status = STATUS_LABEL[event.status];
  const note = event.note || '管理员正在持续核验这条事件。';
  const source = event.sourceUrl && /^https?:\/\//i.test(event.sourceUrl) ? event.sourceUrl : null;
  const text = `你好，\n\nResetRadar 提醒：${model} 当前状态为“${status}”。\n\n${note}${source ? `\n\n核验来源：${source}` : ''}\n\n你收到这封邮件，是因为你主动在 ResetRadar 登记了提醒。ResetRadar 是独立的非官方工具；个人额度请始终以你的账户页面为准。`;
  const sourceHtml = source
    ? `<p style="margin:20px 0 0"><a href="${escapeHtml(source)}" style="color:#386b51;text-decoration:underline">查看核验来源</a></p>`
    : '';
  const html = `<!doctype html><html lang="zh-CN"><body style="margin:0;background:#f6f4ef;color:#24231f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Microsoft YaHei',sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td style="padding:32px 16px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:#fffdf9;border:1px solid #ded9cf"><tr><td style="padding:32px"><p style="margin:0;color:#b26018;font:12px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em">RESET RADAR · EVENT UPDATE</p><h1 style="margin:18px 0 8px;font-size:28px;line-height:1.25">${escapeHtml(model)} 状态更新</h1><p style="margin:0;color:#5f5b53;font-size:16px;line-height:1.6">当前状态：<strong style="color:#386b51">${escapeHtml(status)}</strong></p><div style="margin-top:24px;padding:18px;background:#f6f4ef;border-left:3px solid #b26018;font-size:16px;line-height:1.7">${escapeHtml(note)}</div>${sourceHtml}<hr style="margin:32px 0 18px;border:0;border-top:1px solid #ded9cf"><p style="margin:0;color:#777168;font-size:12px;line-height:1.7">你收到这封邮件，是因为你主动在 ResetRadar 登记了提醒。ResetRadar 为独立的非官方工具；个人额度请始终以你的账户页面为准。</p></td></tr></table></td></tr></table></body></html>`;
  return { text, html, subject: `ResetRadar 提醒｜${model} ${status}` };
}

const message = (event: ResetEvent) =>
  `【ResetRadar】${MODEL_LABEL[event.model]}：${STATUS_LABEL[event.status]}。${event.note || '请查看事件详情。'} ${event.sourceUrl || ''}`;

async function send(channel: ChannelType, value: string, event: ResetEvent) {
  const text = message(event);
  if (channel === 'EMAIL') {
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) throw new Error('邮件服务尚未配置');
    const email = emailContent(event);
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: value,
      ...email,
    });
    if (error) throw new Error(`邮件发送失败：${error.message}`);
  }
  if (channel === 'TELEGRAM') {
    if (!process.env.TELEGRAM_BOT_TOKEN) throw new Error('Telegram Bot 尚未配置');
    const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: value, text }),
    });
    if (!response.ok) throw new Error(`Telegram 返回 ${response.status}`);
  }
  if (channel === 'BARK') {
    const response = await fetch(
      `https://api.day.app/${encodeURIComponent(value)}/${encodeURIComponent('ResetRadar 提醒')}/${encodeURIComponent(text)}`,
    );
    if (!response.ok) throw new Error(`Bark 返回 ${response.status}`);
  }
  if (channel === 'WECOM') {
    const safeUrl = assertSafeWecomWebhook(value);
    const response = await fetch(safeUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ msgtype: 'text', text: { content: text } }),
    });
    if (!response.ok) throw new Error(`企微返回 ${response.status}`);
  }
  if (!['EMAIL', 'TELEGRAM', 'BARK', 'WECOM'].includes(channel)) throw new Error('该通知通道尚未在 MVP 开放');
}

export async function notifySubscribers(eventId: string, testUserId?: string) {
  const event = await prisma.resetEvent.findUniqueOrThrow({ where: { id: eventId } });
  const users: Target[] = await prisma.user.findMany({
    where: testUserId ? { id: testUserId } : { plan: { in: [Plan.PRO, Plan.TEAM] } },
    include: { channels: { where: { enabled: true } } },
  });
  const results = [];
  for (const user of users) {
    for (const target of user.channels) {
      const log = await prisma.notificationLog.create({
        data: { userId: user.id, eventId, channel: target.type, status: NotificationStatus.QUEUED },
      });
      try {
        await send(target.type, target.value, event);
        results.push(await prisma.notificationLog.update({ where: { id: log.id }, data: { status: NotificationStatus.SENT, sentAt: new Date() } }));
      } catch (error) {
        results.push(
          await prisma.notificationLog.update({
            where: { id: log.id },
            data: { status: NotificationStatus.FAILED, error: error instanceof Error ? error.message : '未知错误' },
          }),
        );
      }
    }
  }
  return results;
}

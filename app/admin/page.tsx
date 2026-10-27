import { redirect } from 'next/navigation';
import { hasAdminSession } from '@/lib/auth';
import { listRecentEvents, MODEL_LABEL } from '@/lib/events';
import { AdminPanel } from '@/components/admin-panel';
import { prisma } from '@/lib/prisma';
import { readableReminderError } from '@/lib/personal-reminders';
export const metadata = { title: '管理后台' };

function maskEmail(email: string) {
  const [name, domain] = email.split('@');
  if (!domain) return '已登记邮箱';
  return `${name.slice(0, 2)}***@${domain}`;
}

export default async function AdminPage() {
  if (!hasAdminSession()) redirect('/login');
  const [events, logs, personalReminders] = await Promise.all([
    listRecentEvents(),
    prisma.notificationLog.findMany({ orderBy: { sentAt: 'desc' }, take: 20, include: { user: { select: { email: true } }, event: { select: { model: true } } } }).catch(() => []),
    prisma.personalReminder.findMany({ orderBy: { createdAt: 'desc' }, take: 20, include: { user: { select: { email: true } } } }).catch(() => []),
  ]);

  return <main className="mx-auto max-w-6xl px-5 py-12">
    <p className="font-mono text-xs text-signal">ADMIN CONSOLE</p>
    <h1 className="mt-3 text-4xl font-bold">手动核验，再发提醒。</h1>
    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">发布前检查公告、来源链接和置信度。一次错误推送，会把信任砸得稀碎。</p>
    <div className="mt-10"><AdminPanel events={events.map(event => ({ ...event, expectedAt: event.expectedAt?.toISOString() || null }))} /></div>

    <section className="mt-12">
      <h2 className="text-xl font-bold">个人提醒记录</h2>
      <p className="mt-1 text-sm text-slate-500">用户邮箱已打码；失败原因会保留，方便排查。</p>
      <div className="mt-4 divide-y divide-slate-800 border-y border-slate-800 text-sm">
        {personalReminders.length ? personalReminders.map(reminder => <div key={reminder.id} className="flex flex-wrap justify-between gap-3 py-3"><span>{MODEL_LABEL[reminder.model]} → {maskEmail(reminder.user.email)}</span><span className={reminder.status === 'SENT' ? 'text-signal' : reminder.status === 'FAILED' ? 'text-amber' : 'text-slate-500'}>{reminder.status}{reminder.error ? `：${readableReminderError(reminder.error)}` : ''}</span></div>) : <p className="py-5 text-slate-500">尚无个人提醒记录。</p>}
      </div>
    </section>

    <section className="mt-12">
      <h2 className="text-xl font-bold">事件通知日志</h2>
      <div className="mt-4 divide-y divide-slate-800 border-y border-slate-800 text-sm">
        {logs.length ? logs.map(log => <div key={log.id} className="flex justify-between gap-4 py-3"><span>{log.event.model} → {maskEmail(log.user.email)}</span><span className={log.status === 'SENT' ? 'text-signal' : 'text-amber'}>{log.channel} · {log.status}{log.error ? `：${log.error}` : ''}</span></div>) : <p className="py-5 text-slate-500">尚无事件通知日志。</p>}
      </div>
    </section>
  </main>;
}

import { EventTable } from '@/components/event-table';
import { listRecentEvents, MODEL_LABEL } from '@/lib/events';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { readReminderSession, REMINDER_SESSION_COOKIE } from '@/lib/reminder-session';
import { getRequestDictionary, getRequestLocale } from '@/lib/i18n/server';

export const metadata = { title: '重置历史 / History' };

export default async function HistoryPage() {
  const dict = getRequestDictionary();
  const locale = getRequestLocale();
  const dateLocale = locale === 'en' ? 'en-US' : 'zh-CN';
  const email = readReminderSession(cookies().get(REMINDER_SESSION_COOKIE)?.value);
  const [events, reminders] = await Promise.all([
    listRecentEvents(),
    email
      ? prisma.personalReminder
          .findMany({
            where: { user: { email } },
            orderBy: { createdAt: 'desc' },
            take: 100,
            select: {
              model: true,
              expectedAt: true,
              remindAt: true,
              status: true,
              sentAt: true,
              createdAt: true,
            },
          })
          .catch(() => [])
      : [],
  ]);

  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <p className="font-mono text-xs text-amber">EVENT LEDGER</p>
      <h1 className="mt-4 text-4xl font-bold">{dict.history.title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{dict.history.intro}</p>
      <section className="mt-9 rounded-lg border border-line bg-panel p-5">
        <h2 className="text-xl font-bold text-mist">{dict.history.myReminders}</h2>
        {reminders.length ? (
          <div className="mt-4 divide-y divide-line">
            {reminders.map((item, index) => (
              <div
                key={`${item.createdAt.toISOString()}-${index}`}
                className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"
              >
                <span>
                  {MODEL_LABEL[item.model]} · {dict.history.expected}{' '}
                  {item.expectedAt.toLocaleString(dateLocale)}
                </span>
                <span
                  className={
                    item.status === 'SENT'
                      ? 'text-signal'
                      : item.status === 'FAILED'
                        ? 'text-amber'
                        : 'text-slate-500'
                  }
                >
                  {item.status === 'PENDING'
                    ? dict.history.statusPending
                    : item.status === 'SENT'
                      ? `${dict.history.statusSent} ${item.sentAt?.toLocaleString(dateLocale) || ''}`
                      : item.status === 'FAILED'
                        ? dict.history.statusFailed
                        : item.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">{dict.history.emptyReminders}</p>
        )}
      </section>
      <div className="mt-12">
        <h2 className="text-xl font-bold text-mist">{dict.history.publicEvents}</h2>
        <div className="mt-4">
          <EventTable events={events} />
        </div>
      </div>
    </main>
  );
}

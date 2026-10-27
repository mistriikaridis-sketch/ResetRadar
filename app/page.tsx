import Link from 'next/link';
import { latestByModel } from '@/lib/events';
import { CountdownCard } from '@/components/countdown-card';
import { PersonalReminderForm } from '@/components/personal-reminder-form';
import { Button } from '@/components/ui/button';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { readReminderSession, REMINDER_SESSION_COOKIE } from '@/lib/reminder-session';
import { getRequestDictionary } from '@/lib/i18n/server';

export default async function Home() {
  const dict = getRequestDictionary();
  const email = readReminderSession(cookies().get(REMINDER_SESSION_COOKIE)?.value);
  const [models, reminders] = await Promise.all([
    latestByModel(),
    email
      ? prisma.personalReminder
          .findMany({
            where: { user: { email } },
            orderBy: { createdAt: 'desc' },
            take: 100,
            select: { model: true, expectedAt: true, status: true },
          })
          .catch(() => [])
      : [],
  ]);
  const personalReminders = reminders.map((item) => ({
    model: item.model,
    expectedAt: item.expectedAt.toISOString(),
    status: item.status,
  }));

  return (
    <main>
      <section className="grid-noise border-b border-slate-800">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-24">
          <p className="font-mono text-xs text-signal">{dict.home.kicker}</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-mist md:text-6xl">
            {dict.home.title}
          </h1>
          <p className="mt-4 text-xl font-semibold tracking-tight text-signal md:text-2xl">
            {dict.home.subtitle}
          </p>
          <div className="mt-8">
            <Button asChild>
              <Link href="#personal-reminder">{dict.home.cta}</Link>
            </Button>
          </div>
        </div>
      </section>
      <section id="personal-reminder" className="mx-auto max-w-6xl px-5 py-12">
        <PersonalReminderForm reminders={personalReminders} />
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="font-mono text-xs text-amber">{dict.home.boardKicker}</p>
            <h2 className="mt-2 text-2xl font-bold">{dict.home.boardTitle}</h2>
          </div>
          <Link href="/history" className="text-sm text-signal underline underline-offset-4">
            {dict.home.allHistory}
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {models.map(({ model, event }) => (
            <CountdownCard key={model} model={model} event={event} />
          ))}
        </div>
        <div className="mt-10 grid gap-4 border-t border-slate-800 pt-8 md:grid-cols-3">
          {dict.home.bullets.map((item) => (
            <p key={item} className="text-sm text-slate-400">
              {item}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}

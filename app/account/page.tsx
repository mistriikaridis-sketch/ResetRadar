import Link from 'next/link';
import { ManageLinkForm, ReminderManager } from '@/components/manage-reminders';
import { SubscribeForm } from '@/components/subscribe-form';
import { readManageToken } from '@/lib/manage-token';
import { prisma } from '@/lib/prisma';
import { getRequestDictionary } from '@/lib/i18n/server';

export const metadata = { title: '账户 / Account' };

export default async function AccountPage({
  searchParams,
}: {
  searchParams: { checkout?: string; token?: string };
}) {
  const dict = getRequestDictionary();
  const token = searchParams.token || '';
  const email = token ? readManageToken(token) : null;
  const reminders = email
    ? await prisma.personalReminder
        .findMany({
          where: { user: { email } },
          orderBy: { createdAt: 'desc' },
          take: 50,
          select: {
            id: true,
            model: true,
            expectedAt: true,
            remindAt: true,
            status: true,
            advanceMinutes: true,
          },
        })
        .catch(() => [])
    : [];

  return (
    <main className="mx-auto max-w-2xl space-y-8 px-5 py-16">
      <div>
        <p className="font-mono text-xs text-signal">ACCOUNT</p>
        <h1 className="mt-4 text-4xl font-bold">
          {searchParams.checkout === 'success' ? dict.account.titleSuccess : dict.account.titleDefault}
        </h1>
        <p className="mt-5 leading-7 text-slate-400">
          {searchParams.checkout === 'success' ? dict.account.bodySuccess : dict.account.bodyDefault}
        </p>
        <Link href="/pricing" className="mt-4 inline-block text-signal underline underline-offset-4">
          {dict.account.backPricing}
        </Link>
      </div>

      <SubscribeForm />
      <ManageLinkForm />

      {token && !email && (
        <p className="rounded-md border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-amber">
          {dict.account.invalidLink}
        </p>
      )}

      {email && (
        <ReminderManager
          token={token}
          reminders={reminders.map((item) => ({
            ...item,
            expectedAt: item.expectedAt.toISOString(),
            remindAt: item.remindAt.toISOString(),
          }))}
        />
      )}
    </main>
  );
}

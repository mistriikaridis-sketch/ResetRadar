import Link from 'next/link';
import { ManageLinkForm, ReminderManager } from '@/components/manage-reminders';
import { SubscribeForm } from '@/components/subscribe-form';
import { readManageToken } from '@/lib/manage-token';
import { prisma } from '@/lib/prisma';

export const metadata = { title: '我的订阅' };

export default async function AccountPage({
  searchParams,
}: {
  searchParams: { checkout?: string; token?: string };
}) {
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
          {searchParams.checkout === 'success' ? '订阅已提交。' : '管理订阅与提醒方式。'}
        </h1>
        <p className="mt-5 leading-7 text-slate-400">
          {searchParams.checkout === 'success'
            ? 'Stripe Webhook 成功处理后，邮箱对应用户将切换为 Pro。可在下方登记通知通道，或生成管理链接查看个人提醒。'
            : '无需登录即可：登记通知通道，或用邮箱生成带签名的管理链接查看 / 取消个人提醒（MVP；正式环境可改为 magic link 邮件）。'}
        </p>
        <Link href="/pricing" className="mt-4 inline-block text-signal underline underline-offset-4">
          返回定价页
        </Link>
      </div>

      <SubscribeForm />
      <ManageLinkForm />

      {token && !email && (
        <p className="rounded-md border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-amber">
          管理链接无效或已过期，请重新生成。
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

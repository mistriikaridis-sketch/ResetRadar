import Link from 'next/link';
import { CheckoutButton } from '@/components/checkout-button';

export const metadata = { title: '定价' };

export default function PricingPage({ searchParams }: { searchParams?: { checkout?: string } }) {
  const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID);
  return (
    <main className="mx-auto max-w-4xl px-5 py-14">
      <p className="font-mono text-xs text-signal">PRICING</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight">只保留两种选择。</h1>
      {searchParams?.checkout === 'cancel' && (
        <p className="mt-4 rounded-md border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-amber">已取消支付，可随时再试。</p>
      )}
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <section className="rounded-lg border border-slate-700 bg-panel p-6">
          <p className="font-mono text-xs text-slate-400">免费</p>
          <h2 className="mt-4 text-3xl font-bold">¥0</h2>
          <ul className="mt-6 space-y-3 text-sm text-slate-400">
            <li>查看状态与历史</li>
            <li>设置个人到点邮件提醒（同时仅 1 条）</li>
          </ul>
          <Link href="/#personal-reminder" className="mt-8 block text-sm text-signal underline underline-offset-4">
            设置提醒
          </Link>
        </section>
        <section className="rounded-lg border border-signal bg-panel p-6">
          <p className="font-mono text-xs text-signal">Radar Pro</p>
          <h2 className="mt-4 text-3xl font-bold">
            ¥19.9 <span className="text-sm font-normal text-slate-400">/ 30 天</span>
          </h2>
          <ul className="mt-6 space-y-3 text-sm text-slate-300">
            <li>管理员核验事件的即时邮件 / Telegram / Bark 通知</li>
            <li>个人提醒额度更高（与免费版并存）</li>
          </ul>
          <div className="mt-8 border-t border-slate-700 pt-4">
            <CheckoutButton stripeConfigured={stripeConfigured} />
            <p className="mt-3 text-xs leading-5 text-slate-500">
              站内标价为 ¥19.9 / 30 天；实际扣款金额以 Stripe 后台 `STRIPE_PRICE_ID` 对应价格为准。请先在首页或账户页登记同一邮箱。
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

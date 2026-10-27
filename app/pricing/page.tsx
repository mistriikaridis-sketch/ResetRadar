import Link from 'next/link';
import { CheckoutButton } from '@/components/checkout-button';
import { getRequestDictionary } from '@/lib/i18n/server';

export const metadata = { title: '定价 / Pricing' };

export default function PricingPage({ searchParams }: { searchParams?: { checkout?: string } }) {
  const dict = getRequestDictionary();
  const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID);
  return (
    <main className="mx-auto max-w-4xl px-5 py-14">
      <p className="font-mono text-xs text-signal">PRICING</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight">{dict.pricing.title}</h1>
      {searchParams?.checkout === 'cancel' && (
        <p className="mt-4 rounded-md border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-amber">
          {dict.pricing.cancelNotice}
        </p>
      )}
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <section className="rounded-lg border border-slate-700 bg-panel p-6">
          <p className="font-mono text-xs text-slate-400">{dict.pricing.free}</p>
          <h2 className="mt-4 text-3xl font-bold">¥0</h2>
          <ul className="mt-6 space-y-3 text-sm text-slate-400">
            <li>{dict.pricing.freeF1}</li>
            <li>{dict.pricing.freeF2}</li>
          </ul>
          <Link href="/#personal-reminder" className="mt-8 block text-sm text-signal underline underline-offset-4">
            {dict.pricing.setReminder}
          </Link>
        </section>
        <section className="rounded-lg border border-signal bg-panel p-6">
          <p className="font-mono text-xs text-signal">Radar Pro</p>
          <h2 className="mt-4 text-3xl font-bold">
            ¥19.9 <span className="text-sm font-normal text-slate-400">{dict.pricing.perDays}</span>
          </h2>
          <ul className="mt-6 space-y-3 text-sm text-slate-300">
            <li>{dict.pricing.proF1}</li>
            <li>{dict.pricing.proF2}</li>
          </ul>
          <div className="mt-8 border-t border-slate-700 pt-4">
            <CheckoutButton stripeConfigured={stripeConfigured} />
            <p className="mt-3 text-xs leading-5 text-slate-500">{dict.pricing.priceNote}</p>
          </div>
        </section>
      </div>
    </main>
  );
}

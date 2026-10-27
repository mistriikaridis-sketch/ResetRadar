import Link from 'next/link';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { getRequestDictionary } from '@/lib/i18n/server';

export function SiteHeader() {
  const dict = getRequestDictionary();
  return (
    <header className="border-b border-stone-200 bg-ink/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="text-sm font-semibold tracking-tight text-mist">
          <span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full border border-signal text-[11px] text-signal">
            R
          </span>
          ResetRadar
        </Link>
        <nav className="flex items-center gap-3 text-sm text-stone-500 sm:gap-4">
          <Link href="/history">{dict.nav.history}</Link>
          <Link href="/rules">{dict.nav.rules}</Link>
          <Link href="/pricing">{dict.nav.pricing}</Link>
          <Link href="/account">{dict.nav.account}</Link>
          <Link href="/admin" className="text-signal">
            {dict.nav.admin}
          </Link>
          <LocaleSwitcher />
        </nav>
      </div>
    </header>
  );
}

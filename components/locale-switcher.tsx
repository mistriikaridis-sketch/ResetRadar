'use client';

import { useLocale } from '@/components/locale-provider';
import type { Locale } from '@/lib/i18n/config';

export function LocaleSwitcher() {
  const { locale, setLocale, dict } = useLocale();

  function pick(next: Locale) {
    setLocale(next);
  }

  return (
    <div
      className="inline-flex items-center rounded-full border border-slate-700 p-0.5 text-xs"
      role="group"
      aria-label={dict.locale.label}
    >
      <button
        type="button"
        onClick={() => pick('zh')}
        className={`rounded-full px-2.5 py-1 transition ${
          locale === 'zh' ? 'bg-signal/20 text-signal' : 'text-stone-500 hover:text-mist'
        }`}
        aria-pressed={locale === 'zh'}
      >
        {dict.locale.switchToZh}
      </button>
      <button
        type="button"
        onClick={() => pick('en')}
        className={`rounded-full px-2.5 py-1 transition ${
          locale === 'en' ? 'bg-signal/20 text-signal' : 'text-stone-500 hover:text-mist'
        }`}
        aria-pressed={locale === 'en'}
      >
        {dict.locale.switchToEn}
      </button>
    </div>
  );
}

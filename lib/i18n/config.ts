export const LOCALES = ['zh', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'zh';
export const LOCALE_COOKIE = 'rr_locale';
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function isLocale(value: string | undefined | null): value is Locale {
  return value === 'zh' || value === 'en';
}

/** Prefer cookie, else Accept-Language, else zh. */
export function detectLocale(cookieValue?: string | null, acceptLanguage?: string | null): Locale {
  if (isLocale(cookieValue)) return cookieValue;
  const header = (acceptLanguage || '').toLowerCase();
  if (header.includes('zh')) return 'zh';
  if (header.includes('en')) return 'en';
  return DEFAULT_LOCALE;
}

export function localeToHtmlLang(locale: Locale): string {
  return locale === 'en' ? 'en' : 'zh-CN';
}

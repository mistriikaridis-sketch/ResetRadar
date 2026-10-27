import { cookies, headers } from 'next/headers';
import { detectLocale, LOCALE_COOKIE, type Locale } from './config';
import { getDictionary, type Dictionary } from './dictionaries';

export function getRequestLocale(): Locale {
  const cookieStore = cookies();
  const headerStore = headers();
  return detectLocale(cookieStore.get(LOCALE_COOKIE)?.value, headerStore.get('accept-language'));
}

export function getRequestDictionary(): Dictionary {
  return getDictionary(getRequestLocale());
}

export type { Dictionary, Locale };

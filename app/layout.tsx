import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { LocaleProvider } from '@/components/locale-provider';
import { getRequestDictionary, getRequestLocale } from '@/lib/i18n/server';
import { localeToHtmlLang } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: {
    default: 'ResetRadar｜AI 额度重置雷达',
    template: '%s｜ResetRadar',
  },
  description: '记录 AI 编程工具额度事件，订阅经核验的提醒。非官方产品。',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = getRequestLocale();
  const dict = getRequestDictionary();
  return (
    <html lang={localeToHtmlLang(locale)}>
      <body className="min-h-screen font-sans antialiased">
        <LocaleProvider initialLocale={locale}>
          <SiteHeader />
          {children}
          <footer className="mx-auto mt-16 max-w-6xl border-t border-slate-800 px-5 py-8 text-xs leading-6 text-slate-500">
            {dict.footer.disclaimer}
          </footer>
        </LocaleProvider>
      </body>
    </html>
  );
}

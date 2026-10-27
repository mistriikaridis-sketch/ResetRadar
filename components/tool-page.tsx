import Link from 'next/link';
import { getRequestDictionary } from '@/lib/i18n/server';

export function ToolPage({ name }: { name: string }) {
  const dict = getRequestDictionary();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${name} ${dict.tool.titleSuffix}`,
    description: dict.tool.description,
    isPartOf: { '@type': 'WebSite', name: 'ResetRadar' },
  };
  return (
    <main className="mx-auto max-w-3xl px-5 py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <p className="font-mono text-xs text-signal">{name.toUpperCase()} EVENT TRACKER</p>
      <h1 className="mt-4 text-4xl font-bold">
        {name} {dict.tool.titleSuffix}
      </h1>
      <p className="mt-5 leading-7 text-slate-400">{dict.tool.intro}</p>
      <div className="mt-10 border-y border-slate-800 py-6 text-sm text-slate-300">
        <p>{dict.tool.record}</p>
        <p className="mt-3">{dict.tool.notRecord}</p>
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/history" className="text-signal underline">
          {dict.tool.viewEvents}
        </Link>
        <Link href="/#personal-reminder" className="text-signal underline">
          {dict.tool.setReminder}
        </Link>
        <Link href="/rules" className="text-signal underline">
          {dict.tool.platformRules}
        </Link>
      </div>
    </main>
  );
}

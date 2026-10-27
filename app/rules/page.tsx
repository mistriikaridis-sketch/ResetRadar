import Link from 'next/link';
import { MODEL_LABEL } from '@/lib/labels';
import { getRequestDictionary } from '@/lib/i18n/server';

export const metadata = { title: '规则说明 / Rules' };

export default function RulesPage() {
  const dict = getRequestDictionary();
  const rules = [
    { model: 'CODEX' as const, href: '/codex', points: dict.rules.points.CODEX },
    { model: 'CLAUDE_CODE' as const, href: '/claude', points: dict.rules.points.CLAUDE_CODE },
    { model: 'GROK' as const, href: '/grok', points: dict.rules.points.GROK },
  ];

  return (
    <main className="mx-auto max-w-4xl px-5 py-14">
      <p className="font-mono text-xs text-signal">RULES</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight">{dict.rules.title}</h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate-400">{dict.rules.intro}</p>
      <div className="mt-10 grid gap-4">
        {rules.map((item) => (
          <section key={item.model} className="rounded-lg border border-slate-700 bg-panel p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold">{MODEL_LABEL[item.model]}</h2>
              <Link href={item.href} className="text-sm text-signal underline underline-offset-4">
                {dict.rules.openTracker}
              </Link>
            </div>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
              {item.points.map((point) => (
                <li key={point}>• {point}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}

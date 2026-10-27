import Link from 'next/link';

export function ToolPage({ name }: { name: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${name} 额度事件追踪`,
    description: '经核验的 AI 编程工具额度事件记录与提醒说明',
    isPartOf: { '@type': 'WebSite', name: 'ResetRadar' },
  };
  return (
    <main className="mx-auto max-w-3xl px-5 py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <p className="font-mono text-xs text-signal">{name.toUpperCase()} EVENT TRACKER</p>
      <h1 className="mt-4 text-4xl font-bold">{name} 额度事件追踪</h1>
      <p className="mt-5 leading-7 text-slate-400">
        这里展示由管理员手动核验后发布的事件。个人额度和实际恢复时间始终以你的账户页面为准。
      </p>
      <div className="mt-10 border-y border-slate-800 py-6 text-sm text-slate-300">
        <p>我们记录：公告链接、观察时间、预计时间、确认时间和置信度。</p>
        <p className="mt-3">我们不记录：账号、密码、Cookie、API Key；也不提供或承诺重置服务。</p>
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/history" className="text-signal underline">
          查看所有事件
        </Link>
        <Link href="/#personal-reminder" className="text-signal underline">
          设置个人提醒
        </Link>
        <Link href="/rules" className="text-signal underline">
          平台规则说明
        </Link>
      </div>
    </main>
  );
}

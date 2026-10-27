import Link from 'next/link';
import { MODEL_LABEL } from '@/lib/labels';

export const metadata = { title: '规则说明' };

const rules = [
  {
    model: 'CODEX' as const,
    href: '/codex',
    points: [
      '公共看板只展示管理员核验后的额度相关事件，不代表你的个人额度。',
      '个人到点提醒请在首页填写你账户页显示的预计恢复时间。',
      '置信度 OFFICIAL 仅用于正式公告或状态页来源。',
    ],
  },
  {
    model: 'CLAUDE_CODE' as const,
    href: '/claude',
    points: [
      '事件状态（监控 / 预计 / 公告 / 确认 / 恢复）由人工更新，可能滞后于平台。',
      '邮件提醒用于提示你去核验，不会替你判断额度是否已恢复。',
      'ResetRadar 不读取账号、Cookie 或 API Key。',
    ],
  },
  {
    model: 'GROK' as const,
    href: '/grok',
    points: [
      '不同套餐、地区与账户的恢复时间可能不同，以官方账户页为准。',
      'Pro 用户可额外接收管理员核验事件的即时通道通知。',
      '如需取消个人提醒，请打开账户页生成管理链接。',
    ],
  },
];

export default function RulesPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-14">
      <p className="font-mono text-xs text-signal">RULES</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight">三平台规则说明</h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate-400">
        ResetRadar 是非官方信息与提醒工具。以下约定适用于 Codex、Claude Code 与 Grok 相关展示与提醒能力。
      </p>
      <div className="mt-10 grid gap-4">
        {rules.map((item) => (
          <section key={item.model} className="rounded-lg border border-slate-700 bg-panel p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold">{MODEL_LABEL[item.model]}</h2>
              <Link href={item.href} className="text-sm text-signal underline underline-offset-4">
                打开追踪页
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

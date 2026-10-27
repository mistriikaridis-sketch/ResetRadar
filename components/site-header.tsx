import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-ink/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="text-sm font-semibold tracking-tight text-mist">
          <span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full border border-signal text-[11px] text-signal">R</span>
          ResetRadar
        </Link>
        <nav className="flex items-center gap-4 text-sm text-stone-500">
          <Link href="/history">历史</Link>
          <Link href="/rules">规则说明</Link>
          <Link href="/pricing">订阅</Link>
          <Link href="/account">账户</Link>
          <Link href="/admin" className="text-signal">
            管理
          </Link>
        </nav>
      </div>
    </header>
  );
}

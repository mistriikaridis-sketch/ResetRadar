import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = { title: { default: 'ResetRadar｜AI 额度重置雷达', template: '%s｜ResetRadar' }, description: '记录 AI 编程工具额度事件，订阅经核验的提醒。非官方产品。', metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="zh-CN"><body className="min-h-screen font-sans antialiased"><SiteHeader />{children}<footer className="mx-auto mt-16 max-w-6xl border-t border-slate-800 px-5 py-8 text-xs leading-6 text-slate-500">ResetRadar 是独立的非官方信息与提醒工具，不隶属于或获得 OpenAI、Anthropic、xAI 认可。账户额度、资格和恢复时间以对应平台页面为准。</footer></body></html>; }

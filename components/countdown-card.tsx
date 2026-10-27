'use client';
import { useEffect, useState } from 'react';
import type { EventModel, ResetEvent } from '@prisma/client';
import { MODEL_LABEL } from '@/lib/events';
import { formatDate } from '@/lib/utils';

export function CountdownCard({ model, event }: { model: EventModel; event: ResetEvent | null }) {
  const [remaining, setRemaining] = useState('等待确认');
  useEffect(() => { const tick = () => { if (!event?.expectedAt) return setRemaining('等待确认'); const diff = Math.max(0, new Date(event.expectedAt).getTime() - Date.now()); const h = Math.floor(diff / 3600000); const m = Math.floor((diff % 3600000) / 60000); const s = Math.floor((diff % 60000) / 1000); setRemaining(diff ? [h, m, s].map(n => String(n).padStart(2, '0')).join(':') : '已到预计时间'); }; tick(); const timer = setInterval(tick, 1000); return () => clearInterval(timer); }, [event?.expectedAt]);
  return <article className="relative overflow-hidden rounded-lg border border-slate-700 bg-panel p-5"><div className="absolute right-0 top-0 h-1 w-24 bg-signal" /><div className="flex items-start justify-between"><div><p className="font-mono text-xs text-slate-400">{MODEL_LABEL[model]}</p><p className="mt-5 font-mono text-3xl font-medium tracking-tighter text-mist">{remaining}</p></div><span className="rounded-full border border-slate-600 px-2 py-1 text-[10px] text-signal">{event?.confidence || 'LOW'}</span></div><p className="mt-5 border-t border-slate-700 pt-3 text-xs text-slate-400">预计：{formatDate(event?.expectedAt)}<br />状态：{event?.status || '暂无事件'}</p></article>;
}

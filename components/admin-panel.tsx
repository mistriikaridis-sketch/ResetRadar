'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Item = { id: string; model: string; status: string; expectedAt: string | null };

export function AdminPanel({ events }: { events: Item[] }) {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  async function create(form: HTMLFormElement) {
    setBusy(true);
    const response = await fetch('/api/admin/events', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    const body = await response.json();
    setBusy(false);
    setMessage(response.ok ? `事件已保存。ID：${body.id}` : body.message);
    if (response.ok) form.reset();
  }

  async function notify(eventId: string, test = false) {
    if (test && !testEmail.trim()) { setMessage('先填写已登记的测试邮箱。'); return; }
    setBusy(true);
    const response = await fetch('/api/admin/notify', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ eventId, testEmail: test ? testEmail : undefined }) });
    const body = await response.json();
    setBusy(false);
    setMessage(response.ok ? `${test ? '测试投递' : 'Pro 通知'}完成：成功 ${body.delivered}，失败 ${body.failed}。` : body.message);
  }

  async function runDueReminders() {
    setBusy(true);
    const response = await fetch('/api/admin/reminders/run', { method: 'POST' });
    const body = await response.json();
    setBusy(false);
    setMessage(response.ok ? `到点提醒检查完成：检查 ${body.scanned}，成功 ${body.delivered}，失败 ${body.failed}。` : body.message);
  }

  return <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
    <form onSubmit={event => { event.preventDefault(); create(event.currentTarget); }} className="space-y-3 rounded-lg border border-slate-700 bg-panel p-5">
      <h2 className="text-xl font-bold">创建重置事件</h2>
      <p className="text-sm text-slate-400">这里是公开状态板：预计时间只用于展示倒计时，不会在到点时自动发送邮件。确认事件后，才点右侧的“通知 Pro”。</p>
      <select name="model" required className="field"><option value="CODEX">Codex</option><option value="CLAUDE_CODE">Claude Code</option><option value="GROK">Grok</option></select>
      <select name="status" required className="field"><option value="WATCHING">观察中</option><option value="ANNOUNCED">已公告</option><option value="EXPECTED">预计</option><option value="CONFIRMED">已确认</option><option value="RESOLVED">已解决</option></select>
      <select name="confidence" required className="field"><option value="OFFICIAL">官方</option><option value="HIGH">高</option><option value="MEDIUM">中</option><option value="LOW">低</option></select>
      <label className="label">预计时间（只展示，不自动发邮件）<input name="expectedAt" type="datetime-local" className="field mt-1" /></label>
      <label className="label">来源 URL<input name="sourceUrl" type="url" placeholder="https://…" className="field mt-1" /></label>
      <textarea name="note" required placeholder="事件说明：哪里确认的、对用户意味着什么" className="field min-h-24" />
      <Button disabled={busy} className="w-full">{busy ? '处理中…' : '保存事件'}</Button>
      <p className="min-h-4 text-xs text-signal">{message}</p>
    </form>

    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h2 className="text-xl font-bold">最近事件</h2><p className="mt-1 text-xs text-slate-500">测试投递不要求用户已是 Pro；正式投递只发给 Pro / Team。个人到点邮件请到 <a href="/#personal-reminder" className="text-signal underline">首页的个人提醒</a> 设置。</p></div>
        <Button variant="outline" disabled={busy} onClick={runDueReminders}>检查到点提醒</Button>
        <label className="label w-full sm:w-64">测试邮箱<input value={testEmail} onChange={event => setTestEmail(event.target.value)} type="email" placeholder="已登记的邮箱" className="field mt-1" /></label>
      </div>
      <div className="mt-4 divide-y divide-slate-800 border-y border-slate-800">
        {events.length ? events.map(event => <div key={event.id} className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm"><div><p className="font-medium text-mist">{event.model} · {event.status}</p><p className="mt-1 text-xs text-slate-500">{event.expectedAt ? new Date(event.expectedAt).toLocaleString('zh-CN') : '无预计时间'}</p></div><div className="flex gap-2"><Button variant="outline" disabled={busy} onClick={() => notify(event.id, true)}>测试</Button><Button disabled={busy} onClick={() => notify(event.id)}>通知 Pro</Button></div></div>) : <p className="py-6 text-sm text-slate-500">还没有事件。先录入一个经过核验的事件。</p>}
      </div>
    </section>
  </div>;
}

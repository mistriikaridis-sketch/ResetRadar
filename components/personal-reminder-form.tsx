'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MODEL_LABEL } from '@/lib/labels';


type Reminder = { model: string; expectedAt: string; status: string };

export function PersonalReminderForm({ reminders: initialReminders }: { reminders: Reminder[] }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [reminders, setReminders] = useState(initialReminders);

  const timezoneNote = useMemo(() => {
    const local = Intl.DateTimeFormat().resolvedOptions().timeZone || '本地时区';
    const preview = new Intl.DateTimeFormat('zh-CN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Shanghai',
    }).format(new Date());
    return { local, preview };
  }, []);

  async function submit(form: HTMLFormElement) {
    setLoading(true);
    setMessage('');
    const data = Object.fromEntries(new FormData(form));
    const localTime = new Date(String(data.expectedAt));
    data.expectedAt = localTime.toISOString();
    const response = await fetch('/api/personal-reminders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    });
    const body = await response.json();
    setLoading(false);
    setMessage(body.message || '保存失败，请稍后再试。');
    if (response.ok) {
      setReminders((current) =>
        [{ model: String(data.model), expectedAt: localTime.toISOString(), status: 'PENDING' }, ...current.filter((item) => item.status === 'PENDING')].slice(0, 5),
      );
      form.reset();
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit(event.currentTarget);
      }}
      className="space-y-4 rounded-lg border border-line bg-panel p-6"
    >
      <div>
        <p className="font-mono text-xs text-signal">个人到点邮件提醒</p>
        <h2 className="mt-2 text-2xl font-bold text-mist">只有在这里保存，时间到了才会自动发邮件。</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
          请填你自己的账户页面显示的时间。后台“创建重置事件”的预计时间只用于网站展示，不能代替这里的个人提醒。邮件会提醒你核验，不会替你判断额度是否已恢复；线上版本约每 5 分钟检查一次。
        </p>
        <p className="mt-2 max-w-xl text-xs leading-5 text-slate-500">
          表单按<strong>本机时区（{timezoneNote.local}）</strong>选择时间；发信正文会按 <strong>Asia/Shanghai</strong> 格式化展示。当前上海时间预览：{timezoneNote.preview}。也可在{' '}
          <a href="/account" className="text-signal underline underline-offset-4">
            账户页
          </a>{' '}
          查看或取消提醒。
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="label">
          工具
          <select required name="model" className="field mt-1">
            <option value="CODEX">Codex</option>
            <option value="CLAUDE_CODE">Claude Code</option>
            <option value="GROK">Grok</option>
          </select>
        </label>
        <label className="label">
          预计恢复时间
          <input required name="expectedAt" type="datetime-local" className="field mt-1" />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="label">
          提醒时间
          <select name="advanceMinutes" defaultValue="0" className="field mt-1">
            <option value="0">正好到点</option>
            <option value="15">提前 15 分钟</option>
            <option value="30">提前 30 分钟</option>
            <option value="60">提前 1 小时</option>
          </select>
        </label>
        <label className="label">
          接收邮箱
          <input required name="email" type="email" placeholder="能收到邮件的地址" className="field mt-1" />
        </label>
      </div>
      <Button disabled={loading} className="w-full sm:w-auto">
        {loading ? '保存中…' : '保存个人提醒'}
      </Button>
      {message && (
        <p aria-live="polite" className="text-sm text-signal">
          {message}
        </p>
      )}
      <div className="border-t border-line pt-4">
        <p className="text-sm font-semibold text-mist">本设备保存的提醒</p>
        {reminders.length ? (
          <div className="mt-2 divide-y divide-line text-sm">
            {reminders.map((item, index) => (
              <div key={`${item.expectedAt}-${index}`} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <span>
                  {MODEL_LABEL[item.model as keyof typeof MODEL_LABEL] || item.model} · {new Date(item.expectedAt).toLocaleString('zh-CN')}
                </span>
                <span className={item.status === 'SENT' ? 'text-signal' : item.status === 'FAILED' ? 'text-amber' : 'text-slate-500'}>
                  {item.status === 'PENDING'
                    ? '等待发送'
                    : item.status === 'SENT'
                      ? '已发送'
                      : item.status === 'FAILED'
                        ? '发送失败'
                        : item.status === 'CANCELED'
                          ? '已取消'
                          : item.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500">保存后，提醒记录会显示在这里。</p>
        )}
      </div>
    </form>
  );
}

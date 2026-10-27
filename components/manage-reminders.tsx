'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MODEL_LABEL } from '@/lib/labels';
import { useDict, useLocale } from '@/components/locale-provider';

type Reminder = {
  id: string;
  model: keyof typeof MODEL_LABEL | string;
  expectedAt: string;
  remindAt: string;
  status: string;
  advanceMinutes: number;
};

export function ManageLinkForm() {
  const dict = useDict();
  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(form: HTMLFormElement) {
    setLoading(true);
    setMessage('');
    setUrl('');
    const data = Object.fromEntries(new FormData(form));
    const response = await fetch('/api/account/manage-link', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    });
    const body = await response.json();
    setLoading(false);
    setMessage(body.message || dict.manage.fail);
    if (body.url) setUrl(body.url);
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit(event.currentTarget);
      }}
      className="space-y-4 rounded-lg border border-slate-700 bg-panel p-6"
    >
      <div>
        <p className="font-mono text-xs text-signal">{dict.manage.kicker}</p>
        <h2 className="mt-2 text-xl font-bold">{dict.manage.title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">{dict.manage.body}</p>
      </div>
      <label className="label">
        {dict.manage.email}
        <input required name="email" type="email" className="field mt-1" />
      </label>
      <Button disabled={loading}>{loading ? dict.manage.generating : dict.manage.generate}</Button>
      {message && <p className="text-sm text-signal">{message}</p>}
      {url && (
        <p className="break-all text-sm">
          <a href={url} className="text-signal underline underline-offset-4">
            {url}
          </a>
        </p>
      )}
    </form>
  );
}

export function ReminderManager({
  token,
  reminders: initial,
}: {
  token: string;
  reminders: Reminder[];
}) {
  const dict = useDict();
  const { locale } = useLocale();
  const dateLocale = locale === 'en' ? 'en-US' : 'zh-CN';
  const [reminders, setReminders] = useState(initial);
  const [message, setMessage] = useState('');

  async function cancel(id: string) {
    setMessage('');
    const response = await fetch('/api/personal-reminders/cancel', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, token }),
    });
    const body = await response.json();
    setMessage(body.message || dict.manage.opFail);
    if (response.ok) {
      setReminders((current) =>
        current.map((item) => (item.id === id ? { ...item, status: 'CANCELED' } : item)),
      );
    }
  }

  return (
    <section className="rounded-lg border border-slate-700 bg-panel p-6">
      <p className="font-mono text-xs text-signal">{dict.manage.listKicker}</p>
      <h2 className="mt-2 text-xl font-bold">{dict.manage.listTitle}</h2>
      {reminders.length ? (
        <div className="mt-4 divide-y divide-slate-800 text-sm">
          {reminders.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="font-medium text-mist">
                  {MODEL_LABEL[item.model as keyof typeof MODEL_LABEL] || item.model} · {item.status}
                </p>
                <p className="text-slate-400">
                  {dict.manage.expected} {new Date(item.expectedAt).toLocaleString(dateLocale)} ·{' '}
                  {dict.manage.remind} {new Date(item.remindAt).toLocaleString(dateLocale)}
                  {item.advanceMinutes
                    ? `（${dict.manage.advance} ${item.advanceMinutes} min）`
                    : ''}
                </p>
              </div>
              {['PENDING', 'PROCESSING', 'FAILED'].includes(item.status) && (
                <Button type="button" onClick={() => cancel(item.id)} className="shrink-0">
                  {dict.manage.cancel}
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-400">{dict.manage.empty}</p>
      )}
      {message && <p className="mt-3 text-sm text-signal">{message}</p>}
    </section>
  );
}

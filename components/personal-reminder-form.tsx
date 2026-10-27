'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MODEL_LABEL } from '@/lib/labels';
import { useDict, useLocale } from '@/components/locale-provider';

type Reminder = { model: string; expectedAt: string; status: string };

export function PersonalReminderForm({ reminders: initialReminders }: { reminders: Reminder[] }) {
  const dict = useDict();
  const { locale } = useLocale();
  const dateLocale = locale === 'en' ? 'en-US' : 'zh-CN';
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [reminders, setReminders] = useState(initialReminders);

  const timezoneNote = useMemo(() => {
    const local = Intl.DateTimeFormat().resolvedOptions().timeZone || 'local';
    const preview = new Intl.DateTimeFormat(dateLocale, {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Shanghai',
    }).format(new Date());
    return { local, preview };
  }, [dateLocale]);

  function statusLabel(status: string) {
    if (status === 'PENDING') return dict.reminder.statusPending;
    if (status === 'SENT') return dict.reminder.statusSent;
    if (status === 'FAILED') return dict.reminder.statusFailed;
    if (status === 'CANCELED') return dict.reminder.statusCanceled;
    return status;
  }

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
    setMessage(body.message || dict.reminder.saveFail);
    if (response.ok) {
      setReminders((current) =>
        [
          { model: String(data.model), expectedAt: localTime.toISOString(), status: 'PENDING' },
          ...current.filter((item) => item.status === 'PENDING'),
        ].slice(0, 5),
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
        <p className="font-mono text-xs text-signal">{dict.reminder.kicker}</p>
        <h2 className="mt-2 text-2xl font-bold text-mist">{dict.reminder.title}</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">{dict.reminder.body}</p>
        <p className="mt-2 max-w-xl text-xs leading-5 text-slate-500">
          {dict.reminder.tzNoteBefore}
          <strong>
            {dict.reminder.tzNoteLocal} ({timezoneNote.local})
          </strong>
          {dict.reminder.tzNoteMid} <strong>{dict.reminder.tzNoteShanghai}</strong>
          {dict.reminder.tzNotePreview}
          {timezoneNote.preview}.{' '}
          <a href="/account" className="text-signal underline underline-offset-4">
            {dict.reminder.accountLink}
          </a>{' '}
          {dict.reminder.tzNoteAfter}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="label">
          {dict.reminder.tool}
          <select required name="model" className="field mt-1">
            <option value="CODEX">Codex</option>
            <option value="CLAUDE_CODE">Claude Code</option>
            <option value="GROK">Grok</option>
          </select>
        </label>
        <label className="label">
          {dict.reminder.expectedAt}
          <input required name="expectedAt" type="datetime-local" className="field mt-1" />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="label">
          {dict.reminder.remindTime}
          <select name="advanceMinutes" defaultValue="0" className="field mt-1">
            <option value="0">{dict.reminder.advance0}</option>
            <option value="15">{dict.reminder.advance15}</option>
            <option value="30">{dict.reminder.advance30}</option>
            <option value="60">{dict.reminder.advance60}</option>
          </select>
        </label>
        <label className="label">
          {dict.reminder.email}
          <input
            required
            name="email"
            type="email"
            placeholder={dict.reminder.emailPlaceholder}
            className="field mt-1"
          />
        </label>
      </div>
      <Button disabled={loading} className="w-full sm:w-auto">
        {loading ? dict.reminder.saving : dict.reminder.save}
      </Button>
      {message && (
        <p aria-live="polite" className="text-sm text-signal">
          {message}
        </p>
      )}
      <div className="border-t border-line pt-4">
        <p className="text-sm font-semibold text-mist">{dict.reminder.savedList}</p>
        {reminders.length ? (
          <div className="mt-2 divide-y divide-line text-sm">
            {reminders.map((item, index) => (
              <div
                key={`${item.expectedAt}-${index}`}
                className="flex flex-wrap items-center justify-between gap-2 py-2"
              >
                <span>
                  {MODEL_LABEL[item.model as keyof typeof MODEL_LABEL] || item.model} ·{' '}
                  {new Date(item.expectedAt).toLocaleString(dateLocale)}
                </span>
                <span
                  className={
                    item.status === 'SENT'
                      ? 'text-signal'
                      : item.status === 'FAILED'
                        ? 'text-amber'
                        : 'text-slate-500'
                  }
                >
                  {statusLabel(item.status)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500">{dict.reminder.emptyList}</p>
        )}
      </div>
    </form>
  );
}

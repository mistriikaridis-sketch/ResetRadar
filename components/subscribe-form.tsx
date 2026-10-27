'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDict } from '@/components/locale-provider';

export function SubscribeForm() {
  const dict = useDict();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(form: HTMLFormElement) {
    setLoading(true);
    setMessage('');
    const data = Object.fromEntries(new FormData(form));
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    });
    const body = await response.json();
    setLoading(false);
    setMessage(body.message || dict.subscribe.fail);
    if (response.ok) form.reset();
  }

  return (
    <form
      id="subscribe"
      onSubmit={(event) => {
        event.preventDefault();
        submit(event.currentTarget);
      }}
      className="space-y-4 rounded-lg border border-slate-700 bg-panel p-6"
    >
      <div>
        <p className="font-mono text-xs text-signal">{dict.subscribe.kicker}</p>
        <h2 className="mt-2 text-xl font-bold">{dict.subscribe.title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">{dict.subscribe.body}</p>
      </div>
      <label className="label">
        {dict.subscribe.email}
        <input required name="email" type="email" className="field mt-1" placeholder="you@example.com" />
      </label>
      <label className="label">
        {dict.subscribe.telegram}
        <input
          name="telegramChatId"
          className="field mt-1"
          placeholder={dict.subscribe.telegramPlaceholder}
        />
      </label>
      <label className="label">
        {dict.subscribe.bark}
        <input name="barkKey" className="field mt-1" placeholder={dict.subscribe.barkPlaceholder} />
      </label>
      <label className="label">
        {dict.subscribe.wecom}
        <input
          name="wecomWebhook"
          className="field mt-1"
          placeholder={dict.subscribe.wecomPlaceholder}
        />
      </label>
      <Button disabled={loading}>{loading ? dict.subscribe.submitting : dict.subscribe.save}</Button>
      {message && <p className="text-sm text-signal">{message}</p>}
    </form>
  );
}

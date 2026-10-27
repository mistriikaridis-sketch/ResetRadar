'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDict } from '@/components/locale-provider';

export function LoginForm() {
  const dict = useDict();
  const router = useRouter();
  const [message, setMessage] = useState('');

  async function login(form: HTMLFormElement) {
    const password = new FormData(form).get('password');
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (response.ok) router.push('/admin');
    else setMessage((await response.json()).message);
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        login(event.currentTarget);
      }}
      className="mx-auto mt-16 max-w-sm space-y-4 rounded-lg border border-slate-700 bg-panel p-6"
    >
      <h1 className="text-2xl font-bold">{dict.login.title}</h1>
      <p className="text-sm text-slate-400">{dict.login.hint}</p>
      <input
        autoFocus
        required
        type="password"
        name="password"
        placeholder={dict.login.passwordPlaceholder}
        className="field"
      />
      <Button className="w-full">{dict.login.submit}</Button>
      {message && <p className="text-sm text-amber">{message}</p>}
    </form>
  );
}

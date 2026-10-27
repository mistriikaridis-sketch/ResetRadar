'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDict } from '@/components/locale-provider';

export function CheckoutButton({ stripeConfigured = true }: { stripeConfigured?: boolean }) {
  const dict = useDict();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function start() {
    if (!stripeConfigured) {
      setMessage(dict.checkout.stripeMissing);
      return;
    }
    const email = window.prompt(dict.checkout.emailPrompt);
    if (!email) return;
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.url) window.location.assign(data.url);
      else setMessage(data.message || dict.checkout.startFail);
    } catch {
      setMessage(dict.checkout.networkFail);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button onClick={start} disabled={loading || !stripeConfigured} className="w-full">
        {loading ? dict.checkout.redirecting : stripeConfigured ? dict.checkout.pay : dict.checkout.notReady}
      </Button>
      {message && <p className="mt-3 text-xs text-amber">{message}</p>}
    </div>
  );
}

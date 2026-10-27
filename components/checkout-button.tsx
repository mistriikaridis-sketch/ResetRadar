'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function CheckoutButton({ stripeConfigured = true }: { stripeConfigured?: boolean }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function start() {
    if (!stripeConfigured) {
      setMessage('Stripe 尚未配置，暂时无法在线支付。请稍后再试或联系管理员。');
      return;
    }
    const email = window.prompt('输入你已登记的邮箱，用于关联订阅：');
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
      else setMessage(data.message || '无法开始支付。');
    } catch {
      setMessage('网络异常，请稍后再试。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button onClick={start} disabled={loading || !stripeConfigured} className="w-full">
        {loading ? '跳转中…' : stripeConfigured ? '前往 Stripe 支付' : '支付通道未就绪'}
      </Button>
      {message && <p className="mt-3 text-xs text-amber">{message}</p>}
    </div>
  );
}

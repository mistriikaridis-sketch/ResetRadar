'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function SubscribeForm() {
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
    setMessage(body.message || '登记失败。');
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
        <p className="font-mono text-xs text-signal">通知通道登记</p>
        <h2 className="mt-2 text-xl font-bold">登记邮箱与可选推送通道</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          邮箱可用于个人到点提醒。Telegram / Bark / 企微在升级 Pro 后，才会收到管理员核验事件通知。企微仅接受官方
          `qyapi.weixin.qq.com` HTTPS Webhook。
        </p>
      </div>
      <label className="label">
        邮箱 *
        <input required name="email" type="email" className="field mt-1" placeholder="you@example.com" />
      </label>
      <label className="label">
        Telegram Chat ID（可选）
        <input name="telegramChatId" className="field mt-1" placeholder="向 Bot 发送 /start 获取" />
      </label>
      <label className="label">
        Bark Key（可选）
        <input name="barkKey" className="field mt-1" placeholder="Bark 推送 Key" />
      </label>
      <label className="label">
        企微 Webhook（可选，计划中优先邮件）
        <input name="wecomWebhook" className="field mt-1" placeholder="https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=..." />
      </label>
      <Button disabled={loading}>{loading ? '提交中…' : '保存通道'}</Button>
      {message && <p className="text-sm text-signal">{message}</p>}
    </form>
  );
}

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const configured = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
  if (process.env.NODE_ENV === 'production' && !configured) {
    return NextResponse.json({ ok: false, message: '生产环境未配置 TELEGRAM_WEBHOOK_SECRET。' }, { status: 503 });
  }

  const secret = request.headers.get('x-telegram-bot-api-secret-token');
  if (configured && secret !== configured) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const update = await request.json();
  const chatId = update?.message?.chat?.id;
  const text = update?.message?.text;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (chatId && text === '/start') {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      return NextResponse.json({ ok: false, message: 'Bot token 未配置' }, { status: 503 });
    }
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `你的 Chat ID 是：${chatId}\n请打开 ${appUrl}/account 在「通知通道登记」里粘贴保存。升级 Pro 后可收到管理员核验事件通知。`,
      }),
    });
  }

  return NextResponse.json({ ok: true });
}

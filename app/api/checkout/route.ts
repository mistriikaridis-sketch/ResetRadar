import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { stripe } from '@/lib/stripe';
import { checkoutBodySchema, zodErrorMessage } from '@/lib/validate';

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    const limited = rateLimit(`checkout:${ip}`, 20, 60 * 60 * 1000);
    if (!limited.ok) return NextResponse.json({ message: '请求过于频繁，请稍后再试。' }, { status: 429 });

    const parsed = checkoutBodySchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ message: zodErrorMessage(parsed.error) }, { status: 400 });

    const email = parsed.data.email;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ message: '请先在首页创建个人提醒或在账户页登记邮箱。' }, { status: 404 });
    if (!process.env.STRIPE_PRICE_ID || !process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ message: 'Stripe 尚未配置。请联系管理员完成支付通道接入。' }, { status: 503 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: user.stripeCustomerId || undefined,
      customer_email: user.stripeCustomerId ? undefined : user.email,
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?checkout=cancel`,
      metadata: { userId: user.id },
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : '无法创建支付。' }, { status: 400 });
  }
}

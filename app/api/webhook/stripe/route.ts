import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Plan, SubscriptionStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature'); const raw = await request.text(); let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(raw, signature || '', process.env.STRIPE_WEBHOOK_SECRET || ''); } catch { return NextResponse.json({ message: 'Webhook 签名无效。' }, { status: 400 }); }
  if (event.type === 'checkout.session.completed') { const session = event.data.object as Stripe.Checkout.Session; const userId = session.metadata?.userId; const subscriptionId = typeof session.subscription === 'string' ? session.subscription : null; if (userId && subscriptionId) { const subscription = await stripe.subscriptions.retrieve(subscriptionId); await prisma.user.update({ where: { id: userId }, data: { plan: Plan.PRO, stripeCustomerId: String(session.customer) } }); await prisma.subscription.upsert({ where: { stripeSubscriptionId: subscriptionId }, create: { userId, stripeSubscriptionId: subscriptionId, plan: Plan.PRO, status: SubscriptionStatus.ACTIVE, currentPeriodEnd: new Date(subscription.current_period_end * 1000) }, update: { status: SubscriptionStatus.ACTIVE, currentPeriodEnd: new Date(subscription.current_period_end * 1000) } }); } }
  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') { const subscription = event.data.object as Stripe.Subscription; const local = await prisma.subscription.findUnique({ where: { stripeSubscriptionId: subscription.id } }); if (local) { const active = ['active', 'trialing'].includes(subscription.status); await prisma.subscription.update({ where: { id: local.id }, data: { status: subscription.status.toUpperCase().replace('-', '_') as SubscriptionStatus, currentPeriodEnd: new Date(subscription.current_period_end * 1000) } }); if (!active) await prisma.user.update({ where: { id: local.userId }, data: { plan: Plan.FREE } }); } }
  return NextResponse.json({ received: true });
}

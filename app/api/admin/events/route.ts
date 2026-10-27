import { NextResponse } from 'next/server';
import { hasAdminSession } from '@/lib/auth';
import { eventInput } from '@/lib/events';
import { prisma } from '@/lib/prisma';
import { adminEventBodySchema, zodErrorMessage } from '@/lib/validate';

export async function POST(request: Request) {
  if (!hasAdminSession()) return NextResponse.json({ message: '未授权。' }, { status: 401 });
  try {
    const parsed = adminEventBodySchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ message: zodErrorMessage(parsed.error) }, { status: 400 });
    const event = await prisma.resetEvent.create({ data: eventInput(parsed.data as Record<string, unknown>) });
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : '无法创建事件。' }, { status: 400 });
  }
}

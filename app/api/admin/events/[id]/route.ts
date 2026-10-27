import { NextResponse } from 'next/server';
import { hasAdminSession } from '@/lib/auth';
import { eventInput } from '@/lib/events';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!hasAdminSession()) return NextResponse.json({ message: '未授权。' }, { status: 401 });
  try { const event = await prisma.resetEvent.update({ where: { id: params.id }, data: eventInput(await request.json()) }); return NextResponse.json(event); }
  catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : '无法更新事件。' }, { status: 400 }); }
}

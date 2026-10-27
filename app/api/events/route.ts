import { NextResponse } from 'next/server';
import { listRecentEvents } from '@/lib/events';
export async function GET() { return NextResponse.json(await listRecentEvents()); }

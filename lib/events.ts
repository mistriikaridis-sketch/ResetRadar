import { EventModel, EventStatus, Prisma } from '@prisma/client';
import { MODEL_LABEL } from './labels';
import { prisma } from './prisma';

export { MODEL_LABEL };

export async function listRecentEvents() {
  try {
    return await prisma.resetEvent.findMany({ orderBy: { createdAt: 'desc' }, take: 30 });
  } catch {
    return [];
  }
}

export async function latestByModel() {
  const events = await listRecentEvents();
  return Object.values(EventModel).map((model) => ({
    model,
    event:
      events.find((event) => event.model === model && event.status !== EventStatus.RESOLVED) ??
      events.find((event) => event.model === model) ??
      null,
  }));
}

export function eventInput(body: Record<string, unknown>): Prisma.ResetEventCreateInput {
  const asDate = (key: string) => (body[key] ? new Date(String(body[key])) : null);
  return {
    model: body.model as EventModel,
    status: body.status as EventStatus,
    announcedAt: asDate('announcedAt'),
    expectedAt: asDate('expectedAt'),
    confirmedAt: asDate('confirmedAt'),
    sourceUrl: body.sourceUrl ? String(body.sourceUrl) : null,
    confidence: body.confidence as Prisma.ResetEventCreateInput['confidence'],
    note: body.note ? String(body.note) : null,
  };
}

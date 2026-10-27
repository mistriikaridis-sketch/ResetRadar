import { NextResponse } from 'next/server';
import { listRecentEvents } from '@/lib/events';
import { MODEL_LABEL } from '@/lib/labels';

function icsEscape(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function icsDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export async function GET() {
  const events = await listRecentEvents();
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ResetRadar//ZH'];
  for (const event of events.filter((item) => item.expectedAt)) {
    const date = icsDate(event.expectedAt!);
    const summary = `ResetRadar ${MODEL_LABEL[event.model]} ${event.status}`;
    const description = icsEscape(event.note || '额度事件提醒');
    lines.push(
      'BEGIN:VEVENT',
      `UID:${event.id}@resetradar`,
      `DTSTAMP:${icsDate(event.createdAt)}`,
      `DTSTART:${date}`,
      `SUMMARY:${icsEscape(summary)}`,
      `DESCRIPTION:${description}`,
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return new NextResponse(lines.join('\r\n'), {
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      'content-disposition': 'attachment; filename="resetradar.ics"',
    },
  });
}

import Link from 'next/link';
import type { ResetEvent } from '@prisma/client';
import { MODEL_LABEL } from '@/lib/events';
import { formatDate } from '@/lib/utils';
import { getRequestDictionary } from '@/lib/i18n/server';

export function EventTable({ events }: { events: ResetEvent[] }) {
  const dict = getRequestDictionary();
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800">
      <table className="w-full min-w-[650px] text-left text-sm">
        <thead className="bg-panel text-xs text-slate-400">
          <tr>
            <th className="p-4">{dict.eventTable.tool}</th>
            <th className="p-4">{dict.eventTable.status}</th>
            <th className="p-4">{dict.eventTable.expectedConfirmed}</th>
            <th className="p-4">{dict.eventTable.confidence}</th>
            <th className="p-4">{dict.eventTable.source}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {events.length ? (
            events.map((event) => (
              <tr key={event.id}>
                <td className="p-4 font-medium">{MODEL_LABEL[event.model]}</td>
                <td className="p-4 text-signal">{event.status}</td>
                <td className="p-4 text-slate-400">{formatDate(event.confirmedAt || event.expectedAt)}</td>
                <td className="p-4">{event.confidence}</td>
                <td className="p-4">
                  {event.sourceUrl ? (
                    <Link href={event.sourceUrl} target="_blank" className="text-signal underline">
                      {dict.eventTable.view}
                    </Link>
                  ) : (
                    <span className="text-slate-600">{dict.eventTable.noSource}</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-8 text-center text-slate-500">
                {dict.eventTable.empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

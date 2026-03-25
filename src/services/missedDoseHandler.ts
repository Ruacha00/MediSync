import type { Medication, CalendarEvent, MissedDoseResult } from '@/types';
import { addHours, differenceInMinutes, format } from 'date-fns';

export function handleMissedDose(
  medication: Medication,
  originalTime: Date,
  currentTime: Date,
  calendarEvents: CalendarEvent[],
): MissedDoseResult {
  const windowEnd = addHours(originalTime, medication.safetyWindowHours);

  if (currentTime >= windowEnd) {
    return {
      action: 'expired',
      message: `Safety catch-up window has passed. This dose has been automatically skipped and recorded.`,
    };
  }

  const remainingMinutes = differenceInMinutes(windowEnd, currentTime);
  const windowEndStr = format(windowEnd, 'h:mm a');

  const suggestedTime = findNextFreeSlot(currentTime, windowEnd, calendarEvents);

  return {
    action: 'reschedule',
    suggestedTime: format(suggestedTime, 'h:mm a'),
    windowEnd: windowEndStr,
    remainingMinutes,
    message: `You can still take ${medication.name} ${medication.dosage}. Safe window closes at ${windowEndStr} (${remainingMinutes} min remaining).`,
  };
}

function findNextFreeSlot(
  start: Date,
  end: Date,
  calendarEvents: CalendarEvent[],
): Date {
  let candidate = new Date(start.getTime() + 5 * 60 * 1000);

  for (const event of calendarEvents) {
    const eventStart = new Date(event.startTime);
    const eventEnd = new Date(event.endTime);

    if (candidate >= eventStart && candidate <= eventEnd) {
      candidate = new Date(eventEnd.getTime() + 5 * 60 * 1000);
    }
  }

  if (candidate > end) {
    candidate = new Date(start.getTime() + 5 * 60 * 1000);
  }

  return candidate;
}

import type { Medication, CalendarEvent } from '@/types';
import { differenceInMinutes, format } from 'date-fns';

export interface DepartureReminder {
  eventId: string;
  eventTitle: string;
  eventTime: string;
  departureTime: string;
  medication: Medication;
  message: string;
}

export function checkDepartureReminders(
  medications: Medication[],
  calendarEvents: CalendarEvent[],
  currentTime: Date,
): DepartureReminder | null {
  for (const event of calendarEvents) {
    if (!event.isOutdoor) continue;

    const eventStart = new Date(event.startTime);
    const departureTime = new Date(eventStart.getTime() - event.departureBuffer * 60 * 1000);
    const minutesUntilDeparture = differenceInMinutes(departureTime, currentTime);

    if (minutesUntilDeparture > 0 && minutesUntilDeparture <= 60) {
      const morningMed = medications.find(
        (m) => m.prescribedTime === 'morning' || m.prescribedTime === 'twice_daily',
      );

      if (morningMed) {
        return {
          eventId: event.id,
          eventTitle: event.title,
          eventTime: format(eventStart, 'h:mm a'),
          departureTime: format(departureTime, 'h:mm a'),
          medication: morningMed,
          message: `You have "${event.title}" at ${format(eventStart, 'h:mm a')}. Remember to take ${morningMed.name} ${morningMed.dosage} before leaving!`,
        };
      }
    }
  }

  return null;
}

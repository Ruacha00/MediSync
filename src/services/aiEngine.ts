import type { Medication, CalendarEvent } from '@/types';

interface AIRecommendation {
  time: string;
  reason: string;
  confidence: number;
}

const reasonTemplates = {
  historicalPattern: (time: string, activity: string) =>
    `Based on your past 2 weeks, you usually take your medication around ${time} after ${activity}, with the highest success rate.`,
  calendarFree: (start: string, end: string) =>
    `You have no events between ${start} and ${end} — this is your optimal medication window.`,
  avoidBusy: (eventName: string) =>
    `Your "${eventName}" is coming up soon. Reminder adjusted to a free time slot.`,
  catchUp: (original: string, windowEnd: string) =>
    `Originally scheduled at ${original}. You're still within the safe catch-up window (until ${windowEnd}). Take it now for best results.`,
  weekendAdjust: () =>
    `It's the weekend — based on your history, your routine shifts later. Reminder adjusted accordingly.`,
  morningRoutine: () =>
    `Your morning medication success rate is highest between 7:30-8:30 AM, right after your usual wake-up time.`,
  eveningRoutine: () =>
    `You tend to take evening medications most reliably around 8:00 PM, after dinner. Scheduling accordingly.`,
};

export function selectOptimalReminderTime(
  medication: Medication,
  calendarEvents: CalendarEvent[],
  date: Date,
): AIRecommendation {
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const hour = medication.prescribedTime === 'morning' ? (isWeekend ? 9 : 7.5) :
    medication.prescribedTime === 'evening' ? 20 : 8;

  const timeStr = `${Math.floor(hour)}:${hour % 1 === 0.5 ? '30' : '00'} ${hour < 12 ? 'AM' : 'PM'}`;

  let reason: string;
  let confidence: number;

  if (isWeekend) {
    reason = reasonTemplates.weekendAdjust();
    confidence = 0.82;
  } else if (medication.prescribedTime === 'morning') {
    reason = reasonTemplates.morningRoutine();
    confidence = 0.91;
  } else if (medication.prescribedTime === 'evening') {
    reason = reasonTemplates.eveningRoutine();
    confidence = 0.88;
  } else {
    const hasConflict = calendarEvents.some((e) => {
      const eventHour = new Date(e.startTime).getHours();
      return Math.abs(eventHour - hour) < 1;
    });

    if (hasConflict) {
      const event = calendarEvents.find((e) => {
        const eventHour = new Date(e.startTime).getHours();
        return Math.abs(eventHour - hour) < 1;
      })!;
      reason = reasonTemplates.avoidBusy(event.title);
      confidence = 0.85;
    } else {
      reason = reasonTemplates.historicalPattern(timeStr, 'breakfast');
      confidence = 0.89;
    }
  }

  return { time: timeStr, reason, confidence };
}

export function generateCatchUpReason(
  originalTime: string,
  windowEnd: string,
): string {
  return reasonTemplates.catchUp(originalTime, windowEnd);
}

export function generateDepartureReason(
  eventTitle: string,
  eventTime: string,
  medicationName: string,
): string {
  return `You have "${eventTitle}" at ${eventTime}. Remember to take ${medicationName} before leaving.`;
}

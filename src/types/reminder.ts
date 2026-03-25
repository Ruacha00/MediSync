export interface Reminder {
  id: string;
  medicationId: string;
  patientId: string;
  scheduledTime: string;
  originalPrescribedTime: string;
  status: 'pending' | 'taken' | 'snoozed' | 'skipped' | 'missed' | 'expired';
  respondedAt?: string;
  aiReason: string;
  aiConfidence: number;
  isReschedule: boolean;
  rescheduleCount: number;
  type: 'regular' | 'departure' | 'catchup';
}

export type ReminderResponse = 'taken' | 'snooze' | 'skip';

export interface MissedDoseResult {
  action: 'reschedule' | 'expired';
  suggestedTime?: string;
  windowEnd?: string;
  remainingMinutes?: number;
  message: string;
}

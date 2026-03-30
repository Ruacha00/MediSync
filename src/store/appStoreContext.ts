import { createContext } from 'react';
import type { Patient, Medication, Reminder } from '@/types';
import { patients } from '@/data/patients';

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  icon: 'pill' | 'clock' | 'alert' | 'calendar';
  color: string;
  reminderId?: string;
  timestamp: string;
}

export interface DepartureReminderBanner {
  eventTitle: string;
  eventTime: string;
  medicationName: string;
}

export interface AppState {
  currentPatient: Patient;
  patients: Patient[];
  reminders: Reminder[];
  onboardingCompleted: boolean;
  calendarConnected: boolean;
  notifications: PushNotification[];
  departureReminderBanner: DepartureReminderBanner | null;
  pushNotificationsEnabled: boolean;
  departureRemindersEnabled: boolean;
  aiTimingEnabled: boolean;
  setCurrentPatient: (p: Patient | ((prev: Patient) => Patient)) => void;
  updateReminderStatus: (id: string, status: Reminder['status']) => void;
  setOnboardingCompleted: (v: boolean) => void;
  setCalendarConnected: (v: boolean) => void;
  setReminders: (r: Reminder[]) => void;
  addMedication: (med: Medication) => void;
  pushNotification: (n: PushNotification) => void;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
  showDepartureReminderBanner: (banner: DepartureReminderBanner) => void;
  clearDepartureReminderBanner: () => void;
  setPushNotificationsEnabled: (v: boolean) => void;
  setDepartureRemindersEnabled: (v: boolean) => void;
  setAiTimingEnabled: (v: boolean) => void;
  resetToDefaults: () => void;
}

const timingByPrescription: Record<Medication['prescribedTime'], string[]> = {
  morning: ['7:30 AM'],
  evening: ['6:30 PM'],
  twice_daily: ['9:00 AM', '6:30 PM'],
};

const statusPatternByRisk: Record<Patient['riskLevel'], Reminder['status'][]> = {
  low: ['taken', 'pending', 'taken'],
  medium: ['taken', 'snoozed', 'pending'],
  high: ['missed', 'pending', 'skipped'],
};

function createReminder(patient: Patient, medication: Medication, scheduledTime: string, index: number): Reminder {
  const status =
    patient.id === 'p-001'
      ? scheduledTime === '7:30 AM'
        ? 'taken'
        : 'pending'
      : statusPatternByRisk[patient.riskLevel][index % statusPatternByRisk[patient.riskLevel].length];
  const confidence = Math.max(0.72, Math.min(0.94, patient.adherenceRate / 100 - index * 0.03));
  const respondedAt =
    status === 'pending'
      ? undefined
      : patient.id === 'p-001' && status === 'taken'
      ? new Date(
          2026,
          2,
          27,
          7,
          42,
        ).toISOString()
      : new Date(2026, 2, 27, 8 + (index % 8), 15).toISOString();

  return {
    id: `rem-${patient.id}-${medication.id}-${index + 1}`,
    medicationId: medication.id,
    patientId: patient.id,
    scheduledTime,
    originalPrescribedTime: scheduledTime,
    status,
    respondedAt,
    aiReason:
      status === 'missed'
        ? `This dose was not confirmed earlier. AI is highlighting ${medication.name} now to support timely follow-up.`
        : status === 'snoozed'
        ? `This dose was delayed earlier. AI is holding ${medication.name} for a more suitable reminder window.`
        : `AI scheduled ${medication.name} at ${scheduledTime} based on recent adherence timing and dosing preferences.`,
    aiConfidence: Number(confidence.toFixed(2)),
    isReschedule: status === 'snoozed',
    rescheduleCount: status === 'snoozed' ? 1 : 0,
    type: status === 'missed' ? 'catchup' : 'regular',
  };
}

function createInitialReminders() {
  return patients.flatMap((patient) =>
    patient.medications.flatMap((medication, medicationIndex) =>
      timingByPrescription[medication.prescribedTime].map((scheduledTime, timeIndex) =>
        createReminder(patient, medication, scheduledTime, medicationIndex + timeIndex),
      ),
    ),
  );
}

export const initialReminders: Reminder[] = createInitialReminders();

export const AppContext = createContext<AppState | null>(null);

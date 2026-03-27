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

export interface AppState {
  currentPatient: Patient;
  patients: Patient[];
  reminders: Reminder[];
  onboardingCompleted: boolean;
  calendarConnected: boolean;
  notifications: PushNotification[];
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
  setPushNotificationsEnabled: (v: boolean) => void;
  setDepartureRemindersEnabled: (v: boolean) => void;
  setAiTimingEnabled: (v: boolean) => void;
  resetToDefaults: () => void;
}

const timingByPrescription: Record<Medication['prescribedTime'], string[]> = {
  morning: ['7:30 AM'],
  evening: ['7:45 PM'],
  twice_daily: ['8:00 AM', '8:00 PM'],
};

const statusPatternByRisk: Record<Patient['riskLevel'], Reminder['status'][]> = {
  low: ['taken', 'pending', 'taken'],
  medium: ['taken', 'snoozed', 'pending'],
  high: ['missed', 'pending', 'skipped'],
};

function createReminder(patient: Patient, medication: Medication, scheduledTime: string, index: number): Reminder {
  const status = statusPatternByRisk[patient.riskLevel][index % statusPatternByRisk[patient.riskLevel].length];
  const confidence = Math.max(0.72, Math.min(0.94, patient.adherenceRate / 100 - index * 0.03));
  const respondedAt =
    status === 'pending'
      ? undefined
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
        ? `${patient.name} missed this dose earlier today. AI recommends closer monitoring for ${medication.name}.`
        : status === 'snoozed'
        ? `${patient.name} delayed this dose. AI is holding the reminder until a more convenient time.`
        : `AI scheduled ${medication.name} at ${scheduledTime} based on ${patient.name}'s recent routine.`,
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

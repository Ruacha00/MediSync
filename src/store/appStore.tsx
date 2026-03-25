import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Patient, Reminder } from '@/types';
import { patients as allPatients, currentPatient as defaultPatient } from '@/data/patients';

interface AppState {
  currentPatient: Patient;
  patients: Patient[];
  reminders: Reminder[];
  onboardingCompleted: boolean;
  calendarConnected: boolean;
  setCurrentPatient: (p: Patient) => void;
  updateReminderStatus: (id: string, status: Reminder['status']) => void;
  setOnboardingCompleted: (v: boolean) => void;
  setCalendarConnected: (v: boolean) => void;
  setReminders: (r: Reminder[]) => void;
}

const AppContext = createContext<AppState | null>(null);

const initialReminders: Reminder[] = [
  {
    id: 'rem-001',
    medicationId: 'med-001',
    patientId: 'p-001',
    scheduledTime: '7:30 AM',
    originalPrescribedTime: '8:00 AM',
    status: 'pending',
    aiReason: 'Your morning medication success rate is highest between 7:30-8:30 AM, right after your usual wake-up time.',
    aiConfidence: 0.91,
    isReschedule: false,
    rescheduleCount: 0,
    type: 'regular',
  },
  {
    id: 'rem-002',
    medicationId: 'med-002',
    patientId: 'p-001',
    scheduledTime: '8:00 AM',
    originalPrescribedTime: '8:00 AM',
    status: 'pending',
    aiReason: 'Based on your past 2 weeks, you usually take Metformin with breakfast around 8:00 AM.',
    aiConfidence: 0.89,
    isReschedule: false,
    rescheduleCount: 0,
    type: 'regular',
  },
  {
    id: 'rem-003',
    medicationId: 'med-002',
    patientId: 'p-001',
    scheduledTime: '7:45 PM',
    originalPrescribedTime: '8:00 PM',
    status: 'pending',
    aiReason: 'You tend to take evening medications most reliably around 7:45 PM, right after dinner.',
    aiConfidence: 0.87,
    isReschedule: false,
    rescheduleCount: 0,
    type: 'regular',
  },
  {
    id: 'rem-004',
    medicationId: 'med-001',
    patientId: 'p-001',
    scheduledTime: '11:30 AM',
    originalPrescribedTime: '8:00 AM',
    status: 'missed',
    aiReason: 'Originally scheduled at 8:00 AM. You\'re still within the safe catch-up window (until 12:00 PM). Take it now for best results.',
    aiConfidence: 0.78,
    isReschedule: true,
    rescheduleCount: 1,
    type: 'catchup',
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPatient, setCurrentPatient] = useState<Patient>(defaultPatient);
  const [patients] = useState<Patient[]>(allPatients);
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [onboardingCompleted, setOnboardingCompleted] = useState(true);
  const [calendarConnected, setCalendarConnected] = useState(true);

  const updateReminderStatus = useCallback((id: string, status: Reminder['status']) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, respondedAt: new Date().toISOString() } : r)),
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentPatient,
        patients,
        reminders,
        onboardingCompleted,
        calendarConnected,
        setCurrentPatient,
        updateReminderStatus,
        setOnboardingCompleted,
        setCalendarConnected,
        setReminders,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used within AppProvider');
  return ctx;
}

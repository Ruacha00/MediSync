import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Patient, Reminder } from '@/types';
import { patients as allPatients, currentPatient as defaultPatient } from '@/data/patients';

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  icon: 'pill' | 'clock' | 'alert' | 'calendar';
  color: string;
  reminderId?: string;
  timestamp: string;
}

interface AppState {
  currentPatient: Patient;
  patients: Patient[];
  reminders: Reminder[];
  onboardingCompleted: boolean;
  calendarConnected: boolean;
  notifications: PushNotification[];
  setCurrentPatient: (p: Patient) => void;
  updateReminderStatus: (id: string, status: Reminder['status']) => void;
  setOnboardingCompleted: (v: boolean) => void;
  setCalendarConnected: (v: boolean) => void;
  setReminders: (r: Reminder[]) => void;
  pushNotification: (n: PushNotification) => void;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
}

const AppContext = createContext<AppState | null>(null);

export const initialReminders: Reminder[] = [
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
    medicationId: 'med-003',
    patientId: 'p-001',
    scheduledTime: '9:00 PM',
    originalPrescribedTime: '9:00 PM',
    status: 'pending',
    aiReason: 'Warfarin is best taken at a consistent time each evening. 9:00 PM aligns with your nightly routine.',
    aiConfidence: 0.93,
    isReschedule: false,
    rescheduleCount: 0,
    type: 'regular',
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPatient, setCurrentPatient] = useState<Patient>(defaultPatient);
  const [patients] = useState<Patient[]>(allPatients);
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [onboardingCompleted, setOnboardingCompleted] = useState(true);
  const [calendarConnected, setCalendarConnected] = useState(true);
  const [notifications, setNotifications] = useState<PushNotification[]>([]);

  const updateReminderStatus = useCallback((id: string, status: Reminder['status']) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, respondedAt: new Date().toISOString() } : r)),
    );
  }, []);

  const pushNotification = useCallback((n: PushNotification) => {
    setNotifications((prev) => [n, ...prev]);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentPatient,
        patients,
        reminders,
        onboardingCompleted,
        calendarConnected,
        notifications,
        setCurrentPatient,
        updateReminderStatus,
        setOnboardingCompleted,
        setCalendarConnected,
        setReminders,
        pushNotification,
        dismissNotification,
        clearNotifications,
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

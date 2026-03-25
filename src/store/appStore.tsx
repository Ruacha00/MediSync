import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Patient, Medication, Reminder } from '@/types';
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
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [departureRemindersEnabled, setDepartureRemindersEnabled] = useState(true);
  const [aiTimingEnabled, setAiTimingEnabled] = useState(true);

  const updateReminderStatus = useCallback((id: string, status: Reminder['status']) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, respondedAt: new Date().toISOString() } : r)),
    );
  }, []);

  const addMedication = useCallback((med: Medication) => {
    setCurrentPatient((prev) => ({
      ...prev,
      medications: [...prev.medications, med],
    }));
    // Also create a pending reminder for this medication
    const timeLabel =
      med.prescribedTime === 'morning' ? '8:00 AM' :
      med.prescribedTime === 'evening' ? '8:00 PM' : '8:00 AM';
    const newReminder: Reminder = {
      id: `rem-${med.id}-${Date.now()}`,
      medicationId: med.id,
      patientId: 'p-001',
      scheduledTime: timeLabel,
      originalPrescribedTime: timeLabel,
      status: 'pending',
      aiReason: `${med.name} has been added to your regimen. AI will learn your routine and optimize timing over the next few days.`,
      aiConfidence: 0.75,
      isReschedule: false,
      rescheduleCount: 0,
      type: 'regular',
    };
    setReminders((prev) => [...prev, newReminder]);
    if (med.prescribedTime === 'twice_daily') {
      const eveningReminder: Reminder = {
        ...newReminder,
        id: `rem-${med.id}-eve-${Date.now()}`,
        scheduledTime: '8:00 PM',
        originalPrescribedTime: '8:00 PM',
        aiReason: `Evening dose of ${med.name}. AI will adjust timing based on your dinner habits.`,
      };
      setReminders((prev) => [...prev, eveningReminder]);
    }
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

  const resetToDefaults = useCallback(() => {
    setCurrentPatient(defaultPatient);
    setReminders(initialReminders.map((r) => ({ ...r })));
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
        pushNotificationsEnabled,
        departureRemindersEnabled,
        aiTimingEnabled,
        setCurrentPatient,
        updateReminderStatus,
        setOnboardingCompleted,
        setCalendarConnected,
        setReminders,
        addMedication,
        pushNotification,
        dismissNotification,
        clearNotifications,
        setPushNotificationsEnabled,
        setDepartureRemindersEnabled,
        setAiTimingEnabled,
        resetToDefaults,
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

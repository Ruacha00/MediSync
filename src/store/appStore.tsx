import { useState, useCallback, type ReactNode } from 'react';
import type { Patient, Medication, Reminder } from '@/types';
import { patients as allPatients, currentPatient as defaultPatient } from '@/data/patients';
import { AppContext, initialReminders, type PushNotification } from './appStoreContext';

function clonePatient(patient: Patient): Patient {
  return {
    ...patient,
    conditions: [...patient.conditions],
    medications: [...patient.medications],
  };
}

function createInitialPatients(): Patient[] {
  return allPatients.map(clonePatient);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(createInitialPatients);
  const [currentPatient, setCurrentPatientState] = useState<Patient>(() => clonePatient(defaultPatient));
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [onboardingCompleted, setOnboardingCompleted] = useState(true);
  const [calendarConnected, setCalendarConnected] = useState(true);
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [departureRemindersEnabled, setDepartureRemindersEnabled] = useState(true);
  const [aiTimingEnabled, setAiTimingEnabled] = useState(true);

  const setCurrentPatient = useCallback((nextPatient: Patient | ((prev: Patient) => Patient)) => {
    setCurrentPatientState((prev) => {
      const resolvedPatient = typeof nextPatient === 'function' ? nextPatient(prev) : nextPatient;
      setPatients((prevPatients) =>
        prevPatients.map((patient) => (patient.id === resolvedPatient.id ? clonePatient(resolvedPatient) : patient)),
      );
      return clonePatient(resolvedPatient);
    });
  }, []);

  const updateReminderStatus = useCallback((id: string, status: Reminder['status']) => {
    const respondedAt = new Date().toISOString();
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, respondedAt } : r)),
    );
  }, []);

  const addMedication = useCallback((med: Medication) => {
    const patientId = currentPatient.id;

    setCurrentPatient((prevPatient) => {
      if (prevPatient.medications.some((existingMedication) => existingMedication.id === med.id)) {
        return prevPatient;
      }

      return {
        ...prevPatient,
        medications: [...prevPatient.medications, med],
      };
    });

    const timeLabel =
      med.prescribedTime === 'morning' ? '8:00 AM' :
      med.prescribedTime === 'evening' ? '6:30 PM' : '8:00 AM';
    const newReminders: Reminder[] = [{
      id: `rem-${med.id}-${Date.now()}`,
      medicationId: med.id,
      patientId,
      scheduledTime: timeLabel,
      originalPrescribedTime: timeLabel,
      status: 'pending',
      aiReason: `${med.name} has been added to your regimen. AI will adapt reminder timing over the next few days based on response patterns and dosing windows.`,
      aiConfidence: 0.75,
      isReschedule: false,
      rescheduleCount: 0,
      type: 'regular',
    }];
    if (med.prescribedTime === 'twice_daily') {
      newReminders.push({
        ...newReminders[0],
        id: `rem-${med.id}-eve-${Date.now()}`,
        scheduledTime: '6:30 PM',
        originalPrescribedTime: '6:30 PM',
        aiReason: `Evening dose of ${med.name}. AI may refine the reminder time as it learns the most reliable evening dosing window.`,
      });
    }
    setReminders((prev) => {
      if (prev.some((reminder) => reminder.patientId === patientId && reminder.medicationId === med.id)) {
        return prev;
      }

      return [...prev, ...newReminders];
    });
  }, [currentPatient.id, setCurrentPatient]);

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
    const initialPatients = createInitialPatients();
    setPatients(initialPatients);
    setCurrentPatientState(clonePatient(defaultPatient));
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

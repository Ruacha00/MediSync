import { useState } from 'react';
import { Bell, Clock, AlertTriangle, Calendar, Zap, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppStore, type PushNotification, initialReminders } from '@/store/appStore';
import { medicationDatabase } from '@/data/medications';
import { calendarEvents } from '@/data/calendarEvents';
import type { Reminder } from '@/types';

let notifCounter = 0;
function nextId(prefix = 'notif') {
  return `${prefix}-${++notifCounter}-${Date.now()}`;
}

function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function DemoControlPanel() {
  const { pushNotification, clearNotifications, reminders, setReminders } = useAppStore();
  const [collapsed, setCollapsed] = useState(false);

  const activeMeds = medicationDatabase.slice(0, 3);
  const departureEvent = calendarEvents.find((e) => e.isOutdoor);

  // --- Trigger: send notification for a medication + ensure a pending reminder exists ---
  const triggerMedReminder = (medId: string) => {
    const med = medicationDatabase.find((m) => m.id === medId);
    if (!med) return;

    const existing = reminders.find((r) => r.medicationId === medId && r.status === 'pending');
    if (!existing) {
      // Create a new pending reminder card on the home page
      const newReminder: Reminder = {
        id: nextId('rem'),
        medicationId: medId,
        patientId: 'p-001',
        scheduledTime: nowTime(),
        originalPrescribedTime: med.prescribedTime === 'morning' ? '8:00 AM' : '8:00 PM',
        status: 'pending',
        aiReason: `AI detected this is a good time to take ${med.name} based on your current activity pattern.`,
        aiConfidence: 0.85,
        isReschedule: false,
        rescheduleCount: 0,
        type: 'regular',
      };
      setReminders([...reminders, newReminder]);
    }

    const n: PushNotification = {
      id: nextId(),
      title: `Time to take ${med.name}`,
      body: `${med.dosage} - ${med.category}. Tap to respond.`,
      icon: 'pill',
      color: med.color,
      timestamp: nowTime(),
    };
    pushNotification(n);
  };

  // --- Trigger: change a pending reminder to 'missed' status ---
  const triggerMissedDose = () => {
    const pendingReminder = reminders.find((r) => r.status === 'pending');
    if (!pendingReminder) return;

    const med = medicationDatabase.find((m) => m.id === pendingReminder.medicationId);
    if (!med) return;

    setReminders(
      reminders.map((r) =>
        r.id === pendingReminder.id
          ? {
              ...r,
              status: 'missed' as const,
              type: 'catchup' as const,
              isReschedule: true,
              rescheduleCount: r.rescheduleCount + 1,
              aiReason: `Originally scheduled at ${r.scheduledTime}. You're still within the safe catch-up window (${med.safetyWindowHours}h). AI suggests taking it now.`,
              aiConfidence: 0.78,
            }
          : r,
      ),
    );

    pushNotification({
      id: nextId(),
      title: `Missed: ${med.name}`,
      body: `You missed your ${med.dosage} dose. Safe window: ${med.safetyWindowHours}h. Take it now?`,
      icon: 'alert',
      color: '#F59E0B',
      timestamp: nowTime(),
    });
  };

  // --- Trigger: add a departure-type reminder ---
  const triggerDepartureReminder = () => {
    if (!departureEvent) return;

    // Find a pending med to associate the departure reminder with
    const pendingReminder = reminders.find((r) => r.status === 'pending');
    const medId = pendingReminder?.medicationId || 'med-001';
    const med = medicationDatabase.find((m) => m.id === medId);
    if (!med) return;

    const alreadyHasDeparture = reminders.some((r) => r.type === 'departure' && (r.status === 'pending' || r.status === 'snoozed'));
    if (!alreadyHasDeparture) {
      const newReminder: Reminder = {
        id: nextId('rem'),
        medicationId: medId,
        patientId: 'p-001',
        scheduledTime: nowTime(),
        originalPrescribedTime: med.prescribedTime === 'morning' ? '8:00 AM' : '8:00 PM',
        status: 'pending',
        aiReason: `You have "${departureEvent.title}" coming up. Take ${med.name} before you leave to stay on schedule.`,
        aiConfidence: 0.92,
        isReschedule: false,
        rescheduleCount: 0,
        type: 'departure',
      };
      setReminders([...reminders, newReminder]);
    }

    pushNotification({
      id: nextId(),
      title: 'Departure Reminder',
      body: `"${departureEvent.title}" starts soon. Take your medication before leaving!`,
      icon: 'calendar',
      color: '#F59E0B',
      timestamp: nowTime(),
    });
  };

  // --- Trigger: re-surface a snoozed reminder back to pending ---
  const triggerSnoozeReturn = () => {
    const snoozedReminder = reminders.find((r) => r.status === 'snoozed');
    if (!snoozedReminder) return;

    const med = medicationDatabase.find((m) => m.id === snoozedReminder.medicationId);
    if (!med) return;

    setReminders(
      reminders.map((r) =>
        r.id === snoozedReminder.id
          ? {
              ...r,
              status: 'pending' as const,
              scheduledTime: nowTime(),
              aiReason: `You snoozed this earlier. It's been 30 minutes - taking ${med.name} now still fits your schedule.`,
              aiConfidence: 0.82,
            }
          : r,
      ),
    );

    pushNotification({
      id: nextId(),
      title: `Reminder: ${med.name}`,
      body: `You snoozed this 30 min ago. Time to take your ${med.dosage}.`,
      icon: 'clock',
      color: med.color,
      timestamp: nowTime(),
    });
  };

  // --- Trigger: AI reschedule - modify a pending reminder's time ---
  const triggerAIReschedule = () => {
    const pendingReminder = reminders.find((r) => r.status === 'pending' && r.type === 'regular');
    if (!pendingReminder) return;

    const med = medicationDatabase.find((m) => m.id === pendingReminder.medicationId);
    if (!med) return;

    const newTime = '5:15 PM';
    setReminders(
      reminders.map((r) =>
        r.id === pendingReminder.id
          ? {
              ...r,
              scheduledTime: newTime,
              isReschedule: true,
              rescheduleCount: r.rescheduleCount + 1,
              aiReason: `AI detected you're in a meeting until 5:00 PM. Rescheduled ${med.name} to ${newTime} so you won't be interrupted.`,
              aiConfidence: 0.88,
            }
          : r,
      ),
    );

    pushNotification({
      id: nextId(),
      title: `Smart Reschedule: ${med.name}`,
      body: `AI detected a meeting conflict. Moved to ${newTime}.`,
      icon: 'clock',
      color: '#6366F1',
      timestamp: nowTime(),
    });
  };

  // --- Reset everything ---
  const resetAllReminders = () => {
    setReminders(initialReminders.map((r) => ({ ...r })));
    clearNotifications();
  };

  // Compute states for button hints
  const pendingCount = reminders.filter((r) => r.status === 'pending').length;
  const snoozedCount = reminders.filter((r) => r.status === 'snoozed').length;
  const hasDeparture = reminders.some((r) => r.type === 'departure' && (r.status === 'pending' || r.status === 'snoozed'));

  return (
    <div className="w-72 bg-gray-900 text-white rounded-2xl shadow-2xl overflow-hidden select-none">
      {/* Header */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-750 transition-colors"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-semibold">Demo Control Panel</span>
        </div>
        {collapsed ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
      </button>

      {!collapsed && (
        <div className="p-4 space-y-4">
          {/* Medication reminders */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-2 font-semibold">Send Reminder</p>
            <div className="space-y-1.5">
              {activeMeds.map((med) => {
                const medReminders = reminders.filter((r) => r.medicationId === med.id);
                const pendingR = medReminders.find((r) => r.status === 'pending');
                const snoozedR = medReminders.find((r) => r.status === 'snoozed');
                const statusLabel = pendingR ? 'pending' : snoozedR ? 'snoozed' : null;
                const statusColor = pendingR ? 'text-amber-400 bg-amber-400/10' : 'text-blue-400 bg-blue-400/10';
                return (
                  <button
                    key={med.id}
                    onClick={() => triggerMedReminder(med.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-left group"
                  >
                    <Bell className="w-3.5 h-3.5 text-gray-500 group-hover:text-amber-400 transition-colors" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{med.name}</p>
                      <p className="text-[10px] text-gray-500">{med.dosage}</p>
                    </div>
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: med.color }} />
                    {statusLabel && (
                      <span className={`text-[9px] ${statusColor} px-1.5 py-0.5 rounded-full`}>{statusLabel}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scenario triggers */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-2 font-semibold">Scenarios</p>
            <div className="space-y-1.5">
              <button
                onClick={triggerMissedDose}
                disabled={pendingCount === 0}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-left group disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-gray-500 group-hover:text-red-400 transition-colors" />
                <div className="flex-1">
                  <p className="text-xs font-medium">Missed Dose Alert</p>
                  <p className="text-[10px] text-gray-500">Change a pending reminder to missed</p>
                </div>
                {pendingCount > 0 && (
                  <span className="text-[9px] text-gray-500">{pendingCount} pending</span>
                )}
              </button>

              <button
                onClick={triggerDepartureReminder}
                disabled={hasDeparture}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-left group disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Calendar className="w-3.5 h-3.5 text-gray-500 group-hover:text-amber-400 transition-colors" />
                <div className="flex-1">
                  <p className="text-xs font-medium">Departure Reminder</p>
                  <p className="text-[10px] text-gray-500">Add departure reminder card</p>
                </div>
              </button>

              <button
                onClick={triggerSnoozeReturn}
                disabled={snoozedCount === 0}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-left group disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Clock className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                <div className="flex-1">
                  <p className="text-xs font-medium">Snooze Follow-up</p>
                  <p className="text-[10px] text-gray-500">Re-surface a snoozed reminder</p>
                </div>
                {snoozedCount > 0 && (
                  <span className="text-[9px] text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded-full">{snoozedCount} snoozed</span>
                )}
              </button>

              <button
                onClick={triggerAIReschedule}
                disabled={pendingCount === 0}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-left group disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Zap className="w-3.5 h-3.5 text-gray-500 group-hover:text-indigo-400 transition-colors" />
                <div className="flex-1">
                  <p className="text-xs font-medium">AI Smart Reschedule</p>
                  <p className="text-[10px] text-gray-500">Change a reminder's time</p>
                </div>
              </button>
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={resetAllReminders}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors text-xs text-gray-400 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Reminders
          </button>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Calendar, ChevronDown, ChevronUp, Check, Clock, X, AlertTriangle, Sparkles, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/store/useAppStore';
import { calendarEvents } from '@/data/calendarEvents';
import type { Reminder } from '@/types';

function ReminderCard({ reminder, onRespond }: { reminder: Reminder; onRespond: (id: string, status: Reminder['status']) => void }) {
  const { currentPatient } = useAppStore();
  const [showAI, setShowAI] = useState(false);
  const [animatingTaken, setAnimatingTaken] = useState(false);
  const med = currentPatient.medications.find((m) => m.id === reminder.medicationId);
  if (!med) return null;

  const isTaken = reminder.status === 'taken';
  const isSkipped = reminder.status === 'skipped';
  const isMissed = reminder.status === 'missed';
  const isExpired = reminder.status === 'expired';
  const isSnoozed = reminder.status === 'snoozed';
  const isDone = isTaken || isSkipped || isExpired;

  const handleTaken = () => {
    setAnimatingTaken(true);
    setTimeout(() => onRespond(reminder.id, 'taken'), 600);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-4 transition-all ${
        isTaken ? 'bg-health-50 border-health-200' :
        isMissed ? 'bg-amber-50 border-amber-200' :
        isExpired ? 'bg-red-50 border-red-200' :
        isSnoozed ? 'bg-blue-50 border-blue-200 opacity-75' :
        isSkipped ? 'bg-gray-50 border-gray-200 opacity-60' :
        'bg-white border-gray-100 shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Medication color dot */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: `${med.color}15` }}
        >
          {animatingTaken || isTaken ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Check className="w-5 h-5 text-health-500" />
            </motion.div>
          ) : (
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: med.color }} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-sm text-gray-900">{med.name}</h3>
            {reminder.type === 'catchup' && (
              <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 text-[10px]">
                Catch-up
              </Badge>
            )}
            {reminder.type === 'departure' && (
              <Badge variant="outline" className="text-medical-600 border-medical-200 bg-medical-50 text-[10px]">
                <MapPin className="w-3 h-3 mr-0.5" /> Departure
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-2">
            {med.dosage} &middot; {med.category}
          </p>

          {/* AI-selected time */}
          <div className="flex items-center gap-1.5 mb-3">
            <Clock className="w-3.5 h-3.5 text-medical-500" />
            <span className="text-xs font-medium text-gray-700">{reminder.scheduledTime}</span>
            <span className="text-[10px] text-gray-400">
              &middot; {Math.round(reminder.aiConfidence * 100)}% confidence
            </span>
          </div>

          {/* AI Explanation toggle */}
          {!isDone && (
            <button
              onClick={() => setShowAI(!showAI)}
              className="flex items-center gap-1 text-[11px] text-medical-500 hover:text-medical-700 transition-colors mb-3"
            >
              <Sparkles className="w-3 h-3" />
              Why this time?
              {showAI ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}

          <AnimatePresence>
            {showAI && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-medical-50 rounded-lg p-3 mb-3 text-xs text-medical-700 leading-relaxed">
                  <Sparkles className="w-3.5 h-3.5 inline mr-1 text-medical-400" />
                  {reminder.aiReason}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Missed dose safety window */}
          {isMissed && (
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-medium text-amber-700">Missed Dose</span>
              </div>
              <p className="text-[11px] text-amber-600 mb-2">
                Safe catch-up window: {med.safetyWindowHours}h from original time.
                AI suggests taking it at {reminder.scheduledTime}.
              </p>
              <div className="flex gap-2">
                <Button size="sm" className="h-7 text-xs bg-amber-500 hover:bg-amber-600" onClick={handleTaken}>
                  Take Now
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs border-amber-200 text-amber-600" onClick={() => onRespond(reminder.id, 'snoozed')}>
                  Remind Later
                </Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs text-gray-400" onClick={() => onRespond(reminder.id, 'skipped')}>
                  Skip
                </Button>
              </div>
            </div>
          )}

          {/* Snoozed state */}
          {isSnoozed && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-xs font-medium text-blue-700">Snoozed</span>
              </div>
              <p className="text-[11px] text-blue-600 mt-1">
                You chose to take this later. We'll remind you again soon.
              </p>
            </div>
          )}

          {/* Response buttons */}
          {!isDone && !isMissed && !isSnoozed && (
            <div className="flex gap-2">
              <Button
                size="sm"
                className="h-8 text-xs bg-health-500 hover:bg-health-600 flex-1"
                onClick={handleTaken}
              >
                <Check className="w-3.5 h-3.5 mr-1" /> Taken
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs border-amber-200 text-amber-600 hover:bg-amber-50"
                onClick={() => onRespond(reminder.id, 'snoozed')}
              >
                <Clock className="w-3.5 h-3.5 mr-1" /> Later
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-xs text-gray-400 hover:text-gray-600"
                onClick={() => onRespond(reminder.id, 'skipped')}
              >
                <X className="w-3.5 h-3.5 mr-1" /> Skip
              </Button>
            </div>
          )}

          {/* Done states */}
          {isTaken && (
            <p className="text-xs text-health-600 font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Taken {reminder.respondedAt ? 'just now' : ''}
            </p>
          )}
          {isSkipped && (
            <p className="text-xs text-gray-400 font-medium">Skipped</p>
          )}
          {isExpired && (
            <p className="text-xs text-red-500 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Window expired — auto skipped
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function HomePage() {
  const { currentPatient, reminders, updateReminderStatus, departureRemindersEnabled } = useAppStore();
  const activeMedicationIds = new Set(currentPatient.medications.map((medication) => medication.id));

  const todayReminders = reminders.filter(
    (reminder) => reminder.patientId === currentPatient.id && activeMedicationIds.has(reminder.medicationId),
  );
  const takenCount = todayReminders.filter((r) => r.status === 'taken').length;
  const totalCount = todayReminders.length;
  const progressPercent = totalCount > 0 ? (takenCount / totalCount) * 100 : 0;

  const departureEvent = calendarEvents.find((e) => e.isOutdoor);

  return (
    <div className="px-5 pt-6">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <p className="text-sm text-gray-400 mb-1">Good morning,</p>
        <h1 className="text-2xl font-bold text-gray-900">{currentPatient.name.split(' ')[0]}</h1>
      </motion.div>

      {/* Today's progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-medical-500 to-medical-600 rounded-2xl p-5 mb-6 text-white"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-medical-100">Today's Progress</p>
            <p className="text-2xl font-bold">{takenCount}/{totalCount} doses</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
        </div>
        <Progress value={progressPercent} className="h-2 bg-white/20 [&>div]:bg-white" />
      </motion.div>

      {/* Departure reminder */}
      {departureEvent && departureRemindersEnabled && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold text-amber-700">Departure Reminder</span>
          </div>
          <p className="text-sm text-amber-800">
            You have <span className="font-semibold">"{departureEvent.title}"</span> at{' '}
            {new Date(departureEvent.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}.
            Remember to take your medication before leaving!
          </p>
        </motion.div>
      )}

      {/* Reminders list */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Today's Reminders</h2>
        <div className="space-y-3">
          {todayReminders.map((reminder, i) => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
            >
              <ReminderCard
                reminder={reminder}
                onRespond={updateReminderStatus}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

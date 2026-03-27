import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, CheckCircle2, Clock3, AlertTriangle, MinusCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/store/useAppStore';
import { adherenceHistoryByPatient } from '@/data/adherenceHistory';
import { medicationDatabase } from '@/data/medications';

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { patients, reminders } = useAppStore();
  const patient = patients.find((p) => p.id === id);
  const history = adherenceHistoryByPatient[id || ''] || [];
  const patientReminders = reminders.filter((reminder) => reminder.patientId === id);

  if (!patient) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Patient not found</p>
        <Link to="/dashboard" className="text-medical-500 text-sm mt-2 inline-block">Back to Dashboard</Link>
      </div>
    );
  }

  const recentHistory = history.slice(-7);
  const baselineAvg = Math.round(history.slice(0, 14).reduce((s, d) => s + d.adherenceRate, 0) / 14);
  const currentAvg = Math.round(history.slice(14).reduce((s, d) => s + d.adherenceRate, 0) / Math.max(1, history.slice(14).length));
  const takenToday = patientReminders.filter((reminder) => reminder.status === 'taken').length;
  const pendingToday = patientReminders.filter((reminder) => reminder.status === 'pending').length;
  const attentionToday = patientReminders.filter((reminder) => ['missed', 'snoozed', 'expired'].includes(reminder.status)).length;
  const recentReminderActivity = patientReminders
    .filter((reminder) => reminder.respondedAt)
    .sort((a, b) => new Date(b.respondedAt ?? 0).getTime() - new Date(a.respondedAt ?? 0).getTime());

  const statusConfig = {
    taken: {
      label: 'Taken',
      icon: CheckCircle2,
      tone: 'bg-health-50 text-health-700 border-health-100',
    },
    pending: {
      label: 'Pending',
      icon: Clock3,
      tone: 'bg-blue-50 text-blue-700 border-blue-100',
    },
    snoozed: {
      label: 'Snoozed',
      icon: Clock3,
      tone: 'bg-amber-50 text-amber-700 border-amber-100',
    },
    missed: {
      label: 'Missed',
      icon: AlertTriangle,
      tone: 'bg-red-50 text-red-700 border-red-100',
    },
    expired: {
      label: 'Expired',
      icon: AlertTriangle,
      tone: 'bg-red-50 text-red-700 border-red-100',
    },
    skipped: {
      label: 'Skipped',
      icon: MinusCircle,
      tone: 'bg-gray-50 text-gray-700 border-gray-200',
    },
  } as const;

  return (
    <div>
      <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-100 p-6 mb-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
            patient.riskLevel === 'high' ? 'bg-red-100' : 'bg-medical-100'
          }`}>
            <span className={`font-bold text-lg ${
              patient.riskLevel === 'high' ? 'text-red-600' : 'text-medical-600'
            }`}>{patient.avatar}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">{patient.name}</h1>
              <Badge className={`text-[10px] ${
                patient.riskLevel === 'low' ? 'bg-health-100 text-health-700' :
                patient.riskLevel === 'medium' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {patient.riskLevel} risk
              </Badge>
            </div>
            <p className="text-sm text-gray-500">{patient.age} y/o &middot; {patient.gender} &middot; {patient.conditions.join(', ')}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold text-gray-900">{patient.adherenceRate}%</p>
            <p className="text-[10px] text-gray-400">30-Day Rate</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold text-gray-900">{patient.medications.length}</p>
            <p className="text-[10px] text-gray-400">Medications</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold text-gray-900">{patient.consecutiveMissed}</p>
            <p className="text-[10px] text-gray-400">Consec. Missed</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold text-health-600">+{currentAvg - baselineAvg}%</p>
            <p className="text-[10px] text-gray-400">Improvement</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-100 p-5"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-4">30-Day Adherence Trend</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorDetail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}
                  formatter={(value) => [`${value}%`, 'Adherence']}
                />
                <Area type="monotone" dataKey="adherenceRate" stroke="#3B82F6" fillOpacity={1} fill="url(#colorDetail)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-100 p-5"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Medications</h3>
          <div className="space-y-3">
            {patient.medications.map((med) => (
              <div key={med.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${med.color}15` }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: med.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{med.name}</p>
                  <p className="text-xs text-gray-400">{med.dosage} &middot; {med.frequency}</p>
                </div>
                <Badge variant="outline" className="text-[10px]">{med.category}</Badge>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-xl border border-gray-100 p-5 mt-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Today's Live Medication Status</h3>
            <p className="text-xs text-gray-400">Updates immediately when the patient responds in the mobile app</p>
          </div>
          <Badge variant="outline" className="text-[10px] border-medical-200 text-medical-600 bg-medical-50">
            Live sync
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg bg-health-50 p-3">
            <p className="text-lg font-bold text-health-700">{takenToday}</p>
            <p className="text-[11px] text-health-600">Taken today</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-3">
            <p className="text-lg font-bold text-blue-700">{pendingToday}</p>
            <p className="text-[11px] text-blue-600">Still pending</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-3">
            <p className="text-lg font-bold text-amber-700">{attentionToday}</p>
            <p className="text-[11px] text-amber-600">Need attention</p>
          </div>
        </div>

        <div className="space-y-3">
          {patientReminders.map((reminder) => {
            const medication =
              patient.medications.find((med) => med.id === reminder.medicationId) ||
              medicationDatabase.find((med) => med.id === reminder.medicationId);
            if (!medication) return null;

            const config = statusConfig[reminder.status];
            const Icon = config.icon;

            return (
              <div key={reminder.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${medication.color}15` }}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: medication.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{medication.name}</p>
                    <p className="text-[11px] text-gray-400">
                      {reminder.scheduledTime} &middot; {medication.dosage}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${config.tone}`}>
                    <Icon className="w-3 h-3" />
                    {config.label}
                  </div>
                  <p className="mt-1 text-[11px] text-gray-400">
                    {reminder.respondedAt
                      ? `Updated ${new Date(reminder.respondedAt).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}`
                      : 'No response yet'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-medical-50 border border-medical-100 rounded-xl p-5 mt-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-medical-500" />
          <span className="text-sm font-semibold text-medical-700">AI Insight</span>
        </div>
        <p className="text-sm text-medical-600 leading-relaxed">
          {patient.riskLevel === 'high'
            ? `${patient.name} has missed ${patient.consecutiveMissed} consecutive doses. Pattern analysis shows evening medications are most frequently missed. Consider reaching out for a medication review.`
            : patient.riskLevel === 'medium'
            ? `${patient.name}'s adherence is improving with MediSync's adaptive reminders. Weekend doses remain challenging, and AI has adjusted timing to account for later wake times.`
            : `${patient.name} demonstrates excellent adherence. AI reminder timing is well-calibrated to their routine. No intervention needed.`
          }
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl border border-gray-100 p-5 mt-6"
      >
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Patient Responses</h3>
        <div className="space-y-2">
          {recentReminderActivity.length > 0 ? (
            recentReminderActivity.map((reminder) => {
              const medication =
                patient.medications.find((med) => med.id === reminder.medicationId) ||
                medicationDatabase.find((med) => med.id === reminder.medicationId);
              if (!medication) return null;

              return (
                <div key={reminder.id} className="flex items-center justify-between gap-3 py-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      reminder.status === 'taken' ? 'bg-health-500' :
                      reminder.status === 'snoozed' ? 'bg-amber-400' :
                      reminder.status === 'pending' ? 'bg-blue-400' :
                      reminder.status === 'skipped' ? 'bg-gray-400' :
                      'bg-red-500'
                    }`} />
                    <div>
                      <p className="text-sm text-gray-700">{medication.name}</p>
                      <p className="text-[11px] text-gray-400">{statusConfig[reminder.status].label} at {reminder.scheduledTime}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(reminder.respondedAt ?? '').toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              );
            })
          ) : (
            recentHistory.map((day) => (
              <div key={day.date} className="flex items-center gap-3 py-2">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  day.adherenceRate >= 85 ? 'bg-health-500' :
                  day.adherenceRate >= 60 ? 'bg-amber-400' :
                  'bg-red-500'
                }`} />
                <span className="text-sm text-gray-600 w-24">{day.date.slice(5)}</span>
                <Progress
                  value={day.adherenceRate}
                  className={`h-1.5 flex-1 ${
                    day.adherenceRate >= 85 ? '[&>div]:bg-health-500' :
                    day.adherenceRate >= 60 ? '[&>div]:bg-amber-400' :
                    '[&>div]:bg-red-500'
                  }`}
                />
                <span className="text-xs text-gray-400 w-16 text-right">
                  {day.takenDoses}/{day.totalDoses} doses
                </span>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

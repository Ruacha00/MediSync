import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, TrendingUp, AlertTriangle, Bell, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/store/appStore';
import { populationStats } from '@/data/adherenceHistory';

const statCards = [
  { label: 'Total Patients', value: populationStats.totalPatients, icon: Users, color: 'text-medical-600', bg: 'bg-medical-50' },
  { label: 'Avg Adherence', value: `${populationStats.avgAdherence}%`, icon: TrendingUp, color: 'text-health-600', bg: 'bg-health-50' },
  { label: 'High Risk', value: populationStats.highRiskCount, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  { label: "Today's Alerts", value: populationStats.todayAlerts, icon: Bell, color: 'text-amber-600', bg: 'bg-amber-50' },
];

export function OverviewPage() {
  const { patients } = useAppStore();
  const highRiskPatients = patients.filter((p) => p.riskLevel === 'high');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500">Monitor patient adherence and manage alerts</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-xl border border-gray-100 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Risk alerts */}
      {highRiskPatients.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-red-50 border border-red-100 rounded-xl p-4 mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-semibold text-red-700">High Risk Alerts</span>
          </div>
          <div className="space-y-2">
            {highRiskPatients.map((p) => (
              <Link
                key={p.id}
                to={`/dashboard/patient/${p.id}`}
                className="flex items-center justify-between bg-white rounded-lg p-3 hover:bg-red-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-red-600">{p.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-red-500">{p.consecutiveMissed} consecutive missed doses</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Patient table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl border border-gray-100 overflow-hidden"
      >
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">All Patients</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 text-xs text-gray-400">
                <th className="text-left p-4 font-medium">Patient</th>
                <th className="text-left p-4 font-medium">Age</th>
                <th className="text-left p-4 font-medium">Conditions</th>
                <th className="text-left p-4 font-medium">Medications</th>
                <th className="text-left p-4 font-medium">30-Day Adherence</th>
                <th className="text-left p-4 font-medium">Risk</th>
                <th className="text-left p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr
                  key={patient.id}
                  className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                    patient.riskLevel === 'high' ? 'bg-red-50/30' : ''
                  }`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-medical-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-medical-600">{patient.avatar}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{patient.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{patient.age}</td>
                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {patient.conditions.map((c) => (
                        <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{patient.medications.length}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Progress
                        value={patient.adherenceRate}
                        className={`h-2 w-24 ${
                          patient.adherenceRate >= 80 ? '[&>div]:bg-health-500' :
                          patient.adherenceRate >= 60 ? '[&>div]:bg-amber-500' :
                          '[&>div]:bg-red-500'
                        }`}
                      />
                      <span className="text-xs text-gray-500">{patient.adherenceRate}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge
                      className={`text-[10px] ${
                        patient.riskLevel === 'low' ? 'bg-health-100 text-health-700' :
                        patient.riskLevel === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}
                    >
                      {patient.riskLevel}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Link
                      to={`/dashboard/patient/${patient.id}`}
                      className="text-xs text-medical-500 hover:text-medical-700 font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

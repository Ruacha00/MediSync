import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { populationStats } from '@/data/adherenceHistory';
import { useAppStore } from '@/store/appStore';

const responseData = [
  { name: 'Taken', value: populationStats.responseRates.taken, color: '#10B981' },
  { name: 'Snoozed', value: populationStats.responseRates.snoozed, color: '#F59E0B' },
  { name: 'Skipped', value: populationStats.responseRates.skipped, color: '#6B7280' },
  { name: 'Missed', value: populationStats.responseRates.missed, color: '#EF4444' },
];

const comparisonData = [
  { metric: 'Adherence Rate', baseline: 62, medisync: 78 },
  { metric: 'Response Rate', baseline: 55, medisync: 83 },
  { metric: 'On-Time Rate', baseline: 48, medisync: 72 },
];

export function ReportsPage() {
  const { patients } = useAppStore();

  const distributionData = [
    { range: '0-50%', count: patients.filter((p) => p.adherenceRate < 50).length },
    { range: '50-70%', count: patients.filter((p) => p.adherenceRate >= 50 && p.adherenceRate < 70).length },
    { range: '70-85%', count: patients.filter((p) => p.adherenceRate >= 70 && p.adherenceRate < 85).length },
    { range: '85-100%', count: patients.filter((p) => p.adherenceRate >= 85).length },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Population Reports</h1>
          <p className="text-sm text-gray-500">Aggregated adherence data and trends</p>
        </div>
        <Button variant="outline" className="text-sm">
          <Download className="w-4 h-4 mr-2" /> Export Report
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Monthly trend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 p-5"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Adherence Trend (Monthly)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={populationStats.monthlyTrend}>
                <defs>
                  <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} formatter={(value) => [`${value}%`, 'Avg Adherence']} />
                <Area type="monotone" dataKey="rate" stroke="#3B82F6" fillOpacity={1} fill="url(#colorMonthly)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Response rate pie */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-100 p-5"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Notification Response Distribution</h3>
          <div className="h-56 flex items-center">
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie
                  data={responseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {responseData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {responseData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-600">{item.name}</span>
                  <span className="text-xs font-medium text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Before/After comparison */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-100 p-5"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Baseline vs MediSync Comparison</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="metric" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} formatter={(value) => [`${value}%`]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="baseline" name="Baseline" fill="#94A3B8" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="medisync" name="MediSync" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-100 p-5"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Adherence Distribution</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }} formatter={(value) => [value, 'Patients']} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={50}>
                  {distributionData.map((_, idx) => (
                    <Cell key={idx} fill={['#EF4444', '#F59E0B', '#60A5FA', '#10B981'][idx]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Insurance report note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 bg-gray-50 rounded-xl p-5 border border-gray-100"
      >
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Insurance Company Report (De-identified)</h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          This report contains only aggregated, de-identified data suitable for insurance partners.
          No individual patient health information (PHI) is included. Data firewall protocols
          ensure compliance with HIPAA and BAA requirements. Insurance partners receive population-level
          metrics only: overall adherence rates, hospitalization rate changes, and program ROI estimates.
        </p>
      </motion.div>
    </div>
  );
}

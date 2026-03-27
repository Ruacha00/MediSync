import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/store/useAppStore';
import { adherenceHistoryByPatient } from '@/data/adherenceHistory';

export function HistoryPage() {
  const { currentPatient } = useAppStore();
  const [period, setPeriod] = useState<'7d' | '14d' | '30d'>('30d');

  const history = adherenceHistoryByPatient[currentPatient.id] || [];
  const slicedHistory =
    period === '7d' ? history.slice(-7) :
    period === '14d' ? history.slice(-14) :
    history;

  const baselineData = history.slice(0, 14);
  const medisyncData = history.slice(14);
  const baselineAvg = Math.round(baselineData.reduce((s, d) => s + d.adherenceRate, 0) / baselineData.length);
  const medisyncAvg = Math.round(medisyncData.reduce((s, d) => s + d.adherenceRate, 0) / medisyncData.length);
  const improvement = medisyncAvg - baselineAvg;

  const comparisonData = [
    { name: 'Adherence Rate', baseline: baselineAvg, medisync: medisyncAvg },
  ];

  return (
    <div className="px-5 pt-6">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Adherence History</h1>
      <p className="text-xs text-gray-400 mb-5">Track your medication adherence over time</p>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 p-3 text-center"
        >
          <p className="text-2xl font-bold text-medical-600">{currentPatient.adherenceRate}%</p>
          <p className="text-[10px] text-gray-400">30-Day Rate</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-xl border border-gray-100 p-3 text-center"
        >
          <p className="text-2xl font-bold text-health-600">+{improvement}%</p>
          <p className="text-[10px] text-gray-400">Improvement</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-100 p-3 text-center flex flex-col items-center"
        >
          {improvement > 5 ? (
            <TrendingUp className="w-6 h-6 text-health-500" />
          ) : improvement < -5 ? (
            <TrendingDown className="w-6 h-6 text-red-500" />
          ) : (
            <Minus className="w-6 h-6 text-gray-400" />
          )}
          <p className="text-[10px] text-gray-400 mt-1">Trend</p>
        </motion.div>
      </div>

      {/* Period tabs */}
      <Tabs value={period} onValueChange={(v) => setPeriod(v as '7d' | '14d' | '30d')} className="mb-4">
        <TabsList className="w-full">
          <TabsTrigger value="7d" className="flex-1 text-xs">7 Days</TabsTrigger>
          <TabsTrigger value="14d" className="flex-1 text-xs">14 Days</TabsTrigger>
          <TabsTrigger value="30d" className="flex-1 text-xs">30 Days</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Adherence trend chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-100 p-4 mb-6"
      >
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Adherence Rate</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={slicedHistory}>
              <defs>
                <linearGradient id="colorAdherence" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => d.slice(5)}
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}
                formatter={(value) => [`${value}%`, 'Adherence']}
              />
              <Area
                type="monotone"
                dataKey="adherenceRate"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorAdherence)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Before/After comparison */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-100 p-4 mb-6"
      >
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Before vs After MediSync</h3>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} barGap={12} barSize={60}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}
                formatter={(value) => [`${value}%`, 'Adherence Rate']}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="baseline" name="Baseline" fill="#94A3B8" radius={[6, 6, 0, 0]} />
              <Bar dataKey="medisync" name="MediSync" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Calendar heatmap */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-gray-100 p-4 mb-6"
      >
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Daily Overview</h3>
        <div className="grid grid-cols-7 gap-1.5">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="text-[10px] text-gray-400 text-center font-medium">{d}</div>
          ))}
          {history.slice(-28).map((day, i) => {
            const bg =
              day.adherenceRate >= 85 ? 'bg-health-400' :
              day.adherenceRate >= 60 ? 'bg-amber-300' :
              day.adherenceRate >= 30 ? 'bg-red-300' :
              'bg-red-500';
            return (
              <div
                key={i}
                className={`aspect-square rounded-md ${bg} opacity-80`}
                title={`${day.date}: ${day.adherenceRate}%`}
              />
            );
          })}
        </div>
        <div className="flex justify-center gap-4 mt-3">
          {[
            { color: 'bg-health-400', label: '85%+' },
            { color: 'bg-amber-300', label: '60-84%' },
            { color: 'bg-red-300', label: '30-59%' },
            { color: 'bg-red-500', label: '<30%' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1">
              <div className={`w-2.5 h-2.5 rounded-sm ${color}`} />
              <span className="text-[10px] text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

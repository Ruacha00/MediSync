import { format, subDays } from 'date-fns';
import type { DailyAdherence } from '@/types';

function generateAdherenceHistory(
  baseRate: number,
  improvement: number,
  variance: number,
): DailyAdherence[] {
  const today = new Date();
  const history: DailyAdherence[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = subDays(today, i);
    const isBaseline = i >= 14;
    const base = isBaseline ? baseRate : baseRate + improvement;
    const dayVariance = (Math.sin(i * 1.7) * variance + Math.cos(i * 2.3) * variance * 0.5);
    const rate = Math.min(100, Math.max(0, Math.round(base + dayVariance)));

    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const weekendPenalty = isWeekend ? -5 : 0;
    const finalRate = Math.min(100, Math.max(0, rate + weekendPenalty));

    const totalDoses = isWeekend ? 2 : 3;
    const takenDoses = Math.round((finalRate / 100) * totalDoses);
    const missedDoses = totalDoses - takenDoses;

    history.push({
      date: format(date, 'yyyy-MM-dd'),
      adherenceRate: finalRate,
      totalDoses,
      takenDoses,
      missedDoses,
      skippedDoses: Math.floor(missedDoses * 0.3),
    });
  }

  return history;
}

export const adherenceHistoryByPatient: Record<string, DailyAdherence[]> = {
  'p-001': generateAdherenceHistory(82, 12, 6),
  'p-002': generateAdherenceHistory(65, 13, 8),
  'p-003': generateAdherenceHistory(50, 15, 10),
  'p-004': generateAdherenceHistory(58, 13, 9),
  'p-005': generateAdherenceHistory(32, 13, 8),
  'p-006': generateAdherenceHistory(78, 10, 5),
  'p-007': generateAdherenceHistory(72, 10, 7),
  'p-008': generateAdherenceHistory(60, 13, 8),
};

export const populationStats = {
  totalPatients: 8,
  avgAdherence: 78,
  highRiskCount: 2,
  todayAlerts: 5,
  baselineAvgAdherence: 62,
  currentAvgAdherence: 78,
  responseRates: {
    taken: 68,
    snoozed: 15,
    skipped: 7,
    missed: 10,
  },
  monthlyTrend: [
    { month: 'Oct', rate: 58 },
    { month: 'Nov', rate: 62 },
    { month: 'Dec', rate: 65 },
    { month: 'Jan', rate: 70 },
    { month: 'Feb', rate: 74 },
    { month: 'Mar', rate: 78 },
  ],
};

export interface AdherenceRecord {
  date: string;
  medicationId: string;
  scheduled: boolean;
  taken: boolean;
  takenOnTime: boolean;
  responseTime?: number;
  response: 'taken' | 'snoozed_then_taken' | 'skipped' | 'missed' | 'expired';
}

export interface DailyAdherence {
  date: string;
  adherenceRate: number;
  totalDoses: number;
  takenDoses: number;
  missedDoses: number;
  skippedDoses: number;
}

export interface AdherenceStats {
  overall30Day: number;
  overall7Day: number;
  trend: 'improving' | 'stable' | 'declining';
  bestTimeSlot: string;
  worstTimeSlot: string;
  baselineRate: number;
  currentRate: number;
}

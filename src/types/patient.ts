export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  conditions: string[];
  medications: Medication[];
  adherenceRate: number;
  riskLevel: 'low' | 'medium' | 'high';
  consecutiveMissed: number;
  registeredDate: string;
  avatar: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedTime: 'morning' | 'evening' | 'twice_daily';
  safetyWindowHours: number;
  category: string;
  source: 'manual' | 'fhir';
  color: string;
}

// Types for period tracking app
// Kept for backward compatibility

export interface PeriodLog {
  startDate: Date;
  endDate: Date;
}

export interface MoodLog {
  date: Date;
  mood: 'great' | 'good' | 'okay' | 'low' | 'bad';
  note?: string;
}

export interface SymptomLog {
  date: Date;
  symptoms: string[];
  note?: string;
}

export interface DailyLog {
  date: Date;
  mood?: MoodLog['mood'];
  symptoms?: string[];
  notes?: string;
  periodDay?: number; // 1-7 if on period
  isPredictedPeriod?: boolean;
  isFertile?: boolean;
  isOvulation?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  cycleLength: number;
  periodLength: number;
  lastPeriodStart: Date;
  notificationsEnabled: boolean;
  appLockEnabled: boolean;
}
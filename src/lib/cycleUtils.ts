import { getGreeting, getPhaseMessage } from '../lib/constants';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  cycleLength: number;
  periodLength: number;
  lastPeriodStart: Date;
  notificationsEnabled: boolean;
  appLockEnabled: boolean;
}

export interface CycleInfo {
  cycleDay: number;
  daysUntilNextPeriod: number;
  isPeriod: boolean;
  periodDay?: number;
  isFertile: boolean;
  isOvulation: boolean;
  nextPeriodDate: Date;
}

// Calculate cycle info from user profile
export const getCycleInfo = (user: UserProfile): CycleInfo => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastPeriod = new Date(user.lastPeriodStart);
  const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
  const cycleDay = (daysSinceLastPeriod % user.cycleLength) + 1;
  const daysUntilNextPeriod = user.cycleLength - daysSinceLastPeriod;
  const isPeriod = cycleDay <= (user.periodLength || 5);
  const periodDay = isPeriod ? cycleDay : undefined;

  // Fertile window is typically days 10-16 of cycle
  const isFertile = cycleDay >= 10 && cycleDay <= 16;
  const isOvulation = cycleDay === 14;

  // Calculate next period date
  const nextPeriodDate = new Date(today);
  nextPeriodDate.setDate(today.getDate() + (daysUntilNextPeriod > 0 ? daysUntilNextPeriod : user.cycleLength + daysUntilNextPeriod));

  return {
    cycleDay,
    daysUntilNextPeriod: daysUntilNextPeriod > 0 ? daysUntilNextPeriod : user.cycleLength + daysUntilNextPeriod,
    isPeriod,
    periodDay,
    isFertile,
    isOvulation,
    nextPeriodDate,
  };
};

// Re-export other utilities
export { getGreeting, getPhaseMessage };
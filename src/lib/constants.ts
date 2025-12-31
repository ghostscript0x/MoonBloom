// Types and constants for period tracking app

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

// Available symptoms to track
export const availableSymptoms = [
  { id: 'cramps', label: 'Cramps', emoji: '😣' },
  { id: 'headache', label: 'Headache', emoji: '🤕' },
  { id: 'bloating', label: 'Bloating', emoji: '🎈' },
  { id: 'fatigue', label: 'Fatigue', emoji: '😴' },
  { id: 'acne', label: 'Acne', emoji: '😔' },
  { id: 'backpain', label: 'Back Pain', emoji: '💆' },
  { id: 'tender', label: 'Tender Breasts', emoji: '💗' },
  { id: 'cravings', label: 'Cravings', emoji: '🍫' },
  { id: 'mood-swings', label: 'Mood Swings', emoji: '🎭' },
  { id: 'anxiety', label: 'Anxiety', emoji: '😰' },
  { id: 'insomnia', label: 'Can\'t Sleep', emoji: '🌙' },
  { id: 'nausea', label: 'Nausea', emoji: '🤢' },
];

// Mood options with details
export const moodOptions = [
  { value: 'great', label: 'Great', emoji: '😊', color: 'mood-great' },
  { value: 'good', label: 'Good', emoji: '🙂', color: 'mood-good' },
  { value: 'okay', label: 'Okay', emoji: '😐', color: 'mood-okay' },
  { value: 'low', label: 'Low', emoji: '😔', color: 'mood-low' },
  { value: 'bad', label: 'Bad', emoji: '😢', color: 'mood-bad' },
] as const;

// Greeting based on time of day
export const getGreeting = (name: string): string => {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${name} 💕`;
  if (hour < 17) return `Good afternoon, ${name} 🌸`;
  if (hour < 21) return `Good evening, ${name} 🌙`;
  return `Sweet dreams, ${name} ✨`;
};

// Daily supportive messages
export const supportiveMessages = [
  "Your body is doing amazing things. Be gentle with yourself today. 💕",
  "Rest is productive too. Take breaks when you need them. 🌸",
  "You're stronger than you know. This too shall pass. 💜",
  "Listen to what your body needs today. It knows best. 💗",
  "Every cycle is a fresh start. You've got this. 🌺",
  "Your feelings are valid. It's okay to not be okay. 💜",
  "Hydrate, rest, and be kind to yourself today. 🌿",
  "You deserve care and comfort. Treat yourself gently. 🦋",
  "Your body is working hard. Honor it with rest. 🌙",
  "Remember: you are not alone in this journey. 💕",
];

// Get message based on cycle phase
export const getPhaseMessage = (daysUntilPeriod: number, isPeriod: boolean, periodDay?: number): string => {
  if (isPeriod && periodDay) {
    if (periodDay <= 2) return "Your body may feel tender today. Rest if you can. 💕";
    if (periodDay <= 4) return "You're doing great. Stay warm and cozy. 🌸";
    return "Almost there! Your strength is incredible. 💪";
  }

  if (daysUntilPeriod <= 3 && daysUntilPeriod > 0) {
    return "Your period may arrive soon. Stock up on comfort items! 🧸";
  }

  if (daysUntilPeriod <= 7 && daysUntilPeriod > 3) {
    return "PMS might be starting. Be extra kind to yourself. 💜";
  }

  if (daysUntilPeriod > 14 && daysUntilPeriod <= 18) {
    return "You might be ovulating! Your energy could be higher. ✨";
  }

  return supportiveMessages[Math.floor(Math.random() * supportiveMessages.length)];
};
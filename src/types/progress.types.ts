export interface UserStats {
  xp: number;
  level: number;

  totalFocusMinutes: number;
  totalSessions: number;

  currentStreak: number;
  longestStreak: number;
}

export interface Session {
  id: string;

  userId: string;

  focusMinutes: number;

  cyclesCompleted: number;

  durationType: string;

  createdAt: any;
  completedAt: any;
}
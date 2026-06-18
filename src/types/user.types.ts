export interface UserProfile {
  uid: string;
  name: string;
  email: string;

  xp: number;
  level: number;

  currentStreak: number;
  longestStreak: number;

  totalFocusMinutes: number;
  totalSessions: number;

  createdAt: string;
}
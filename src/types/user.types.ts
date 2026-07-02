export interface UserProfile {
  uid: string;
  name: string;
  email: string;

  xp: number;
  level: number;
  rankTitle?: string;

  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: string; // YYYY-MM-DD

  totalFocusMinutes: number;
  maxSessionMinutes?: number;
  totalSessions: number;
  
  battlesWon?: number;

  attributes?: {
    endurance: number;
    consistency: number;
    competitiveness: number;
    volume: number;
  };

  createdAt: string;
}
export type BattleType = "pomodoro" | "focus_time" | "streak" | "daily_goal";
export type BattleStatus = "pending" | "active" | "completed" | "declined";

export interface Battle {
  id: string;
  type: BattleType;
  status: BattleStatus;
  targetValue: number; // e.g., 120 minutes for focus_time

  challengerId: string;
  challengerName: string;
  challengerProgress: number;

  opponentId: string;
  opponentName: string;
  opponentProgress: number;

  winnerId?: string; // Present only if status === 'completed'

  createdAt: string; // ISO String
  startedAt?: string; // ISO String
}

export interface SendChallengePayload {
  type: BattleType;
  targetValue: number;
  opponentId: string;
  opponentName: string;
}

const BASE_XP = 100;
const EXPONENT = 1.5;

/**
 * Calculate current level based on total XP
 */
export const calculateLevel = (totalXP: number): number => {
  if (totalXP < BASE_XP) return 1;
  const level = Math.floor(Math.pow(totalXP / BASE_XP, 2 / 3)) + 1;
  return level;
};

/**
 * Calculate total XP required to reach a specific level
 */
export const calculateXPForLevel = (level: number): number => {
  if (level <= 1) return 0;
  return Math.floor(BASE_XP * Math.pow(level - 1, EXPONENT));
};

/**
 * Get the rank title for a specific level
 */
export const getRankTitle = (level: number): string => {
  if (level < 5) return "Novice Scholar";
  if (level < 10) return "Adept Focus";
  if (level < 20) return "Disciplined Sprinter";
  if (level < 35) return "Master of Time";
  if (level < 50) return "Grandmaster";
  if (level < 75) return "Zen Legend";
  return "Ascended";
};

// --- Attributes (Scale 1 to 99) ---

export const calculateEndurance = (maxSessionMinutes: number = 0) => {
  // 4 hours (240 mins) maxes out the score
  return Math.min(99, Math.max(1, Math.floor((maxSessionMinutes / 240) * 99)));
};

export const calculateConsistency = (longestStreak: number = 0) => {
  // 30 days maxes out the score
  return Math.min(99, Math.max(1, Math.floor((longestStreak / 30) * 99)));
};

export const calculateCompetitiveness = (battlesWon: number = 0) => {
  // 25 battles won maxes out the score
  return Math.min(99, Math.max(1, Math.floor((battlesWon / 25) * 99)));
};

export const calculateVolume = (totalFocusMinutes: number = 0) => {
  // 5,000 minutes (~83 hours) maxes out the score
  return Math.min(99, Math.max(1, Math.floor((totalFocusMinutes / 5000) * 99)));
};

// --- XP Bonus Calculators ---

export const calculateSessionXP = (
  minutes: number,
  isPomodoro: boolean,
  cyclesCompleted?: number
): number => {
  let xp = minutes; // Base: 1 XP per minute

  if (isPomodoro && cyclesCompleted) {
    // Bonus for completing full sprints without breaking
    // E.g., +15 XP per cycle completed
    xp += cyclesCompleted * 15;
  }

  return Math.floor(xp);
};

export const calculateBattleWinXP = (targetMinutes: number): number => {
  // Massive bonus for winning a battle
  return Math.floor(targetMinutes * 1.5 + 100);
};

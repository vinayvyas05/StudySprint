/**
 * Returns the current date as a YYYY-MM-DD string, sourced from a trusted time API 
 * to prevent users from spoofing their device clock. Falls back to local clock if offline.
 */
export const getTrueDateString = async (): Promise<string> => {
  try {
    const res = await fetch("http://worldtimeapi.org/api/timezone/Etc/UTC");
    if (!res.ok) throw new Error("API unavailable");
    const data = await res.json();
    const trueDate = new Date(data.datetime);
    return `${trueDate.getUTCFullYear()}-${String(trueDate.getUTCMonth() + 1).padStart(2, '0')}-${String(trueDate.getUTCDate()).padStart(2, '0')}`;
  } catch (error) {
    // Fallback to local clock
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }
};

/**
 * Calculates the new streak based on the last active date and the current streak.
 * Only increments if exactly one day has passed. Resets if more than one day passed.
 */
export const calculateNewStreakAsync = async (lastActiveDate?: string, currentStreak: number = 0) => {
  const todayStr = await getTrueDateString();
  
  // First ever session
  if (!lastActiveDate) {
    return { newStreak: 1, isNewDay: true, todayStr };
  }

  // Session completed on the same day as previous session
  if (lastActiveDate === todayStr) {
    return { newStreak: Math.max(1, currentStreak), isNewDay: false, todayStr };
  }

  // Compare dates using strict timezone-agnostic boundaries (midnight to midnight)
  // Since our strings are YYYY-MM-DD, parsing them like this defaults to UTC midnight, 
  // ensuring the day calculation is exact and not skewed by local hours.
  const lastDate = new Date(lastActiveDate + "T00:00:00Z");
  const today = new Date(todayStr + "T00:00:00Z");
  
  const diffTime = today.getTime() - lastDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Exact next day -> increment
    return { newStreak: currentStreak + 1, isNewDay: true, todayStr };
  } else if (diffDays > 1) {
    // Missed a day -> reset
    return { newStreak: 1, isNewDay: true, todayStr };
  } else {
    // Edge case: Time traveler (future date) or clock change -> keep streak safe
    return { newStreak: currentStreak, isNewDay: false, todayStr };
  }
};

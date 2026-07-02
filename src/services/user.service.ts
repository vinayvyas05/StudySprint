import { db } from "@/config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { UserProfile } from "@/types/user.types";
import { 
  calculateLevel, 
  getRankTitle, 
  calculateEndurance, 
  calculateConsistency, 
  calculateCompetitiveness, 
  calculateVolume 
} from "@/utils/progression.utils";

/**
 * Recalculates the user's level, rank, and RPG attributes based on their current raw stats.
 * This should be safely called whenever raw stats (XP, focus minutes, battles won) are updated.
 */
export const syncUserProgression = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return;
  const userData = userSnap.data() as UserProfile;

  const currentXP = userData.xp || 0;
  const newLevel = calculateLevel(currentXP);
  const rankTitle = getRankTitle(newLevel);

  const attributes = {
    endurance: calculateEndurance(userData.maxSessionMinutes || 0),
    consistency: calculateConsistency(userData.longestStreak || 0),
    competitiveness: calculateCompetitiveness(userData.battlesWon || 0),
    volume: calculateVolume(userData.totalFocusMinutes || 0),
  };

  await updateDoc(userRef, {
    level: newLevel,
    rankTitle,
    attributes,
  });
};

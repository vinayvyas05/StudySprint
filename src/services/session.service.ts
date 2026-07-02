import { db } from "@/config/firebase";
import { doc, addDoc, collection, updateDoc, increment, getDoc } from "firebase/firestore";
import { Session } from "@/types/session.types";
import { updateActiveBattlesProgress } from "./battle.service";
import { UserProfile } from "@/types/user.types";
import { 
  calculateLevel, 
  calculateSessionXP, 
  getRankTitle, 
  calculateEndurance, 
  calculateConsistency, 
  calculateCompetitiveness, 
  calculateVolume 
} from "@/utils/progression.utils";

export const createSession = async (sessionData: Session) => {
  await addDoc(collection(db, "sessions"), sessionData);
};

export const updateUserStats = async (
  uid: string, 
  minutes: number,
  isPomodoro: boolean = false,
  cyclesCompleted: number = 0
) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return;
  const userData = userSnap.data() as UserProfile;

  // 1. Calculate XP & Level
  const gainedXP = calculateSessionXP(minutes, isPomodoro, cyclesCompleted);
  const newXP = (userData.xp || 0) + gainedXP;
  const newLevel = calculateLevel(newXP);
  const rankTitle = getRankTitle(newLevel);

  // 2. Track raw stats for attributes
  const newTotalFocus = (userData.totalFocusMinutes || 0) + minutes;
  const maxSession = Math.max(userData.maxSessionMinutes || 0, minutes);
  const longestStreak = userData.longestStreak || 0;
  const battlesWon = userData.battlesWon || 0;

  // 3. Recalculate RPG Attributes
  const attributes = {
    endurance: calculateEndurance(maxSession),
    consistency: calculateConsistency(longestStreak),
    competitiveness: calculateCompetitiveness(battlesWon),
    volume: calculateVolume(newTotalFocus),
  };

  await updateDoc(userRef, {
    xp: newXP,
    level: newLevel,
    rankTitle,
    maxSessionMinutes: maxSession,
    attributes,
    totalFocusMinutes: increment(minutes),
    totalSessions: increment(1),
  });

  // Automatically update any active focus battles
  updateActiveBattlesProgress(uid, minutes).catch(err => {
    console.error("Failed to update active battles:", err);
  });
};
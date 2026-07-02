import { db } from "@/config/firebase";
import { doc, addDoc, collection, updateDoc, increment, getDoc } from "firebase/firestore";
import { Session } from "@/types/session.types";
import { updateActiveBattlesProgress } from "./battle.service";
import { UserProfile } from "@/types/user.types";
import { calculateSessionXP } from "@/utils/progression.utils";
import { syncUserProgression } from "./user.service";

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

  // 1. Calculate XP Gained
  const gainedXP = calculateSessionXP(minutes, isPomodoro, cyclesCompleted);

  // 2. Track raw stats
  const maxSession = Math.max(userData.maxSessionMinutes || 0, minutes);

  await updateDoc(userRef, {
    xp: increment(gainedXP),
    maxSessionMinutes: maxSession,
    totalFocusMinutes: increment(minutes),
    totalSessions: increment(1),
  });

  // 3. Sync progression (Level, Rank, Attributes)
  await syncUserProgression(uid);

  // Automatically update any active focus battles
  updateActiveBattlesProgress(uid, minutes).catch(err => {
    console.error("Failed to update active battles:", err);
  });
};
import { db } from "@/config/firebase";
import { doc, addDoc, collection, updateDoc, increment } from "firebase/firestore";
import { Session } from "@/types/session.types";
import { updateActiveBattlesProgress } from "./battle.service";

export const createSession = async (sessionData: Session) => {
  await addDoc(collection(db, "sessions"), sessionData);
};

export const updateUserStats = async (uid: string, minutes: number) => {
  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, {
    xp: increment(minutes),
    totalFocusMinutes: increment(minutes),
    totalSessions: increment(1),
  });

  // Automatically update any active focus battles
  updateActiveBattlesProgress(uid, minutes).catch(err => {
    console.error("Failed to update active battles:", err);
  });
};
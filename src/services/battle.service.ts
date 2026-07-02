import { db } from "@/config/firebase";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
  or,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { Battle, BattleStatus, BattleType, SendChallengePayload } from "@/types/battle.types";
import { UserProfile } from "@/types/user.types";

/**
 * Searches for users by exact email or prefix matching name.
 */
export const searchUsers = async (searchQuery: string): Promise<UserProfile[]> => {
  const queryText = searchQuery.trim();
  if (!queryText) return [];

  const usersRef = collection(db, "users");
  let q;

  if (queryText.includes("@")) {
    // Search by exact email
    q = query(usersRef, where("email", "==", queryText.toLowerCase()));
  } else {
    // Search by name prefix
    q = query(
      usersRef,
      where("name", ">=", queryText),
      where("name", "<=", queryText + "\uf8ff")
    );
  }

  const snapshot = await getDocs(q);
  const users: UserProfile[] = [];
  snapshot.forEach((doc) => {
    users.push(doc.data() as UserProfile);
  });

  return users;
};

/**
 * Sends a new challenge to an opponent.
 */
export const sendChallenge = async (
  challengerId: string,
  challengerName: string,
  payload: SendChallengePayload
): Promise<string> => {
  const battleData: Omit<Battle, "id"> = {
    type: payload.type,
    status: "pending",
    targetValue: payload.targetValue,

    challengerId,
    challengerName,
    challengerProgress: 0,

    opponentId: payload.opponentId,
    opponentName: payload.opponentName,
    opponentProgress: 0,

    createdAt: new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db, "battles"), battleData);
  return docRef.id;
};

/**
 * Accepts a pending challenge.
 */
export const acceptChallenge = async (battleId: string): Promise<void> => {
  const battleRef = doc(db, "battles", battleId);
  await updateDoc(battleRef, {
    status: "active",
    startedAt: new Date().toISOString(),
  });
};

/**
 * Declines a pending challenge.
 */
export const declineChallenge = async (battleId: string): Promise<void> => {
  const battleRef = doc(db, "battles", battleId);
  await updateDoc(battleRef, {
    status: "declined",
  });
};

/**
 * Updates progress for all active focus_time battles for a user.
 * This should be called whenever a user completes a sprint.
 */
export const updateActiveBattlesProgress = async (userId: string, minutesFocused: number): Promise<void> => {
  const battlesRef = collection(db, "battles");
  
  // To avoid composite index requirements in Firestore, we query by userId 
  // (which uses default single-field indexes) and filter the rest locally.
  const challengerQuery = query(battlesRef, where("challengerId", "==", userId));
  const opponentQuery = query(battlesRef, where("opponentId", "==", userId));

  const [challengerSnap, opponentSnap] = await Promise.all([
    getDocs(challengerQuery),
    getDocs(opponentQuery),
  ]);

  const allBattleDocs = [...challengerSnap.docs, ...opponentSnap.docs];

  for (const battleDoc of allBattleDocs) {
    const battle = battleDoc.data() as Battle;

    if (battle.status !== "active" || battle.type !== "focus_time") {
      continue;
    }
    const isChallenger = battle.challengerId === userId;

    const progressField = isChallenger ? "challengerProgress" : "opponentProgress";
    const newProgress = (isChallenger ? battle.challengerProgress : battle.opponentProgress) + minutesFocused;

    const updates: any = {
      [progressField]: increment(minutesFocused),
    };

    // Check for win condition
    if (newProgress >= battle.targetValue) {
      updates.status = "completed";
      updates.winnerId = userId;
    }

    await updateDoc(doc(db, "battles", battleDoc.id), updates);
  }
};

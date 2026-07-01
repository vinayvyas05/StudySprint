import {
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/config/firebase";

export interface ActiveSession {
  userId: string;
  groupIds: string[];
  displayName: string;

  isFocusing: boolean;

  startedAt: Timestamp | null;
  expiresAt: Timestamp;
}

const ACTIVE_SESSIONS_COLLECTION = "activeSessions";

export async function startActiveSession(params: {
  userId: string;
  groupIds: string[];
  displayName: string;
  durationMinutes: number;
}) {
  const {
    userId,
    groupIds,
    displayName,
    durationMinutes,
  } = params;

  const expiresAt = Timestamp.fromMillis(
    Date.now() + durationMinutes * 60 * 1000
  );

  await setDoc(
    doc(db, ACTIVE_SESSIONS_COLLECTION, userId),
    {
      userId,
      groupIds,
      displayName,

      isFocusing: true,

      startedAt: serverTimestamp(),
      expiresAt,
    },
    {
      merge: true,
    }
  );
}

export async function stopActiveSession(
  userId: string
) {
  await deleteDoc(
    doc(db, ACTIVE_SESSIONS_COLLECTION, userId)
  );
}
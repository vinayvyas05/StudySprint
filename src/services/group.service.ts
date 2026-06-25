import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/config/firebase";
import { Group, CreateGroupPayload } from "@/types/group.types";

/**
 * Subscribe to real-time focusing counts per group.
 * Listens to the `activeSessions` collection and filters
 * only non-expired, actively focusing sessions.
 *
 * Returns an unsubscribe function.
 */
export function subscribeToFocusingCounts(
  onUpdate: (counts: Record<string, number>) => void
) {
  const sessionsQuery = query(
    collection(db, "activeSessions"),
    where("isFocusing", "==", true)
  );

  return onSnapshot(sessionsQuery, (snapshot) => {
    const counts: Record<string, number> = {};
    const now = Timestamp.now();

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const expiresAt = data.expiresAt as Timestamp | undefined;

      // Skip expired sessions
      if (expiresAt && expiresAt.toMillis() < now.toMillis()) return;

      const groupId = data.groupId as string;
      if (groupId) {
        counts[groupId] = (counts[groupId] || 0) + 1;
      }
    });

    onUpdate(counts);
  });
}

export const getGroups = async (): Promise<Group[]> => {
  const snapshot = await getDocs(collection(db, "groups"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Group[];
};

export const createGroup = async (
  payload: CreateGroupPayload
): Promise<string> => {
  const groupRef = await addDoc(collection(db, "groups"), {
    name: payload.name,
    description: payload.description,
    category: payload.category,
    createdBy: payload.createdBy,
    memberCount: 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Auto-join the creator
  await addDoc(collection(db, "groupMembers"), {
    userId: payload.createdBy,
    groupId: groupRef.id,
    joinedAt: serverTimestamp(),
  });

  return groupRef.id;
};

export const deleteGroup = async (groupId: string): Promise<void> => {
  // Delete all memberships for this group
  const membershipsQuery = query(
    collection(db, "groupMembers"),
    where("groupId", "==", groupId)
  );

  const snapshot = await getDocs(membershipsQuery);

  const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);

  // Delete the group document
  await deleteDoc(doc(db, "groups", groupId));
};

export const joinGroup = async (
  groupId: string,
  userId: string
) => {
  await addDoc(collection(db, "groupMembers"), {
    userId,
    groupId,
    joinedAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "groups", groupId), {
    memberCount: increment(1),
    updatedAt: serverTimestamp(),
  });
};

export const leaveGroup = async (
  groupId: string,
  userId: string
) => {
  const membershipQuery = query(
    collection(db, "groupMembers"),
    where("groupId", "==", groupId),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(membershipQuery);

  if (!snapshot.empty) {
    await deleteDoc(snapshot.docs[0].ref);

    await updateDoc(doc(db, "groups", groupId), {
      memberCount: increment(-1),
      updatedAt: serverTimestamp(),
    });
  }
};
export const isUserJoined = async (
  groupId: string,
  userId: string
): Promise<boolean> => {
  const membershipQuery = query(
    collection(db, "groupMembers"),
    where("groupId", "==", groupId),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(membershipQuery);

  return !snapshot.empty;
};

export const getUserGroups = async (
  userId: string
): Promise<string[]> => {
  const membershipQuery = query(
    collection(db, "groupMembers"),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(membershipQuery);

  return snapshot.docs.map(
    (doc) => doc.data().groupId as string
  );
};
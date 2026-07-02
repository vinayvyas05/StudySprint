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
  getDoc,
} from "firebase/firestore";

import { db } from "@/config/firebase";
import { Group, CreateGroupPayload } from "@/types/group.types";
import { UserProfile } from "@/types/user.types";

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

      // Support both new `groupIds` array and old `groupId` string for backward compatibility
      const groupIds = (data.groupIds as string[]) || (data.groupId ? [data.groupId] : []);
      
      groupIds.forEach((groupId) => {
        counts[groupId] = (counts[groupId] || 0) + 1;
      });
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

export const getGroupById = async (groupId: string): Promise<Group | null> => {
  const docRef = doc(db, "groups", groupId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Group;
};

export const getGroupMembersWithProfiles = async (groupId: string): Promise<UserProfile[]> => {
  const membershipQuery = query(
    collection(db, "groupMembers"),
    where("groupId", "==", groupId)
  );
  const snapshot = await getDocs(membershipQuery);
  const userIds = snapshot.docs.map(doc => doc.data().userId as string);
  
  if (userIds.length === 0) return [];
  
  const profiles: UserProfile[] = [];
  const chunkSize = 30;
  for (let i = 0; i < userIds.length; i += chunkSize) {
    const chunk = userIds.slice(i, i + chunkSize);
    const usersQuery = query(collection(db, "users"), where("uid", "in", chunk));
    const userSnap = await getDocs(usersQuery);
    userSnap.forEach(doc => profiles.push(doc.data() as UserProfile));
  }
  return profiles;
};

export function subscribeToGroupFocusingUsers(
  groupId: string,
  onUpdate: (focusingUserIds: Set<string>) => void
) {
  const sessionsQuery = query(
    collection(db, "activeSessions"),
    where("isFocusing", "==", true)
  );

  return onSnapshot(sessionsQuery, (snapshot) => {
    const focusingUsers = new Set<string>();
    const now = Timestamp.now();

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const expiresAt = data.expiresAt as Timestamp | undefined;

      if (expiresAt && expiresAt.toMillis() < now.toMillis()) return;

      const groupIds = (data.groupIds as string[]) || (data.groupId ? [data.groupId] : []);
      
      if (groupIds.includes(groupId)) {
        focusingUsers.add(data.userId as string);
      }
    });

    onUpdate(focusingUsers);
  });
}
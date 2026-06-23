import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/config/firebase";
import { Group, CreateGroupPayload } from "@/types/group.types";

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
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/config/firebase";

export const getUserStats = async (uid: string) => {
  const userRef = doc(db, "users", uid);

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    throw new Error("User not found");
  }
  console.log(snapshot.data());
  return snapshot.data();

};

export const getUserSessions = async (uid: string) => {
  const q = query(
    collection(db, "sessions"),
    where("userId", "==", uid),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
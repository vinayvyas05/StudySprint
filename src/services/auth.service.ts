import { auth, db } from "@/config/firebase";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import type {
  LoginUserPayload,
  RegisterUserPayload,
} from "../types/auth.types";
import type {User} from "firebase/auth";
import { UserProfile } from "@/types/user.types";

export const registerUser = async ({
  name,
  email,
  password,
}: RegisterUserPayload): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const user = userCredential.user;

  await updateProfile(user, {
    displayName: name,
  });

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,

    name,
    email,

    xp: 0,
    level: 1,

    currentStreak: 0,
    longestStreak: 0,

    totalFocusMinutes: 0,
    totalSessions: 0,

    createdAt: serverTimestamp(),
  });


  return user;
};

export const loginUser = async ({ email, password }: LoginUserPayload): Promise<{
  firebaseUser: User;
  profile: UserProfile;
}> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

  return {
    firebaseUser: userCredential.user,
    profile: userDoc.data() as UserProfile,
  };
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const getUserProfile = async (uid: string): Promise<UserProfile> => {
  const docRef = doc(db, "users", uid);

  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    throw new Error("User profile not found");
  }

  return snapshot.data() as UserProfile;
};

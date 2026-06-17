import { auth, db } from "@/config/firebase";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";

interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
}

export async function registerUser({
  name,
  email,
  password,
}: RegisterUserPayload) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const user = userCredential.user;

  await updateProfile(user, {
    displayName: name,
  });

  console.log("Before Firestore");

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

    createdAt: new Date().toISOString(),
  });

  console.log("After Firestore");

  return user;
}

export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  console.log(userCredential.user);

  const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

  return {
    firebaseUser: userCredential.user,
    profile: userDoc.data(),
  };
};

export const logoutUser = async () => {
  console.log("Before logout", auth.currentUser);
  await signOut(auth);
  console.log("After logout", auth.currentUser);
};

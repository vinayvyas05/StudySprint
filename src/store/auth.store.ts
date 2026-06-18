import { create } from "zustand";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/config/firebase";

import {
  loginUser,
  logoutUser,
  registerUser,
  getUserProfile,
} from "@/services/auth.service";

import type { LoginUserPayload, RegisterUserPayload } from "@/types/auth.types";

import type { UserProfile } from "@/types/user.types";

interface AuthStore {
  user: UserProfile | null;

  loading: boolean;
  authLoading: boolean;

  register: (payload: RegisterUserPayload) => Promise<void>;

  login: (payload: LoginUserPayload) => Promise<void>;

  logout: () => Promise<void>;

  initializeAuth: () => (() => void);
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,

  loading: false,
  authLoading: true,

  register: async (payload) => {
    set({ loading: true });

    try {
      await registerUser(payload);
    } finally {
      set({ loading: false });
    }
  },

  login: async (payload) => {
    set({ loading: true });

    try {
        console.log("LOGIN START");
      const result = await loginUser(payload);

      set({
        user: result.profile,
      });
      console.log("USER STORED");
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    await logoutUser();

    set({
      user: null,
    });
  },

  initializeAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          set({
            user: null,
            authLoading: false,
          });

          return;
        }

        const profile = await getUserProfile(firebaseUser.uid);

        set({
          user: profile,
          authLoading: false,
        });
      } catch (error) {
        console.error(error);

        set({
          user: null,
          authLoading: false,
        });
      }
    });

    return unsubscribe;
  },
}));

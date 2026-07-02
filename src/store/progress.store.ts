import { create } from "zustand";

import {
  getUserStats,
  getUserSessions,
} from "@/services/progress.service";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";

interface ProgressState {
  stats: any;
  sessions: any[];

  loading: boolean;

  loadProgress: (uid: string) => Promise<void>;
  subscribeToStats: (uid: string) => () => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  stats: null,
  sessions: [],

  loading: false,

  loadProgress: async (uid) => {
    try {
      set({ loading: true });

      const [stats, sessions] = await Promise.all([
        getUserStats(uid),
        getUserSessions(uid),
      ]);

      set({
        stats,
        sessions,
      });
    } finally {
      set({ loading: false });
    }
  },

  subscribeToStats: (uid) => {
    const userRef = doc(db, "users", uid);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        set({ stats: snapshot.data() });
      }
    });
    return unsubscribe;
  },
}));
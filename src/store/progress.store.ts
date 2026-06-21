import { create } from "zustand";

import {
  getUserStats,
  getUserSessions,
} from "@/services/progress.service";

interface ProgressState {
  stats: any;
  sessions: any[];

  loading: boolean;

  loadProgress: (uid: string) => Promise<void>;
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
}));
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useEffect } from "react";

import { useAuthStore } from "@/store/auth.store";
import { useProgressStore } from "@/store/progress.store";

import { StatsGrid } from "../../../src/components/progress/StatsGrid";
import { RecentSprints } from "../../../src/components/progress/RecentSprints";
import { LevelCard } from "../../../src/components/progress/LevelCard";

export default function ProgressScreen() {
  const user = useAuthStore((state) => state.user);

  const { stats, sessions, loadProgress } = useProgressStore();

  useEffect(() => {
    if (!user?.uid) return;

    loadProgress(user.uid);
  }, [user?.uid]);

  if (!stats) {
    return null;
  }

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <LevelCard xp={stats.xp} level={stats.level} />
        <StatsGrid stats={stats} />

        <RecentSprints sessions={sessions} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 24,
  },
});

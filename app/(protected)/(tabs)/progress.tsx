import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "@/store/auth.store";
import { useProgressStore } from "@/store/progress.store";

import { LevelCard } from "../../../src/components/progress/LevelCard";
import { RecentSprints } from "../../../src/components/progress/RecentSprints";
import { StatsGrid } from "../../../src/components/progress/StatsGrid";

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
    <View style={styles.wrapper}>
      {/* Galaxy Background */}
      <View style={styles.galaxyBackground} />

      {/* Content */}
      <SafeAreaView style={styles.content}>
        <ScrollView contentContainerStyle={styles.container}>
          <LevelCard xp={stats.xp} level={stats.level} />
          <StatsGrid stats={stats} />
          <RecentSprints sessions={sessions} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "relative",
    backgroundColor: "#0a0e27",
  },
  galaxyBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#0a0e27",
    zIndex: 0,
  },
  content: {
    flex: 1,
    zIndex: 10,
    position: "relative",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 24,
  },
});

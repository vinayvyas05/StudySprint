import { View, StyleSheet } from "react-native";

import { StatCard } from "./StatCard";

export function StatsGrid({ stats }: any) {
  return (
    <View style={styles.container}>
      <StatCard
        title="XP"
        value={stats.xp}
      />

      <StatCard
        title="Focus"
        value={stats.totalFocusMinutes}
      />

      <StatCard
        title="Sessions"
        value={stats.totalSessions}
      />

      <StatCard
        title="Current Streak"
        value={stats.currentStreak}
      />

      <StatCard
        title="Longest Streak"
        value={stats.longestStreak}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
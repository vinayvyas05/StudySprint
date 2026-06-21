import { View, StyleSheet } from "react-native";

import { StatCard } from "./StatCard";

export function StatsGrid({ stats }: any) {
  return (
    <View style={styles.container}>
      <StatCard title="XP" value={stats.xp} icon="⚡" />

      <StatCard title="Focus" value={`${stats.totalFocusMinutes}m`} icon="🎯" />

      <StatCard title="Sessions" value={stats.totalSessions} icon="🏆" />

      <StatCard title="Streak" value={`${stats.currentStreak}`} icon="🔥" />
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

import { View, StyleSheet } from "react-native";
import { StatCard } from "./StatCard";

export function StatsGrid({ stats }: any) {
  return (
    <View style={styles.container}>
      <StatCard
        title="Focus Time"
        value={`${stats.totalFocusMinutes}m`}
        icon="timer-outline"
      />

      <StatCard
        title="Sessions"
        value={stats.totalSessions}
        icon="trophy-outline"
      />

      <StatCard
        title="Current Streak"
        value={stats.currentStreak}
        icon="fire"
      />

      <StatCard
        title="XP"
        value={stats.xp}
        icon="lightning-bolt-outline"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
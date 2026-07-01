import { View } from "react-native";
import { StatCard } from "./StatCard";

export function StatsGrid({ stats }: any) {
  return (
    <View className="flex-row flex-wrap gap-4 mt-2 justify-between">
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
        title="Total XP"
        value={stats.xp}
        icon="lightning-bolt-outline"
      />
    </View>
  );
}
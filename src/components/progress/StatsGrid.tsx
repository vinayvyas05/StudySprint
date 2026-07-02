import { View, Text } from "react-native";
import { StatCard } from "./StatCard";

export function StatsGrid({ stats }: any) {
  return (
    <View className="mt-2 mb-2">
      <Text className="text-white text-[19px] font-extrabold tracking-tight mb-4 ml-1">
        Stats
      </Text>
      <View className="flex-row flex-wrap gap-4 justify-between">
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
        value={stats.currentStreak || 0}
        icon="fire"
      />
      <StatCard
        title="Total XP"
        value={stats.xp}
        icon="lightning-bolt-outline"
      />
      </View>
    </View>
  );
}
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  xp: number;
  level: number;
}

export function LevelCard({ xp, level }: Props) {
  const currentLevelXp = (level - 1) * 100;
  const nextLevelXp = level * 100;
  const progress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  return (
    <View className="bg-[#161616] rounded-[24px] p-6 mb-2">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-2">
          <Ionicons name="star" size={16} color="#FFFFFF" />
          <Text className="text-[#A1A1AA] text-[12px] font-bold tracking-widest uppercase">Level {level}</Text>
        </View>
      </View>
      
      <View className="flex-row items-end gap-2 mb-6">
        <Text className="text-white text-5xl font-extrabold tracking-tighter">{xp}</Text>
        <Text className="text-[#71717A] text-lg font-bold pb-1.5">Total XP</Text>
      </View>

      <View className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-3">
        <View className="h-full bg-white rounded-full" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
      </View>

      <View className="flex-row items-center justify-between">
        <Text className="text-[#A1A1AA] text-[13px] font-medium">{nextLevelXp - xp} XP to next level</Text>
        <Text className="text-[#A1A1AA] text-[13px] font-medium">Level {level + 1}</Text>
      </View>
    </View>
  );
}
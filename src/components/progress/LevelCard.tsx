import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { calculateXPForLevel, getRankTitle } from "@/utils/progression.utils";
import { UserProfile } from "@/types/user.types";

interface Props {
  stats: UserProfile;
}

export function LevelCard({ stats }: Props) {
  const { xp = 0, level = 1, rankTitle } = stats;

  const currentLevelXp = calculateXPForLevel(level);
  const nextLevelXp = calculateXPForLevel(level + 1);
  const progress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
  
  const isLevelUpPending = xp >= nextLevelXp;
  
  const displayRank = rankTitle || getRankTitle(level);

  return (
    <View className="bg-[#1A1A1C] border border-white/[0.05] rounded-[32px] p-7 mb-2 relative overflow-hidden">
      {/* Background Decorator */}
      <View className="absolute -right-10 -top-10 w-40 h-40 bg-white/[0.02] rounded-full" />
      <View className="absolute -right-20 -bottom-10 w-32 h-32 bg-white/[0.03] rounded-full" />

      <View className="flex-row items-center justify-between mb-8">
        <View className="flex-row items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
          <Ionicons name="star" size={14} color="#FFFFFF" />
          <Text className="text-white text-[12px] font-extrabold tracking-widest uppercase">Level {level}</Text>
        </View>
        <Text className="text-[#A1A1AA] text-[11px] font-bold tracking-widest uppercase">{displayRank}</Text>
      </View>
      
      <View className="flex-row items-end gap-2 mb-6">
        <Text className="text-white text-[56px] leading-[64px] font-extrabold tracking-tighter">{xp}</Text>
        <Text className="text-[#71717A] text-[11px] font-bold pb-3 uppercase tracking-widest">Total XP</Text>
      </View>

      <View className="h-3.5 w-full bg-white/[0.04] rounded-full overflow-hidden mb-4">
        <View 
          className={`h-full rounded-full ${isLevelUpPending ? 'bg-emerald-400' : 'bg-white'}`} 
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} 
        />
      </View>

      <View className="flex-row items-center justify-between px-1">
        {isLevelUpPending ? (
          <Text className="text-emerald-400 text-[13px] font-bold tracking-tight">Level Up Pending!</Text>
        ) : (
          <Text className="text-[#A1A1AA] text-[13px] font-bold tracking-tight">{nextLevelXp - xp} XP to next level</Text>
        )}
        <Text className="text-white text-[13px] font-extrabold tracking-tight">Level {level + 1}</Text>
      </View>
    </View>
  );
}
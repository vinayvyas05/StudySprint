import React, { memo } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function SprintCardComponent({ session }: any) {
  const date = session.completedAt?.toDate?.()?.toLocaleDateString() ?? "Recently";

  return (
    <View className="bg-[#161616] rounded-[24px] p-5 mb-4 w-full flex-row items-center justify-between">
      <View className="flex-row items-center gap-4">
        <View className="w-12 h-12 rounded-full bg-white/[0.06] items-center justify-center">
           <Ionicons name="timer" size={20} color="#FFFFFF" />
        </View>
        <View>
           <Text className="text-white text-[16px] font-bold" numberOfLines={1}>Focus Session</Text>
           <Text className="text-[#A1A1AA] text-[13px] mt-0.5 font-medium">{date}</Text>
        </View>
      </View>
      
      <View className="items-end">
        <Text className="text-white text-[18px] font-extrabold">{session.focusMinutes}m</Text>
        <Text className="text-[#A1A1AA] text-[12px] font-bold">+{session.focusMinutes} XP</Text>
      </View>
    </View>
  );
}

export const SprintCard = memo(SprintCardComponent);
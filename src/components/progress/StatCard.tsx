import React, { memo } from "react";
import { View, Text } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface Props {
  title: string;
  value: string | number;
  icon: string;
}

function StatCardComponent({ title, value, icon }: Props) {
  return (
    <View className="bg-[#161616] rounded-[24px] p-5 flex-1 min-w-[45%]">
      <View className="w-10 h-10 rounded-full bg-white/[0.06] items-center justify-center mb-4">
        <MaterialCommunityIcons name={icon as any} size={20} color="#FFFFFF" />
      </View>
      <Text className="text-white text-2xl font-extrabold tracking-tight mb-1">{value}</Text>
      <Text className="text-[#A1A1AA] text-[13px] font-medium">{title}</Text>
    </View>
  );
}

export const StatCard = memo(StatCardComponent);
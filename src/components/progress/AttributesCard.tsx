import { View, Text, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserProfile } from "@/types/user.types";
import { useEffect, useRef } from "react";

interface Props {
  stats: UserProfile;
}

const AttributeBar = ({ label, score, icon, color }: { label: string, score: number, icon: any, color: string }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: score,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [score]);

  return (
    <View className="mb-5">
      <View className="flex-row items-center justify-between mb-2.5 px-1">
        <View className="flex-row items-center gap-2">
          <Ionicons name={icon} size={14} color={color} />
          <Text className="text-white text-[13px] font-bold tracking-tight">{label}</Text>
        </View>
        <Text className="text-white text-[13px] font-extrabold">{score} <Text className="text-[#52525B]">/ 99</Text></Text>
      </View>
      <View className="h-2.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
        <Animated.View 
          className="h-full rounded-full" 
          style={{ 
            backgroundColor: color, 
            width: widthAnim.interpolate({
              inputRange: [0, 99],
              outputRange: ['0%', '100%']
            }) 
          }} 
        />
      </View>
    </View>
  );
};

export function AttributesCard({ stats }: Props) {
  const attrs = stats.attributes || {
    endurance: 1,
    consistency: 1,
    competitiveness: 1,
    volume: 1,
  };

  return (
    <View className="mt-2 mb-2">
      <Text className="text-white text-[19px] font-extrabold tracking-tight mb-4 ml-1">
        Performance Attributes
      </Text>
      <View className="bg-[#1A1A1C] border border-white/[0.05] rounded-[32px] p-7">
      <AttributeBar label="Endurance" score={attrs.endurance} icon="battery-charging" color="#10B981" />
      <AttributeBar label="Consistency" score={attrs.consistency} icon="calendar" color="#3B82F6" />
      <AttributeBar label="Competitiveness" score={attrs.competitiveness} icon="trophy" color="#F59E0B" />
      <AttributeBar label="Volume" score={attrs.volume} icon="bar-chart" color="#8B5CF6" />
      </View>
    </View>
  );
}

import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type FocusTimerProps = {
  elapsedTime: number;
};

const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [hrs, mins, secs]
    .map((value) => value.toString().padStart(2, "0"))
    .join(":");
};

export default React.memo(function FocusTimer({
  elapsedTime,
}: FocusTimerProps) {
  return (
    <View 
      className="items-center justify-center rounded-full bg-neutral-900"
      style={{
        width: 240,
        height: 240,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.05)",
      }}
    >
      <View className="items-center justify-center bg-neutral-950 rounded-full border border-white/5" style={{ width: 210, height: 210 }}>
        {/* Subtle decorative inner rings */}
        <View className="absolute border border-white/[0.02] rounded-full" style={{ width: 190, height: 190 }} />
        
        <View className="items-center z-10">
          <Ionicons 
            name="infinite-outline" 
            size={24} 
            color="#FFFFFF"
            style={{ marginBottom: 4, opacity: 0.8 }}
          />

          <Text
            className="text-white text-5xl font-extrabold tracking-tighter"
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {formatTime(elapsedTime)}
          </Text>
          
          <Text className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-2">
            Open Focus
          </Text>
        </View>
      </View>
    </View>
  );
});
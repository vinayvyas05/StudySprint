import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  timeLeft: number;
  phaseColor: string;
  phaseLabel: string;
  isRunning: boolean;
}
export default React.memo(function CircularTimer({ timeLeft, phaseColor, phaseLabel, isRunning }: Props) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <View 
      className="items-center justify-center rounded-full bg-slate-900/40"
      style={{
        width: 220,
        height: 220,
        borderWidth: 6,
        borderColor: phaseColor,
      }}
    >
      <View className="items-center justify-center bg-slate-950/65 rounded-full" style={{ width: 194, height: 194 }}>
        {/* Subtle decorative inner rings */}
        <View className="absolute border border-white/5 rounded-full" style={{ width: 180, height: 180 }} />
        <View className="absolute border border-white/10 border-dashed rounded-full" style={{ width: 166, height: 166 }} />
        
        <View className="items-center z-10">
          {/* Active status icon */}
          <Ionicons 
            name={isRunning ? "play-circle" : "pause-circle"} 
            size={16} 
            color={phaseColor}
            style={{ marginBottom: 2, opacity: isRunning ? 0.8 : 0.5 }}
          />

          <Text
            className="text-white text-5xl font-extrabold tracking-tighter"
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {formattedTime}
          </Text>
          
          <Text className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mt-1">
            Remaining
          </Text>
        </View>
      </View>
    </View>
  );
});

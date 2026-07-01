import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  isRunning: boolean;
  hasStarted: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  phaseColor: string;
  label: string;
};

export default React.memo(function StartButton({
  isRunning,
  hasStarted,
  onStart,
  onPause,
  onReset,
  phaseColor,
  label,
}: Props) {
  const isWhiteBg = phaseColor.toUpperCase() === "#FFFFFF";

  // Initial State: Only Start Button
  if (!hasStarted) {
    return (
      <View className="w-full">
        <TouchableOpacity
          onPress={onStart}
          activeOpacity={0.85}
          className="w-full h-14 rounded-4xl flex-row items-center justify-center gap-2 shadow-lg"
          style={{ backgroundColor: phaseColor }}
        >
          <Ionicons name="play" size={20} color={isWhiteBg ? "#000000" : "#FFFFFF"} />
          <Text className="text-base font-bold tracking-wide" style={{ color: isWhiteBg ? "#000000" : "#FFFFFF" }}>
            {label}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Active State: Stop & Pause/Resume
  return (
    <View className="flex-row items-center justify-between gap-4 w-full">
      {/* Stop Button */}
      <TouchableOpacity
        onPress={onReset}
        activeOpacity={0.7}
        className="flex-1 h-14 bg-[#161616] border border-white/5 rounded-4xl flex-row items-center justify-center gap-2"
      >
        {/* <Ionicons name="square" size={16} color="#EF4444" /> */}
        <Text className="text-white text-base font-bold">Stop Sprint</Text>
      </TouchableOpacity>

      {/* Pause/Resume Button */}
      <TouchableOpacity
        onPress={isRunning ? onPause : onStart}
        activeOpacity={0.85}
        className="flex-1 h-14 rounded-4xl flex-row items-center justify-center gap-2 shadow-lg"
        style={{
          backgroundColor: isRunning ? "rgba(255, 255, 255, 0.08)" : phaseColor,
          borderColor: isRunning ? "rgba(255, 255, 255, 0.15)" : "transparent",
          borderWidth: isRunning ? 1 : 0,
        }}
      >
        {/* <Ionicons 
          name={isRunning ? "pause" : "play"} 
          size={20} 
          color={isRunning ? "#F1F5F9" : isWhiteBg ? "#000000" : "#FFFFFF"} 
        /> */}
        <Text 
          className="text-base font-bold tracking-wide"
          style={{ color: isRunning ? "#E2E8F0" : isWhiteBg ? "#000000" : "#FFFFFF" }}
        >
          {isRunning ? "Pause" : "Resume"}
        </Text>
      </TouchableOpacity>
    </View>
  );
});


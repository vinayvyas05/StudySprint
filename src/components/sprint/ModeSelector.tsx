import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type SessionMode = "sprint" | "focus";

type ModeSelectorProps = {
  mode: SessionMode;
  onModeChange: (mode: SessionMode) => void;
};

export const ModeSelector = React.memo(function ModeSelector({
  mode,
  onModeChange,
}: ModeSelectorProps) {
  return (
    <View className="flex-row rounded-full bg-white/[0.04] border border-white/[0.05] p-1 w-52 self-center mb-8">
      <TouchableOpacity
        className={`flex-1 rounded-full py-2.5 ${
          mode === "sprint" ? "bg-white/10" : ""
        }`}
        onPress={() => onModeChange("sprint")}
        activeOpacity={0.8}
      >
        <Text
          className={`text-center text-xs font-bold tracking-wider uppercase ${
            mode === "sprint" ? "text-white" : "text-slate-500"
          }`}
        >
          Sprint
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`flex-1 rounded-full py-2.5 ${
          mode === "focus" ? "bg-white/10" : ""
        }`}
        onPress={() => onModeChange("focus")}
        activeOpacity={0.8}
      >
        <Text
          className={`text-center text-xs font-bold tracking-wider uppercase ${
            mode === "focus" ? "text-white" : "text-slate-500"
          }`}
        >
          Focus
        </Text>
      </TouchableOpacity>
    </View>
  );
});
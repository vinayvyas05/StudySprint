import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  phaseColor: string;
};

export default function StartButton({
  isRunning,
  onStart,
  onPause,
  onReset,
  phaseColor,
}: Props) {
  return (
    <View className="flex-row items-center justify-center gap-4 w-full">
      {/* Reset Button (Secondary Icon) */}
      <TouchableOpacity
        onPress={onReset}
        activeOpacity={0.7}
        className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl items-center justify-center"
      >
        <Ionicons name="refresh" size={22} color="#94A3B8" />
      </TouchableOpacity>

      {/* Play/Pause Button (Primary Action) */}
      <TouchableOpacity
        onPress={isRunning ? onPause : onStart}
        activeOpacity={0.85}
        className="flex-1 h-14 rounded-2xl flex-row items-center justify-center gap-2 shadow-lg"
        style={{
          backgroundColor: isRunning ? "rgba(255, 255, 255, 0.08)" : phaseColor,
          borderColor: isRunning ? "rgba(255, 255, 255, 0.15)" : "transparent",
          borderWidth: isRunning ? 1 : 0,
          shadowColor: isRunning ? "transparent" : phaseColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: isRunning ? 0 : 6,
        }}
      >
        <Ionicons 
          name={isRunning ? "pause" : "play"} 
          size={20} 
          color={isRunning ? "#F1F5F9" : "#FFFFFF"} 
        />
        <Text 
          className="text-base font-bold tracking-wide"
          style={{ color: isRunning ? "#E2E8F0" : "#FFFFFF" }}
        >
          {isRunning ? "Pause" : "Start Sprint"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}


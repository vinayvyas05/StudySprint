import { Text, TouchableOpacity, View } from "react-native";

type SessionMode = "sprint" | "focus";

type ModeSelectorProps = {
  mode: SessionMode;
  onModeChange: (mode: SessionMode) => void;
};

export function ModeSelector({
  mode,
  onModeChange,
}: ModeSelectorProps) {
  return (
    <View className="mb-6 flex-row rounded-2xl bg-neutral-900 p-1">
      <TouchableOpacity
        className={`flex-1 rounded-xl py-3 ${
          mode === "sprint" ? "bg-white" : ""
        }`}
        onPress={() => onModeChange("sprint")}
        activeOpacity={0.8}
      >
        <Text
          className={`text-center font-semibold ${
            mode === "sprint"
              ? "text-black"
              : "text-neutral-400"
          }`}
        >
          Sprint
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`flex-1 rounded-xl py-3 ${
          mode === "focus" ? "bg-white" : ""
        }`}
        onPress={() => onModeChange("focus")}
        activeOpacity={0.8}
      >
        <Text
          className={`text-center font-semibold ${
            mode === "focus"
              ? "text-black"
              : "text-neutral-400"
          }`}
        >
          Focus
        </Text>
      </TouchableOpacity>
    </View>
  );
}
import { Text, View } from "react-native";

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

export default function FocusTimer({
  elapsedTime,
}: FocusTimerProps) {
  return (
    <View className="items-center justify-center">
      <Text className="text-6xl font-extrabold text-white">
        {formatTime(elapsedTime)}
      </Text>

      <Text className="mt-3 text-sm font-medium text-slate-400">
        Elapsed Focus Time
      </Text>
    </View>
  );
}
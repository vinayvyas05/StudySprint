import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type Props = {
  message: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export default function EmptyState({
  message,
  icon = "people-outline",
}: Props) {
  return (
    <View className="items-center justify-center py-12 px-6">
      <Ionicons name={icon} size={36} color="#334155" />
      <Text className="text-slate-600 text-[14px] font-medium text-center mt-3 leading-5">
        {message}
      </Text>
    </View>
  );
}

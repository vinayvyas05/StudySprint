import { View, Text } from "react-native";
import { SprintCard } from "./SprintCard";

export function RecentSprints({ sessions }: any) {
  return (
    <View className="mt-2">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-white text-[18px] font-bold">
          Recent Sprints
        </Text>
      </View>

      {!sessions || sessions.length === 0 ? (
        <View className="bg-[#161616] rounded-[24px] p-8 items-center justify-center">
           <Text className="text-[#A1A1AA] text-sm font-medium">No recent sprints found.</Text>
        </View>
      ) : (
        <View>
          {sessions.map((item: any) => (
            <SprintCard key={item.id} session={item} />
          ))}
        </View>
      )}
    </View>
  );
}
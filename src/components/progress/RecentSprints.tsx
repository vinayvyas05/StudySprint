import { View } from "react-native";
import { FlatList } from "react-native";
import { Text } from "react-native-paper";

import { SprintCard } from "./SprintCard";

export function RecentSprints({
  sessions,
}: any) {
  return (
    <View>
      <Text
        variant="headlineSmall"
        style={{
          marginBottom: 16,
        }}
      >
        Recent Sprints
      </Text>

      <FlatList
        scrollEnabled={false}
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SprintCard session={item} />
        )}
      />
    </View>
  );
}
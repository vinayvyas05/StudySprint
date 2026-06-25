import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface Props {
  title: string;
  value: string | number;
  icon: string;
}

function StatCardComponent({
  title,
  value,
  icon,
}: Props) {
  return (
    <Card style={styles.card} mode="contained">
      <Card.Content style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={icon as any}
            size={20}
            color="#FFFFFF"
          />
        </View>

        <Text style={styles.value}>
          {value}
        </Text>

        <Text style={styles.label}>
          {title}
        </Text>
      </Card.Content>
    </Card>
  );
}

export const StatCard = memo(StatCardComponent);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: "48%",
    borderRadius: 28,
  },

  content: {
    alignItems: "center",
    paddingVertical: 20,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  value: {
    fontSize: 32,
    fontWeight: "800",
  },

  label: {
    marginTop: 4,
    opacity: 0.6,
    fontSize: 13,
  },
});
import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";

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
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.icon}>
          {icon}
        </Text>

        <Text variant="labelMedium">
          {title}
        </Text>

        <Text style={styles.value}>
          {value}
        </Text>
      </Card.Content>
    </Card>
  );
}

export const StatCard = memo(
  StatCardComponent
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: "48%",
    borderRadius: 20,
  },

  icon: {
    fontSize: 24,
    marginBottom: 8,
  },

  value: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 4,
  },
});
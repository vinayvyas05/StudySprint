import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";

interface Props {
  title: string;
  value: string | number;
}

function StatCardComponent({
  title,
  value,
}: Props) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="labelMedium">
          {title}
        </Text>

        <Text variant="headlineSmall">
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
  },
});
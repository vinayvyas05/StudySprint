import React, { memo } from "react";
import { StyleSheet } from "react-native";
import {
  Card,
  Chip,
  Text,
} from "react-native-paper";

function SprintCardComponent({
  session,
}: any) {
  const date = session.completedAt
    ? new Date(
        session.completedAt.seconds * 1000
      ).toLocaleDateString()
    : "";

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Chip compact>
          +{session.focusMinutes} XP
        </Chip>

        <Text
          variant="titleMedium"
          style={styles.title}
        >
          {session.durationType}
        </Text>

        <Text variant="bodyMedium">
          Focus Time:{" "}
          {session.focusMinutes} mins
        </Text>

        <Text variant="bodySmall">
          {date}
        </Text>
      </Card.Content>
    </Card>
  );
}

export const SprintCard = memo(
  SprintCardComponent
);

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 18,
  },

  title: {
    marginTop: 12,
    marginBottom: 8,
  },
});
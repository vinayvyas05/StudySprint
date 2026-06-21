import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";

function SprintCardComponent({
  session,
}: any) {
  const date =
    session.completedAt?.toDate?.()
      ?.toLocaleDateString() ??
    "Recently";

  return (
    <Card
      mode="contained"
      style={styles.card}
    >
      <Card.Content>
        <View style={styles.row}>
          <Text style={styles.duration}>
            {session.focusMinutes}m
          </Text>

          <Text style={styles.xp}>
            +{session.focusMinutes} XP
          </Text>
        </View>

        <Text style={styles.label}>
          Focus Session
        </Text>

        <Text style={styles.date}>
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
    borderRadius: 24,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  duration: {
    fontSize: 32,
    fontWeight: "800",
  },

  xp: {
    color: "#6366F1",
    fontWeight: "700",
  },

  label: {
    marginTop: 8,
    opacity: 0.7,
  },

  date: {
    marginTop: 16,
    opacity: 0.5,
    fontSize: 12,
  },
});
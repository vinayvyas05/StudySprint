import React, { memo } from "react";
import { Card, Text } from "react-native-paper";

function SprintCardComponent({
  session,
}: any) {
  return (
    <Card>
      <Card.Content>
        <Text variant="titleMedium">
          {session.durationType}
        </Text>

        <Text>
          Focus: {session.focusMinutes} mins
        </Text>
      </Card.Content>
    </Card>
  );
}

export const SprintCard = memo(
  SprintCardComponent
);
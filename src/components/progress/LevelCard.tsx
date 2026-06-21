import { StyleSheet, View } from "react-native";
import { Surface, Text, ProgressBar } from "react-native-paper";

interface Props {
  xp: number;
  level: number;
}

export function LevelCard({ xp, level }: Props) {
  const currentLevelXp = (level - 1) * 100;
  const nextLevelXp = level * 100;

  const progress =
    (xp - currentLevelXp) /
    (nextLevelXp - currentLevelXp);

  return (
    <Surface
      elevation={3}
      style={styles.container}
    >
      <Text variant="titleMedium">
        Study Sprint Level
      </Text>

      <Text style={styles.level}>
        Level {level}
      </Text>

      <Text
        variant="bodyMedium"
        style={styles.xp}
      >
        {xp} XP
      </Text>

      <ProgressBar
        progress={progress}
        style={styles.progress}
      />

      <Text variant="bodySmall">
        {nextLevelXp - xp} XP until Level{" "}
        {level + 1}
      </Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 24,
    gap: 12,
  },

  level: {
    fontSize: 36,
    fontWeight: "700",
  },

  xp: {
    opacity: 0.7,
  },

  progress: {
    height: 10,
    borderRadius: 20,
  },
});
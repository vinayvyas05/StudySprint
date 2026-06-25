import { StyleSheet, View } from "react-native";
import { Surface, Text, ProgressBar } from "react-native-paper";

interface Props {
  xp: number;
  level: number;
}

export function LevelCard({
  xp,
  level,
}: Props) {
  const currentLevelXp =
    (level - 1) * 100;

  const nextLevelXp = level * 100;

  const progress =
    (xp - currentLevelXp) /
    (nextLevelXp - currentLevelXp);

  return (
    <Surface
      elevation={0}
      style={styles.container}
    >
      <Text style={styles.badge}>
        LEVEL {level}
      </Text>

      <Text style={styles.xp}>
        {xp}
      </Text>

      <Text style={styles.xpLabel}>
        Total XP
      </Text>

      <ProgressBar
        progress={progress}
        color="#FFFFFF"
        style={styles.progress}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {nextLevelXp - xp} XP to next
          level
        </Text>

        <Text style={styles.footerText}>
          Level {level + 1}
        </Text>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1d2e",
    borderRadius: 32,
    padding: 24,
  },

  badge: {
    color: "#94A3B8",
    letterSpacing: 2,
    fontWeight: "700",
  },

  xp: {
    color: "#FFF",
    fontSize: 52,
    fontWeight: "800",
    marginTop: 12,
  },

  xpLabel: {
    color: "#64748B",
    marginBottom: 24,
  },


  progress: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  footer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  footerText: {
    color: "#64748B",
    fontSize: 13,
  },
});
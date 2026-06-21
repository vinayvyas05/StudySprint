import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

const ACCENT = "#6366F1";
const TEXT_MUTED = "#64748B";

type Props = {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
};

export default function StartButton({
  isRunning,
  onStart,
  onPause,
  onReset,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Primary action */}
      <Button
        mode="contained"
        onPress={isRunning ? onPause : onStart}
        style={styles.primaryButton}
        contentStyle={styles.primaryContent}
        labelStyle={styles.primaryLabel}
        buttonColor={ACCENT}
        rippleColor="rgba(255,255,255,0.15)"
        icon={isRunning ? "pause" : "play"}
      >
        {isRunning ? "Pause" : "Start Sprint"}
      </Button>

      {/* Reset — subtle text button */}
      <Button
        mode="text"
        onPress={onReset}
        style={styles.resetButton}
        labelStyle={styles.resetLabel}
        textColor={TEXT_MUTED}
        icon="refresh"
        rippleColor="rgba(193,68,14,0.08)"
      >
        Reset
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
  },
  primaryButton: {
    borderRadius: 18,
    width: "90%",
  },
  primaryContent: {
    height: 58,
  },
  primaryLabel: {
    fontSize: 17,
    fontWeight: "700",
  },
  resetButton: {
    borderRadius: 20,
  },
  resetLabel: {
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
});

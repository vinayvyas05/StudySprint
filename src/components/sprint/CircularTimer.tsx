import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

// Design tokens
const RING_COLOR = "#C1440E"; // burnt sienna / terracotta
const RING_BG = "#FFF9F5"; // warm ivory inner face
const TEXT_MAIN = "#1C1412"; // near-black warm

export default function CircularTimer({ timeLeft }: { timeLeft: number }) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Subtle pop on every second tick
  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.025,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [timeLeft]);

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <View style={styles.outerRing}>
      <View style={styles.innerRing}>
        <View style={styles.face}>
          <Animated.Text
            style={[styles.timeText, { transform: [{ scale: scaleAnim }] }]}
          >
            {formattedTime}
          </Animated.Text>
          <Text style={styles.labelText}>remaining</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerRing: {
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 12,
    borderColor: "#6366F1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    shadowColor: "#6366F1",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10,
  },
  innerRing: {
    width: 270,
    height: 270,
    borderRadius: 135,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  face: {
    alignItems: "center",
  },
  timeText: {
    fontSize: 72,
    fontWeight: "800",
    color: "#0F172A",
    fontVariant: ["tabular-nums"],
  },
  labelText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 8,
    letterSpacing: 1,
  },
});

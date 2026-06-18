import { View, StyleSheet, Text } from "react-native";
import CircularTimer from "@/components/sprint/CircularTimer";
import SessionSelector from "@/components/sprint/SessionSelector";
import { useState, useEffect } from "react";
import StartButton from "@/components/sprint/StartButton";
import { SafeAreaView } from "react-native-safe-area-context";

type Phase = "focus" | "shortBreak" | "longBreak";
export default function SprintScreen() {
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  const [currentPhase, setCurrentPhase] = useState<Phase>("focus");
  const [currentCycle, setCurrentCycle] = useState(1);

  // reset when duration changes
  useEffect(() => {
    if (!isRunning && currentPhase === "focus") {
      setTimeLeft(selectedDuration * 60);
    }
  }, [selectedDuration, isRunning, currentPhase]);

  // timer engine
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      // Focus finished
      if (currentPhase === "focus") {
        if (currentCycle === 4) {
          setCurrentPhase("longBreak");
          setTimeLeft(20 * 60);
        } else {
          setCurrentPhase("shortBreak");
          setTimeLeft(5 * 60);
        }
      }

      // Short break finished
      else if (currentPhase === "shortBreak") {
        setCurrentCycle((prev) => prev + 1);

        setCurrentPhase("focus");
        setTimeLeft(selectedDuration * 60);
      }

      // Long break finished
      else if (currentPhase === "longBreak") {
        setIsRunning(false);

        console.log("Sprint Completed");
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentPhase, currentCycle, selectedDuration]);

  const resetTimer = () => {
    setIsRunning(false);

    setCurrentPhase("focus");
    setCurrentCycle(1);

    setTimeLeft(selectedDuration * 60);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top} />

      <View style={styles.headerInfo}>
        <Text style={styles.cycleText}>Cycle {currentCycle}/4</Text>

        <Text style={styles.phaseText}>
          {currentPhase === "focus" && "Focus Time"}
          {currentPhase === "shortBreak" && "Short Break"}
          {currentPhase === "longBreak" && "Long Break"}
        </Text>
      </View>

      <View style={styles.timerSection}>
        <CircularTimer timeLeft={timeLeft} />
      </View>

      <StartButton
        isRunning={isRunning}
        onStart={() => setIsRunning(true)}
        onPause={() => setIsRunning(false)}
        onReset={resetTimer}
      />

      <View style={styles.bottom}>
        <SessionSelector
          selected={selectedDuration}
          setSelected={setSelectedDuration}
          disabled={isRunning}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  timerSection: {
    flex: 1,
    justifyContent: "center",
  },
  bottom: {
    height: 90,
  },
  headerInfo: {
    alignItems: "center",
    marginBottom: 24,
  },

  cycleText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 6,
  },

  phaseText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
});

import { View, StyleSheet } from "react-native";
import CircularTimer from "@/components/sprint/CircularTimer";
import SessionSelector from "@/components/sprint/SessionSelector";
import { useState, useEffect } from "react";
import StartButton from "@/components/sprint/StartButton";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SprintScreen() {
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  // reset when duration changes
  useEffect(() => {
    setTimeLeft(selectedDuration * 60);
    setIsRunning(false);
  }, [selectedDuration]);

  // timer engine
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      setIsRunning(false);
      console.log("Session Completed");
      // later: XP update trigger
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(selectedDuration * 60);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top} />

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
    height: 80,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  timerSection: {
    flex: 1,
    justifyContent: "center",
  },
  bottom: {
    height: 120,
  },
});

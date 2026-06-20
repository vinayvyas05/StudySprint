import { View, StyleSheet, Text } from "react-native";
import CircularTimer from "@/components/sprint/CircularTimer";
import SessionSelector from "@/components/sprint/SessionSelector";
import StartButton from "@/components/sprint/StartButton";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "@/store/auth.store";
import { createSession, updateUserStats } from "@/services/session.service";

import { usePomodoroTimer } from "@/hooks/usePomodoroTimer";

type Phase = "focus" | "shortBreak" | "longBreak";

export default function SprintScreen() {
  const user = useAuthStore((state) => state.user);

  const [selectedDuration, setSelectedDuration] = useState(1); //after testing is done set it to 25

  // 🔥 Firestore + XP logic stays here (clean separation)
  const handleSprintComplete = async () => {
    if (!user) return;

    const totalFocus = selectedDuration * 4;

    await createSession({
      userId: user.uid,
      focusMinutes: totalFocus,
      cyclesCompleted: 4,
      durationType: selectedDuration,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    await updateUserStats(user.uid, totalFocus);
  };

  // 🔥 Timer logic moved to hook
  const {
    timeLeft,
    isRunning,
    currentPhase,
    currentCycle,
    start,
    pause,
    reset,
  } = usePomodoroTimer(selectedDuration, handleSprintComplete);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top} />

      {/* Header */}
      <View style={styles.headerInfo}>
        <Text style={styles.cycleText}>
          Cycle {currentCycle}/4
        </Text>

        <Text style={styles.phaseText}>
          {currentPhase === "focus" && "Focus Time"}
          {currentPhase === "shortBreak" && "Short Break"}
          {currentPhase === "longBreak" && "Long Break"}
          {currentPhase === "completed" && "Sprint Complete 🎉"}
        </Text>
      </View>

      {/* Timer */}
      <View style={styles.timerSection}>
        <CircularTimer timeLeft={timeLeft} />
      </View>

      {/* Controls */}
      <StartButton
        isRunning={isRunning}
        onStart={start}
        onPause={pause}
        onReset={reset}
      />

      {/* Session selector */}
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
  timerSection: {
    flex: 1,
    justifyContent: "center",
  },
  bottom: {
    height: 90,
  },
});
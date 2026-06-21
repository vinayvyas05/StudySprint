import CircularTimer from "@/components/sprint/CircularTimer";
import SessionSelector from "@/components/sprint/SessionSelector";
import StartButton from "@/components/sprint/StartButton";
import { useState } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { usePomodoroTimer } from "@/hooks/usePomodoroTimer";
import { createSession, updateUserStats } from "@/services/session.service";
import { useAuthStore } from "@/store/auth.store";

// ─── Design tokens ───────────────────────────────────────────────
const BG = "#F8FAFC";
const ACCENT = "#6366F1";
const TEXT_MAIN = "#0F172A";
const TEXT_SUB = "#64748B";

// ─── Per-phase display config ────────────────────────────────────
const PHASE_CONFIG = {
  focus: {
    label: "FOCUS",
    hint: "",
    dot: "#6366F1",
  },
  shortBreak: {
    label: "BREAK",
    hint: "",
    dot: "#22C55E",
  },
  longBreak: {
    label: "LONG BREAK",
    hint: "",
    dot: "#06B6D4",
  },
  completed: {
    label: "COMPLETE",
    hint: "",
    dot: "#F59E0B",
  },
} as const;

// ─── Component ───────────────────────────────────────────────────
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

  const phase = PHASE_CONFIG[currentPhase] ?? PHASE_CONFIG.focus;

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* ── Page title ── */}
      <View style={styles.pageHeader}>
        <Text style={styles.screenTitle}>Sprint</Text>
      </View>

      {/* ── Phase header ── */}
      <View style={styles.phaseHeader}>
        {/* Cycle dots */}
        <View style={styles.cycleDots}>
          {[1, 2, 3, 4].map((c) => (
            <View
              key={c}
              style={[
                styles.dot,
                c < currentCycle && styles.dotDone,
                c === currentCycle && {
                  backgroundColor: phase.dot,
                  width: 20,
                  borderRadius: 4,
                },
              ]}
            />
          ))}
        </View>

        <Text style={styles.phaseLabel}>{phase.label}</Text>
        <Text style={styles.phaseHint}>{phase.hint}</Text>
        <Text style={styles.cycleLabel}>Cycle {currentCycle} / 4</Text>
      </View>

      {/* ── Timer ── */}
      <View style={styles.timerSection}>
        <CircularTimer timeLeft={timeLeft} />
      </View>

      {/* ── Controls ── */}
      <StartButton
        isRunning={isRunning}
        onStart={start}
        onPause={pause}
        onReset={reset}
      />

      {/* ── Session selector ── */}
      <Divider style={styles.divider} />
      <SessionSelector
        selected={selectedDuration}
        setSelected={setSelectedDuration}
        disabled={isRunning}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },

  // Page title bar
  pageHeader: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  appTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: TEXT_SUB,
    letterSpacing: 2.5,
    textTransform: "uppercase",
  },

  // Phase info block
  phaseHeader: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 24,
    gap: 8,
  },
  cycleDots: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0CEC6",
  },
  dotDone: {
    backgroundColor: "#C1440E",
    opacity: 0.35,
    width: 8,
    borderRadius: 4,
  },
  phaseLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: ACCENT,
    letterSpacing: 2,
  },
  phaseHint: {
    display: "none",
  },
  cycleLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: TEXT_SUB,
    letterSpacing: 0,
    textTransform: "none",
  },

  // Timer block
  timerSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Divider between timer area and session
  divider: {
    backgroundColor: "#E2E8F0",
    marginHorizontal: 24,
    marginBottom: 12,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: TEXT_MAIN,
  },
});

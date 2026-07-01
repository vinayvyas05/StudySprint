import CircularTimer from "@/components/sprint/CircularTimer";
import SessionSelector from "@/components/sprint/SessionSelector";
import StartButton from "@/components/sprint/StartButton";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, StatusBar, Text, View, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { ModeSelector } from "@/components/sprint/ModeSelector";
import type { SessionMode } from "../../../src/types/focus.types";
import FocusTimer from "@/components/sprint/FocusTimer";
import { usePomodoroTimer } from "@/hooks/usePomodoroTimer";
import { useFocusSession } from "@/hooks/useFocusSession";
import { createSession, updateUserStats } from "@/services/session.service";
import { useAuthStore } from "@/store/auth.store";
import {
  startActiveSession,
  stopActiveSession,
} from "@/services/active-session.service";
import { getUserGroups } from "@/services/group.service";

const PHASE_CONFIG = {
  focus: {
    label: "Focus Session",
    subtitle: "Stay dedicated, block out distractions",
    color: "#FFFFFF", // White
  },
  shortBreak: {
    label: "Short Break",
    subtitle: "Rest, stretch, grab a glass of water",
    color: "#A3A3A3", // Neutral-400 Gray
  },
  longBreak: {
    label: "Long Break",
    subtitle: "Recharge your energy, you've done great",
    color: "#737373", // Neutral-500 Gray
  },
  completed: {
    label: "Sprint Completed",
    subtitle: "Congratulations! Sessions finished",
    color: "#FFFFFF", // White
  },
} as const;

export default function SprintScreen() {
  const user = useAuthStore((state) => state.user);
  const [mode, setMode] = useState<SessionMode>("sprint");
  const [selectedDuration, setSelectedDuration] = useState(1);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim])
  );

  // ─── Track user's groups for active session ────────────
  const userGroupIdsRef = useRef<string[]>([]);
  const isSessionActiveRef = useRef(false);

  useEffect(() => {
    if (!user?.uid) return;

    getUserGroups(user.uid)
      .then((groupIds) => {
        userGroupIdsRef.current = groupIds;
      })
      .catch((err) => {
        console.error("Failed to fetch user groups:", err);
      });
  }, [user?.uid]);

  // ─── Active session helpers ───────────────────────────────────
  const beginActiveSession = useCallback(
    async (durationMinutes: number) => {
      if (!user || userGroupIdsRef.current.length === 0) return;

      try {
        await startActiveSession({
          userId: user.uid,
          groupIds: userGroupIdsRef.current,
          displayName: user.name,
          durationMinutes,
        });
        isSessionActiveRef.current = true;
      } catch (err) {
        console.error("Failed to start active session:", err);
      }
    },
    [user]
  );

  const endActiveSession = useCallback(async () => {
    if (!user || !isSessionActiveRef.current) return;

    try {
      await stopActiveSession(user.uid);
      isSessionActiveRef.current = false;
    } catch (err) {
      console.error("Failed to stop active session:", err);
    }
  }, [user]);

  // Clean up active session on unmount
  useEffect(() => {
    return () => {
      if (isSessionActiveRef.current && user?.uid) {
        stopActiveSession(user.uid).catch(console.error);
      }
    };
  }, [user?.uid]);

  // 🔥 Firestore + XP logic stays here (clean separation)
  const handleSprintComplete = useCallback(async () => {
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
    await endActiveSession();
  }, [user, selectedDuration, endActiveSession]);

  // 🔥 Timer logic moved to hook
  const {
    timeLeft,
    isRunning: isSprintRunning,
    currentPhase,
    currentCycle,
    start: startSprint,
    pause: pauseSprint,
    reset: resetSprint,
  } = usePomodoroTimer(selectedDuration, handleSprintComplete); // 🔥 Pomodoro timer
  const {
    elapsedTime,
    isRunning: isFocusRunning,
    start: startFocus,
    stop: stopFocus,
    reset: resetFocus,
  } = useFocusSession(); // 🔥 Focus session timer

  // ─── Wrapped sprint handlers ──────────────────────────────────
  const handleSprintStart = useCallback(() => {
    startSprint();
    // Set expiration to cover all 4 cycles and breaks (approx)
    // It will be explicitly cleared by handleSprintComplete when finished.
    beginActiveSession(selectedDuration * 4 + 20);
  }, [startSprint, beginActiveSession, selectedDuration]);

  const handleSprintPause = useCallback(() => {
    pauseSprint();
    endActiveSession();
  }, [pauseSprint, endActiveSession]);

  const handleSprintReset = useCallback(() => {
    resetSprint();
    endActiveSession();
  }, [resetSprint, endActiveSession]);

  // ─── Wrapped focus handlers ───────────────────────────────────
  const handleFocusStart = useCallback(() => {
    startFocus();
    beginActiveSession(480); // 8h max for open-ended focus
  }, [startFocus, beginActiveSession]);

  const handleFocusStop = useCallback(() => {
    stopFocus();
    endActiveSession();
  }, [stopFocus, endActiveSession]);

  const handleFocusReset = useCallback(() => {
    resetFocus();
    endActiveSession();
  }, [resetFocus, endActiveSession]);

  const phase = PHASE_CONFIG[currentPhase] ?? PHASE_CONFIG.focus;

  // ─── Avoid recreating handleModeChange every second ───────────
  const stateRef = useRef({ isSprintActive: false, isFocusActive: false });
  stateRef.current = {
    isSprintActive:
      isSprintRunning ||
      timeLeft !== selectedDuration * 60 ||
      currentCycle !== 1 ||
      currentPhase !== "focus",
    isFocusActive: isFocusRunning || elapsedTime > 0,
  };

  const handleModeChange = useCallback(
    (newMode: SessionMode) => {
      if (newMode === mode) return;

      const { isSprintActive, isFocusActive } = stateRef.current;

      if (mode === "sprint" && isSprintActive) {
        Alert.alert(
          "Active Session",
          "Please reset your Sprint before switching to Focus mode."
        );
        return;
      }

      if (mode === "focus" && isFocusActive) {
        Alert.alert(
          "Active Session",
          "Please reset your Focus session before switching to Sprint mode."
        );
        return;
      }

      setMode(newMode);
    },
    [mode]
  );

  // ─── Memoize heavy phase indicators ─────────────────────────────
  const phaseIndicators = useMemo(() => {
    return (
      <View className="flex-row items-center justify-center gap-3 w-full px-12">
        {[1, 2, 3, 4].map((c) => {
          const isCompleted = c < currentCycle;
          const isActive = c === currentCycle;

          return (
            <View
              key={c}
              className="h-1.5 rounded-full flex-1"
              style={{
                backgroundColor: isActive
                  ? phase.color
                  : isCompleted
                    ? `${phase.color}60`
                    : "rgba(255, 255, 255, 0.05)",
                shadowColor: phase.color,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: isActive ? 0.6 : 0,
                shadowRadius: 8,
                elevation: isActive ? 4 : 0,
              }}
            />
          );
        })}
      </View>
    );
  }, [currentCycle, phase.color]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      <Animated.View
        style={[{ flex: 1, backgroundColor: "#121212", opacity: fadeAnim }]}
        className="px-6 pt-10 pb-36"
      >
        {/* ── Page Header ── */}
        <View className="flex-row items-center justify-between pb-6">
          <View>
            <Text className="text-white text-3xl font-extrabold tracking-tight">
              Timer
            </Text>
            <Text className="text-neutral-400 text-[10px] tracking-widest uppercase mt-0.5 font-bold">
              Productivity Focus
            </Text>
          </View>
          <View className="bg-white/5 border border-white/10 rounded-2xl px-3 py-1 flex-row items-center gap-1.5">
            <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse will-change-animation" />
            <Text className="text-slate-300 text-[10px] font-bold uppercase tracking-wider">
              Live
            </Text>
          </View>
        </View>

        <ModeSelector mode={mode} onModeChange={handleModeChange} />

        {/* ── Center Stage: Timer & Phase Info ── */}
        <View className="flex-1 justify-center items-center">
           {/* The Timer component itself */}
           <View className="mb-10">
             {mode === "sprint" ? (
               <CircularTimer
                 timeLeft={timeLeft}
                 phaseColor={phase.color}
                 phaseLabel={phase.label}
                 isRunning={isSprintRunning}
               />
             ) : (
               <FocusTimer elapsedTime={elapsedTime} />
             )}
           </View>
           
           {/* Phase Info underneath (only for sprint) */}
           {mode === "sprint" && (
             <View className="w-full items-center">
               <Text className="text-2xl font-extrabold text-white mb-1 tracking-tight">
                 {phase.label}
               </Text>
               <Text className="text-xs text-slate-400 font-medium mb-8">
                 {phase.subtitle}
               </Text>
               {phaseIndicators}
             </View>
           )}
        </View>

        {/* ── Bottom Controls ── */}
        <View className="pt-4 pb-2 w-full">
          {mode === "sprint" && (
            <View className="mb-6">
              <SessionSelector
                selected={selectedDuration}
                setSelected={setSelectedDuration}
                disabled={isSprintRunning}
                phaseColor={phase.color}
              />
            </View>
          )}

          <StartButton
            isRunning={mode === "sprint" ? isSprintRunning : isFocusRunning}
            hasStarted={mode === "sprint" ? stateRef.current.isSprintActive : stateRef.current.isFocusActive}
            onStart={mode === "sprint" ? handleSprintStart : handleFocusStart}
            onPause={mode === "sprint" ? handleSprintPause : handleFocusStop}
            onReset={mode === "sprint" ? handleSprintReset : handleFocusReset}
            phaseColor={mode === "sprint" ? phase.color : "#FFFFFF"}
            label={mode === "sprint" ? "Start Sprint" : "Start Focus"}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}


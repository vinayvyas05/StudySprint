import CircularTimer from "@/components/sprint/CircularTimer";
import SessionSelector from "@/components/sprint/SessionSelector";
import StartButton from "@/components/sprint/StartButton";
import { useCallback, useEffect, useRef, useState } from "react";
import { StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

// ─── Per-phase display config ────────────────────────────────────
const PHASE_CONFIG = {
  focus: {
    label: "Focus Session",
    subtitle: "Stay dedicated, block out distractions",
    color: "#FFFFFF", // White
  },
  shortBreak: {
    label: "Short Break",
    subtitle: "Rest, stretch, grab a glass of water",
    color: "#10B981", // Emerald
  },
  longBreak: {
    label: "Long Break",
    subtitle: "Recharge your energy, you've done great",
    color: "#06B6D4", // Cyan
  },
  completed: {
    label: "Sprint Completed",
    subtitle: "Congratulations! Sessions finished",
    color: "#F59E0B", // Amber
  },
} as const;

export default function SprintScreen() {
  const user = useAuthStore((state) => state.user);
  const [mode, setMode] = useState<SessionMode>("sprint");
  const [selectedDuration, setSelectedDuration] = useState(1); // after testing is done set it to 25

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
    await endActiveSession();
  };

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
    beginActiveSession(selectedDuration);
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0a0e27" }}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0e27" />

      {/* Main Container */}
      <View
        style={{ flex: 1, backgroundColor: "#0a0e27" }}
        className="justify-between px-6 py-4"
      >
        {/* ── Page Header ── */}
        <View className="flex-row items-center justify-between pb-1">
          <View>
            <Text className="text-white text-3xl font-extrabold tracking-tight">
              Sprint
            </Text>
            <Text className="text-slate-400 text-[10px] tracking-widest uppercase mt-0.5 font-bold">
              Pomodoro Focus Timer
            </Text>
          </View>
          <View className="bg-white/5 border border-white/10 rounded-2xl px-3 py-1 flex-row items-center gap-1.5">
            <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <Text className="text-slate-300 text-[10px] font-bold uppercase tracking-wider">
              Live
            </Text>
          </View>
        </View>

        <ModeSelector mode={mode} onModeChange={setMode} />

        {mode === "sprint" && (
          <View className="p-4 bg-white/[0.03] border border-white/10 rounded-3xl items-center shadow-lg shadow-black/20">
            <View className="flex-row items-center justify-center gap-2 mb-3 w-full px-1">
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
                          ? `${phase.color}75`
                          : "rgba(255, 255, 255, 0.08)",
                      shadowColor: phase.color,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: isActive ? 0.8 : 0,
                      shadowRadius: 6,
                      elevation: isActive ? 4 : 0,
                    }}
                  />
                );
              })}
            </View>

            {/* Phase Meta */}
            <Text className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mb-1">
              {currentPhase === "focus" ? "Focus Session" : "Rest Break"}
            </Text>

            {/* Current phase and state */}
            <Text className="text-xl font-extrabold text-white mb-0.5">
              {phase.label}
            </Text>

            <Text className="text-xs text-slate-400 text-center font-medium px-4">
              {phase.subtitle}
            </Text>

            <View className="mt-3 bg-white/5 border border-white/5 rounded-full px-3 py-1 flex-row items-center gap-1.5">
              <Text className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">
                Cycle {currentCycle} of 4
              </Text>
            </View>
          </View>
        )}

        {/* ── Timer Section ── */}
        <View className="justify-center items-center py-2">
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

        {/* ── Controls & Selector Dock ── */}
        <View className="gap-4 w-full">
          <StartButton
            isRunning={mode === "sprint" ? isSprintRunning : isFocusRunning}
            onStart={mode === "sprint" ? handleSprintStart : handleFocusStart}
            onPause={mode === "sprint" ? handleSprintPause : handleFocusStop}
            onReset={mode === "sprint" ? handleSprintReset : handleFocusReset}
            phaseColor={phase.color}
          />

          {mode === "sprint" && (
            <View className="border-t border-white/5 pt-2">
              <SessionSelector
                selected={selectedDuration}
                setSelected={setSelectedDuration}
                disabled={isSprintRunning}
                phaseColor={phase.color}
              />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}


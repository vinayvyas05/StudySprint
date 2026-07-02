import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useAudioPlayer } from "expo-audio";

type Phase = "focus" | "shortBreak" | "longBreak" | "completed";

export function usePomodoroTimer(
  selectedDuration: number,
  onComplete: () => void,
) {
  const player = useAudioPlayer(require("../../assets/audio/completion.mp3"));

  const [timeLeft, setTimeLeft] = useState(selectedDuration * 60);
  const [isRunning, setIsRunning] = useState(false);

  const [currentPhase, setCurrentPhase] = useState<Phase>("focus");
  const [currentCycle, setCurrentCycle] = useState(1);

  const hasCompletedRef = useRef(false);

  // reset on duration change
  useEffect(() => {
    if (currentPhase === "focus") {
      setTimeLeft(selectedDuration * 60);
    }
  }, [selectedDuration]);

  // Handle app backgrounding
  const backgroundTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      if (nextAppState.match(/inactive|background/) && isRunning) {
        backgroundTimeRef.current = Date.now();
      } else if (nextAppState === "active" && backgroundTimeRef.current && isRunning) {
        const timeAway = Math.floor((Date.now() - backgroundTimeRef.current) / 1000);
        backgroundTimeRef.current = null;
        
        setTimeLeft((prev) => Math.max(0, prev - timeAway));
      }
    });

    return () => subscription.remove();
  }, [isRunning]);

  // Stable timer interval: only restarts when isRunning changes
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Handle phase transitions only when timeLeft hits 0
  useEffect(() => {
    if (timeLeft !== 0) return;

    // focus → break
    if (currentPhase === "focus") {
      if (currentCycle === 4) {
        setCurrentPhase("longBreak");
        setTimeLeft(5); // for testing purpose
        
        // Play completion sound
        player.play();
      } else {
        setCurrentPhase("shortBreak");
        setTimeLeft(3); // for testing purpose
      }
    }

    // break → focus
    else if (currentPhase === "shortBreak") {
      setCurrentCycle((p) => p + 1);
      setCurrentPhase("focus");
      setTimeLeft(selectedDuration * 60);
    }

    // sprint complete
    else if (currentPhase === "longBreak") {
      setIsRunning(false);

      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onComplete();
        setCurrentPhase("completed");
      }
    }
  }, [timeLeft, currentPhase, currentCycle, selectedDuration, onComplete]);

  const start = useCallback(() => {
    if (currentPhase === "completed") {
      setCurrentPhase("focus");
      setCurrentCycle(1);
      setTimeLeft(selectedDuration * 60);
      hasCompletedRef.current = false;
    }

    setIsRunning(true);
  }, [currentPhase, selectedDuration]);

  const pause = useCallback(() => setIsRunning(false), []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setCurrentPhase("focus");
    setCurrentCycle(1);
    setTimeLeft(selectedDuration * 60);
    hasCompletedRef.current = false;
  }, [selectedDuration]);

  return {
    timeLeft,
    isRunning,
    currentPhase,
    currentCycle,
    start,
    pause,
    reset,
  };
}

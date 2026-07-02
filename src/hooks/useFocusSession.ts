import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

export function useFocusSession() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const start = useCallback(() => {
    if (intervalRef.current) return;

    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  }, []);

  const clearTimer = useCallback(() => {
    if (!intervalRef.current) return;

    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const stop = useCallback(() => {
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setElapsedTime(0);
  }, [clearTimer]);

  // Handle app backgrounding
  const backgroundTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      if (nextAppState.match(/inactive|background/) && isRunning) {
        backgroundTimeRef.current = Date.now();
      } else if (nextAppState === "active" && backgroundTimeRef.current && isRunning) {
        const timeAway = Math.floor((Date.now() - backgroundTimeRef.current) / 1000);
        backgroundTimeRef.current = null;
        
        setElapsedTime((prev) => prev + timeAway);
      }
    });

    return () => subscription.remove();
  }, [isRunning]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    elapsedTime,
    isRunning,
    start,
    stop,
    reset,
  };
}

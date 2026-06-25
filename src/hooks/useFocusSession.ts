import { useEffect, useRef, useState } from "react";

export function useFocusSession() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const start = () => {
    if (intervalRef.current) return;

    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  };

  const clearTimer = () => {
    if (!intervalRef.current) return;

    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const stop = () => {
    clearTimer();
    setIsRunning(false);
  };

  const reset = () => {
    clearTimer();
    setIsRunning(false);
    setElapsedTime(0);
  };

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

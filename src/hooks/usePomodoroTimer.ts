import { useEffect, useRef, useState } from "react";

type Phase = "focus" | "shortBreak" | "longBreak" | "completed";

export function usePomodoroTimer(
  selectedDuration: number,
  onComplete: () => void,
) {
  const [timeLeft, setTimeLeft] = useState(selectedDuration * 60);
  const [isRunning, setIsRunning] = useState(false);

  const [currentPhase, setCurrentPhase] = useState<Phase>("focus");
  const [currentCycle, setCurrentCycle] = useState(1);

  const hasCompletedRef = useRef(false);

  // reset on duration change
  useEffect(() => {
    if (!isRunning && currentPhase === "focus") {
      setTimeLeft(selectedDuration * 60);
    }
  }, [selectedDuration]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((p) => p - 1);
      }, 1000);
    }

    if (timeLeft === 0) {
      // focus → break
      if (currentPhase === "focus") {
        if (currentCycle === 4) {
          setCurrentPhase("longBreak");
          // setTimeLeft(20 * 60); // correct login
          setTimeLeft(5); // for testing purpose
        } else {
          setCurrentPhase("shortBreak");
          // setTimeLeft(5 * 60); // correct logic
          setTimeLeft(3);  // for testing purpose
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
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentPhase, currentCycle]);

  const start = () => {
    if (currentPhase === "completed") {
      setCurrentPhase("focus");
      setCurrentCycle(1);
      setTimeLeft(selectedDuration * 60);
      hasCompletedRef.current = false;
    }

    setIsRunning(true);
  };
  const pause = () => setIsRunning(false);

  const reset = () => {
    setIsRunning(false);
    setCurrentPhase("focus");
    setCurrentCycle(1);
    setTimeLeft(selectedDuration * 60);
    hasCompletedRef.current = false;
  };

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

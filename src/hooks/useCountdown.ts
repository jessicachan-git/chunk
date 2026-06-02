import { useState, useEffect, useCallback, useRef } from 'react';

interface UseCountdownOptions {
  initialSeconds: number;
  autoStart?: boolean;
  onComplete?: () => void;
}

export function useCountdown({ initialSeconds, autoStart = false, onComplete }: UseCountdownOptions) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!isRunning || remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onCompleteRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, remaining]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback((seconds?: number) => {
    setRemaining(seconds ?? initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  const progress = 1 - remaining / initialSeconds;

  return { remaining, isRunning, progress, start, pause, reset };
}

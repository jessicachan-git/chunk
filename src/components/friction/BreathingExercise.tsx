import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useWakeLock } from '../../hooks/useWakeLock';

interface BreathingExerciseProps {
  durationSeconds: number;
  pattern: [number, number, number, number];
  onComplete: () => void;
}

const PHASES = ['Breathe In', 'Hold', 'Breathe Out', 'Hold'] as const;

export function BreathingExercise({ durationSeconds, pattern, onComplete }: BreathingExerciseProps) {
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseElapsed, setPhaseElapsed] = useState(0);

  useWakeLock(started);

  const cycleDuration = pattern.reduce((a, b) => a + b, 0);
  const currentPhaseDuration = pattern[phaseIndex];

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      setElapsed((prev) => {
        if (prev + 1 >= durationSeconds) {
          clearInterval(interval);
          onComplete();
          return durationSeconds;
        }
        return prev + 1;
      });
      setPhaseElapsed((prev) => {
        const next = prev + 1;
        if (next >= pattern[phaseIndex]) {
          setPhaseIndex((pi) => (pi + 1) % 4);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started, durationSeconds, onComplete, pattern, phaseIndex]);

  const handleStart = useCallback(() => setStarted(true), []);

  const scale = phaseIndex === 0
    ? 1 + (phaseElapsed / currentPhaseDuration) * 0.3
    : phaseIndex === 2
      ? 1.3 - (phaseElapsed / currentPhaseDuration) * 0.3
      : phaseIndex === 1 ? 1.3 : 1;

  const cyclesCompleted = Math.floor(elapsed / cycleDuration);
  const totalCycles = Math.ceil(durationSeconds / cycleDuration);

  if (!started) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-6 text-center"
      >
        <h2 className="text-2xl font-semibold">Breathing Exercise</h2>
        <p className="text-muted max-w-xs">
          Follow the rhythm. {pattern[0]}-{pattern[1]}-{pattern[2]}-{pattern[3]} breathing pattern.
        </p>
        <div className="w-32 h-32 rounded-full bg-accent/20 border-2 border-accent/40 flex items-center justify-center">
          <span className="text-accent text-sm font-medium">Ready</span>
        </div>
        <button
          onClick={handleStart}
          className="px-8 py-3 rounded-2xl bg-accent text-white font-medium shadow-lg shadow-accent/20"
        >
          Begin
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-8 text-center"
    >
      <h2 className="text-xl font-medium text-muted">
        {PHASES[phaseIndex]}
      </h2>
      <motion.div
        animate={{ scale }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="w-40 h-40 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center"
      >
        <span className="text-3xl font-mono text-accent">
          {currentPhaseDuration - phaseElapsed}
        </span>
      </motion.div>
      <p className="text-sm text-muted">
        Cycle {cyclesCompleted + 1} of {totalCycles}
      </p>
    </motion.div>
  );
}

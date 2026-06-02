import { useCountdown } from '../../hooks/useCountdown';
import { useWakeLock } from '../../hooks/useWakeLock';
import { ProgressRing } from '../ui/ProgressRing';
import { formatDuration } from '../../utils/time';
import { motion } from 'framer-motion';

interface DelayTimerProps {
  durationSeconds: number;
  onComplete: () => void;
}

export function DelayTimer({ durationSeconds, onComplete }: DelayTimerProps) {
  const { remaining, progress, start, isRunning } = useCountdown({
    initialSeconds: durationSeconds,
    autoStart: false,
    onComplete,
  });

  useWakeLock(isRunning);

  if (!isRunning && remaining === durationSeconds) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-6 text-center"
      >
        <h2 className="text-2xl font-semibold">Wait Period</h2>
        <p className="text-muted max-w-xs">
          Take a moment to pause. Are you sure you want to continue?
        </p>
        <ProgressRing progress={0} size={180} strokeWidth={5}>
          <span className="text-3xl font-mono font-semibold">
            {formatDuration(durationSeconds)}
          </span>
        </ProgressRing>
        <button
          onClick={start}
          className="px-8 py-3 rounded-2xl bg-accent text-white font-medium shadow-lg shadow-accent/20"
        >
          Start Timer
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-6 text-center"
    >
      <h2 className="text-2xl font-semibold">Waiting...</h2>
      <p className="text-muted">Sit with this feeling. It will pass.</p>
      <ProgressRing progress={progress} size={180} strokeWidth={5}>
        <span className="text-3xl font-mono font-semibold">
          {formatDuration(remaining)}
        </span>
      </ProgressRing>
      <p className="text-sm text-muted">Keep this screen open</p>
    </motion.div>
  );
}

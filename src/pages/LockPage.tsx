import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLockStore } from '../stores/useLockStore';
import { useAnalyticsStore } from '../stores/useAnalyticsStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressRing } from '../components/ui/ProgressRing';
import { useCountdown } from '../hooks/useCountdown';
import { formatDuration } from '../utils/time';

const DURATION_OPTIONS = [
  { label: '30m', minutes: 30 },
  { label: '1h', minutes: 60 },
  { label: '2h', minutes: 120 },
  { label: '4h', minutes: 240 },
  { label: '8h', minutes: 480 },
  { label: '∞', minutes: null },
];

export function LockPage() {
  const { isCurrentlyLocked, enterLockMode, exitLockMode, lockEndsAt, lockStartedAt } = useLockStore();
  const { recordLockStart, recordLockEnd } = useAnalyticsStore();
  const [selectedDuration, setSelectedDuration] = useState<number | null>(60);

  const locked = isCurrentlyLocked();

  const handleLock = async () => {
    enterLockMode(selectedDuration);
    const targetEnd = selectedDuration ? Date.now() + selectedDuration * 60 * 1000 : null;
    await recordLockStart(selectedDuration ? 'timed' : 'indefinite', targetEnd);
  };

  const handleUnlock = async () => {
    exitLockMode();
    await recordLockEnd('', 'unlock');
  };

  if (locked) {
    return <ActiveLock lockEndsAt={lockEndsAt} lockStartedAt={lockStartedAt} onExit={handleUnlock} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold">Focus Mode</h1>
        <p className="text-muted mt-1">Lock your passcode away</p>
      </div>

      <Card>
        <p className="text-sm text-muted mb-4">How long do you want to focus?</p>
        <div className="grid grid-cols-3 gap-2">
          {DURATION_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setSelectedDuration(opt.minutes)}
              className={`py-3 px-4 rounded-xl text-center font-medium transition-all ${
                selectedDuration === opt.minutes
                  ? 'bg-accent text-white shadow-lg shadow-accent/20'
                  : 'bg-surface border border-surface-border text-muted hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Card>

      <Button onClick={handleLock} size="lg" className="w-full">
        {selectedDuration ? `Lock for ${selectedDuration >= 60 ? `${selectedDuration / 60}h` : `${selectedDuration}m`}` : 'Lock Indefinitely'}
      </Button>

      <p className="text-xs text-muted text-center">
        While locked, you&apos;ll need to scan an NFC tag and complete friction layers to access your Screen Time passcode.
      </p>
    </motion.div>
  );
}

function ActiveLock({
  lockEndsAt,
  lockStartedAt,
  onExit,
}: {
  lockEndsAt: number | null;
  lockStartedAt: number | null;
  onExit: () => void;
}) {
  const totalDuration = lockEndsAt && lockStartedAt ? (lockEndsAt - lockStartedAt) / 1000 : 0;
  const remainingCalc = lockEndsAt ? Math.max(0, Math.floor((lockEndsAt - Date.now()) / 1000)) : 0;

  const { remaining } = useCountdown({
    initialSeconds: remainingCalc,
    autoStart: lockEndsAt !== null,
    onComplete: onExit,
  });

  const progress = totalDuration > 0 ? 1 - remaining / totalDuration : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-8 pt-8"
    >
      <h1 className="text-2xl font-bold">Focus Active</h1>

      {lockEndsAt ? (
        <ProgressRing progress={progress} size={220} strokeWidth={6}>
          <div className="text-center">
            <p className="text-4xl font-mono font-bold">{formatDuration(remaining)}</p>
            <p className="text-sm text-muted mt-1">remaining</p>
          </div>
        </ProgressRing>
      ) : (
        <div className="w-[220px] h-[220px] rounded-full border-4 border-accent/30 flex items-center justify-center animate-pulse-slow">
          <div className="text-center">
            <p className="text-2xl font-bold">∞</p>
            <p className="text-sm text-muted mt-1">Indefinite</p>
          </div>
        </div>
      )}

      <Card className="w-full text-center">
        <p className="text-muted text-sm">
          Your Screen Time passcode is locked. To access it, scan your NFC tag or QR code.
        </p>
      </Card>

      <Button variant="ghost" size="sm" onClick={onExit} className="text-muted">
        Exit without unlocking
      </Button>
    </motion.div>
  );
}

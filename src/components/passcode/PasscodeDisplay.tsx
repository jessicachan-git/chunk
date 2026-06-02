import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { decryptPasscode } from '../../crypto/vault';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useCountdown } from '../../hooks/useCountdown';
import { Card } from '../ui/Card';

interface PasscodeDisplayProps {
  onExpired: () => void;
}

export function PasscodeDisplay({ onExpired }: PasscodeDisplayProps) {
  const [passcode, setPasscode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const revealDuration = useSettingsStore((s) => s.passcodeRevealDuration);

  const { remaining, progress } = useCountdown({
    initialSeconds: revealDuration,
    autoStart: true,
    onComplete: onExpired,
  });

  useEffect(() => {
    decryptPasscode().then(setPasscode);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!passcode) return;
    await navigator.clipboard.writeText(passcode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [passcode]);

  if (!passcode) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6"
    >
      <h2 className="text-xl font-semibold text-success">Unlocked</h2>
      <Card glow className="w-full text-center">
        <p className="text-sm text-muted mb-3">Your Screen Time Passcode</p>
        <p className="text-5xl font-mono font-bold tracking-[0.3em] text-white">
          {passcode}
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            onClick={handleCopy}
            className="text-sm text-accent hover:text-accent-soft transition-colors"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </Card>
      <div className="flex flex-col items-center gap-2">
        <div className="w-full bg-surface-border rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            style={{ width: `${(1 - progress) * 100}%` }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </div>
        <p className="text-sm text-muted">
          Hiding in {remaining}s
        </p>
      </div>
      <p className="text-xs text-muted/60 text-center max-w-xs">
        Go to Settings → Screen Time → enter this passcode to temporarily adjust your limits.
      </p>
    </motion.div>
  );
}

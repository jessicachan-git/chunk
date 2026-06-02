import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { generatePasscode } from '../../crypto/random';
import { encryptPasscode } from '../../crypto/vault';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface PasscodeGeneratorProps {
  onGenerated: (passcode: string) => void;
}

export function PasscodeGenerator({ onGenerated }: PasscodeGeneratorProps) {
  const passcodeLength = useSettingsStore((s) => s.passcodeLength);
  const [passcode, setPasscode] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleGenerate = useCallback(() => {
    const code = generatePasscode(passcodeLength);
    setPasscode(code);
    setSaved(false);
  }, [passcodeLength]);

  const handleConfirm = useCallback(async () => {
    if (!passcode) return;
    await encryptPasscode(passcode);
    setSaved(true);
    onGenerated(passcode);
  }, [passcode, onGenerated]);

  return (
    <div className="flex flex-col gap-6">
      {!passcode ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6"
        >
          <p className="text-muted text-center">
            Generate a passcode you won&apos;t memorize. This will become your Screen Time passcode.
          </p>
          <Button onClick={handleGenerate} size="lg">
            Generate Passcode
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <Card glow className="w-full text-center">
            <p className="text-sm text-muted mb-2">Your new passcode</p>
            <p className="text-5xl font-mono font-bold tracking-[0.3em]">{passcode}</p>
          </Card>
          {!saved && (
            <>
              <p className="text-sm text-warning text-center">
                Set this as your Screen Time passcode NOW before continuing.
                You won&apos;t see it again easily.
              </p>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={handleGenerate}>
                  Regenerate
                </Button>
                <Button onClick={handleConfirm}>
                  I&apos;ve Set It
                </Button>
              </div>
            </>
          )}
          {saved && (
            <p className="text-success text-sm">Passcode encrypted and saved.</p>
          )}
        </motion.div>
      )}
    </div>
  );
}

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLockStore } from '../stores/useLockStore';
import { useAnalyticsStore } from '../stores/useAnalyticsStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useEffect } from 'react';

export function HomePage() {
  const navigate = useNavigate();
  const { isLocked, isCurrentlyLocked, getRemainingSeconds } = useLockStore();
  const { currentStreak, totalSessions, totalUnlocks } = useAnalyticsStore();
  const onboardingComplete = useSettingsStore((s) => s.onboardingComplete);

  useEffect(() => {
    if (!onboardingComplete) {
      navigate('/onboarding');
    }
  }, [onboardingComplete, navigate]);

  const locked = isCurrentlyLocked();
  const remaining = getRemainingSeconds();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="text-center mb-2">
        <h1 className="text-3xl font-bold">Chunk</h1>
        <p className="text-muted mt-1">Your focus vault</p>
      </div>

      <Card glow={locked} className="text-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
              locked
                ? 'bg-accent/20 border-2 border-accent animate-pulse-slow'
                : 'bg-surface border-2 border-surface-border'
            }`}
          >
            {locked ? '🔒' : '🔓'}
          </div>
          <div>
            <p className="font-semibold text-lg">
              {locked ? 'Focus Mode Active' : 'Unlocked'}
            </p>
            {locked && isLocked && remaining > 0 && (
              <p className="text-muted text-sm mt-1">
                {Math.floor(remaining / 3600) > 0 && `${Math.floor(remaining / 3600)}h `}
                {Math.floor((remaining % 3600) / 60)}m remaining
              </p>
            )}
            {locked && remaining === 0 && (
              <p className="text-muted text-sm mt-1">Indefinite lock</p>
            )}
          </div>
          {!locked && (
            <Button onClick={() => navigate('/lock')} className="mt-2">
              Enter Focus Mode
            </Button>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center py-4 px-2">
          <p className="text-2xl font-bold text-accent">{currentStreak}</p>
          <p className="text-xs text-muted mt-1">Day Streak</p>
        </Card>
        <Card className="text-center py-4 px-2">
          <p className="text-2xl font-bold">{totalSessions}</p>
          <p className="text-xs text-muted mt-1">Sessions</p>
        </Card>
        <Card className="text-center py-4 px-2">
          <p className="text-2xl font-bold">{totalUnlocks}</p>
          <p className="text-xs text-muted mt-1">Unlocks</p>
        </Card>
      </div>

      {!locked && (
        <Card className="text-center">
          <p className="text-muted text-sm">
            Your distracting apps are currently accessible.
            Enter focus mode to lock your Screen Time passcode behind friction layers.
          </p>
        </Card>
      )}
    </motion.div>
  );
}

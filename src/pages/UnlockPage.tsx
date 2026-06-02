import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../db/database';
import { useUnlockStore } from '../stores/useUnlockStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useAnalyticsStore } from '../stores/useAnalyticsStore';
import { FrictionPipeline } from '../components/friction/FrictionPipeline';
import { PasscodeDisplay } from '../components/passcode/PasscodeDisplay';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { FrictionStepState } from '../types';

export function UnlockPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { status, startUnlock, startFriction, failUnlock, reset } = useUnlockStore();
  const frictionLayers = useSettingsStore((s) => s.frictionLayers);
  const { recordUnlockAttempt } = useAnalyticsStore();
  const [startTime] = useState(Date.now());

  const token = searchParams.get('token');
  const stationParam = searchParams.get('station');

  useEffect(() => {
    if (!token) {
      failUnlock('No unlock token provided. Scan your NFC tag or QR code.');
      return;
    }

    const validate = async () => {
      const station = await db.unlockStations.where('token').equals(token).first();

      if (!station) {
        failUnlock('Invalid token. This QR code or NFC tag is not recognized.');
        return;
      }

      const enabledLayers = frictionLayers
        .filter((l) => l.enabled)
        .sort((a, b) => a.order - b.order);

      const steps: FrictionStepState[] = enabledLayers.map((l) => ({
        layerId: l.id,
        status: 'pending',
        startedAt: null,
        completedAt: null,
      }));

      startUnlock(station.id, station.name, steps);

      if (steps.length === 0) {
        useUnlockStore.getState().completeUnlock();
      } else {
        startFriction();
      }
    };

    validate();

    return () => {
      reset();
    };
  }, [token, stationParam, frictionLayers, startUnlock, startFriction, failUnlock, reset]);

  const handleExpired = async () => {
    await recordUnlockAttempt(stationParam, true, Date.now() - startTime);
    reset();
    navigate('/');
  };

  const handleAbandon = async () => {
    await recordUnlockAttempt(stationParam, false, Date.now() - startTime);
    reset();
    navigate('/');
  };

  if (status === 'failed') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-6 pt-12"
      >
        <div className="w-16 h-16 rounded-full bg-danger/20 border-2 border-danger/40 flex items-center justify-center text-2xl">
          ✕
        </div>
        <Card className="text-center w-full">
          <p className="text-danger font-medium">Unlock Failed</p>
          <p className="text-muted text-sm mt-2">
            {useUnlockStore.getState().error}
          </p>
        </Card>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Go Home
        </Button>
      </motion.div>
    );
  }

  if (status === 'verifying') {
    return (
      <div className="flex flex-col items-center gap-4 pt-20">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-muted">Verifying...</p>
      </div>
    );
  }

  if (status === 'complete') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="pt-8"
      >
        <PasscodeDisplay onExpired={handleExpired} />
      </motion.div>
    );
  }

  if (status === 'friction') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col gap-6 pt-4"
      >
        <FrictionPipeline />
        <div className="text-center mt-4">
          <Button variant="ghost" size="sm" onClick={handleAbandon}>
            Nevermind, stay focused
          </Button>
        </div>
      </motion.div>
    );
  }

  return null;
}

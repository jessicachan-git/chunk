import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { db } from '../db/database';
import { generateId } from '../crypto/random';
import { getToday } from '../utils/time';
import { indexedDBStorage } from './storage';
import type { LockSession, UnlockAttempt } from '../types';

interface AnalyticsState {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  totalUnlocks: number;
}

interface AnalyticsActions {
  recordLockStart: (mode: 'timed' | 'indefinite', targetEndAt: number | null) => Promise<string>;
  recordLockEnd: (sessionId: string, reason: 'timer' | 'unlock' | 'emergency') => Promise<void>;
  recordUnlockAttempt: (stationId: string | null, completed: boolean, durationMs: number) => Promise<void>;
  updateDailyLog: () => Promise<void>;
  recalculate: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState & AnalyticsActions>()(
  persist(
    (set) => ({
      currentStreak: 0,
      longestStreak: 0,
      totalSessions: 0,
      totalUnlocks: 0,

      recordLockStart: async (mode, targetEndAt) => {
        const session: LockSession = {
          id: generateId(),
          startedAt: Date.now(),
          endedAt: null,
          targetEndAt,
          mode,
          endReason: null,
        };
        await db.lockSessions.put(session);
        set((s) => ({ totalSessions: s.totalSessions + 1 }));
        return session.id;
      },

      recordLockEnd: async (sessionId, reason) => {
        await db.lockSessions.update(sessionId, {
          endedAt: Date.now(),
          endReason: reason,
        });
      },

      recordUnlockAttempt: async (stationId, completed, durationMs) => {
        const attempt: UnlockAttempt = {
          id: generateId(),
          timestamp: Date.now(),
          stationId,
          completed,
          abandonedAtStep: null,
          frictionDurationMs: durationMs,
        };
        await db.unlockAttempts.put(attempt);
        if (completed) {
          set((s) => ({ totalUnlocks: s.totalUnlocks + 1 }));
        }
      },

      updateDailyLog: async () => {
        const today = getToday();
        const existing = await db.dailyLogs.get(today);
        const sessions = await db.lockSessions
          .where('startedAt')
          .above(new Date(today).getTime())
          .toArray();

        const totalLockedMinutes = sessions.reduce((acc, s) => {
          const end = s.endedAt ?? Date.now();
          return acc + (end - s.startedAt) / 60000;
        }, 0);

        const attempts = await db.unlockAttempts
          .where('timestamp')
          .above(new Date(today).getTime())
          .toArray();

        await db.dailyLogs.put({
          id: today,
          date: today,
          totalLockedMinutes: Math.round(totalLockedMinutes),
          unlockCount: attempts.filter((a) => a.completed).length,
          abandonedCount: attempts.filter((a) => !a.completed).length,
          ...(existing || {}),
        });
      },

      recalculate: async () => {
        const sessions = await db.lockSessions.count();
        const unlocks = await db.unlockAttempts.where('completed').equals(1).count();
        set({ totalSessions: sessions, totalUnlocks: unlocks });
      },
    }),
    {
      name: 'chunk-analytics',
      storage: createJSONStorage(() => indexedDBStorage),
    },
  ),
);

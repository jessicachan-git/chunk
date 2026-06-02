import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from './storage';

interface LockState {
  isLocked: boolean;
  lockStartedAt: number | null;
  lockEndsAt: number | null;
  lockMode: 'timed' | 'indefinite';
}

interface LockActions {
  enterLockMode: (durationMinutes: number | null) => void;
  exitLockMode: () => void;
  isCurrentlyLocked: () => boolean;
  getRemainingSeconds: () => number;
}

export const useLockStore = create<LockState & LockActions>()(
  persist(
    (set, get) => ({
      isLocked: false,
      lockStartedAt: null,
      lockEndsAt: null,
      lockMode: 'indefinite',

      enterLockMode: (durationMinutes) => {
        const now = Date.now();
        set({
          isLocked: true,
          lockStartedAt: now,
          lockEndsAt: durationMinutes ? now + durationMinutes * 60 * 1000 : null,
          lockMode: durationMinutes ? 'timed' : 'indefinite',
        });
      },

      exitLockMode: () =>
        set({
          isLocked: false,
          lockStartedAt: null,
          lockEndsAt: null,
          lockMode: 'indefinite',
        }),

      isCurrentlyLocked: () => {
        const state = get();
        if (!state.isLocked) return false;
        if (state.lockMode === 'indefinite') return true;
        if (state.lockEndsAt && Date.now() >= state.lockEndsAt) {
          set({ isLocked: false, lockStartedAt: null, lockEndsAt: null });
          return false;
        }
        return true;
      },

      getRemainingSeconds: () => {
        const state = get();
        if (!state.isLocked || !state.lockEndsAt) return 0;
        return Math.max(0, Math.floor((state.lockEndsAt - Date.now()) / 1000));
      },
    }),
    {
      name: 'chunk-lock',
      storage: createJSONStorage(() => indexedDBStorage),
    },
  ),
);

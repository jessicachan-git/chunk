import { create } from 'zustand';
import type { FrictionStepState } from '../types';

type UnlockStatus = 'idle' | 'verifying' | 'friction' | 'complete' | 'failed';

interface UnlockState {
  status: UnlockStatus;
  stationId: string | null;
  stationName: string | null;
  frictionSteps: FrictionStepState[];
  currentStepIndex: number;
  error: string | null;
  completedAt: number | null;
}

interface UnlockActions {
  startUnlock: (stationId: string, stationName: string, steps: FrictionStepState[]) => void;
  setVerifying: () => void;
  startFriction: () => void;
  advanceStep: () => void;
  completeStep: (index: number) => void;
  completeUnlock: () => void;
  failUnlock: (error: string) => void;
  reset: () => void;
}

export const useUnlockStore = create<UnlockState & UnlockActions>()((set, get) => ({
  status: 'idle',
  stationId: null,
  stationName: null,
  frictionSteps: [],
  currentStepIndex: 0,
  error: null,
  completedAt: null,

  startUnlock: (stationId, stationName, steps) =>
    set({
      status: 'verifying',
      stationId,
      stationName,
      frictionSteps: steps,
      currentStepIndex: 0,
      error: null,
      completedAt: null,
    }),

  setVerifying: () => set({ status: 'verifying' }),

  startFriction: () => {
    const steps = get().frictionSteps;
    if (steps.length > 0) {
      steps[0].status = 'active';
      steps[0].startedAt = Date.now();
    }
    set({ status: 'friction', frictionSteps: [...steps], currentStepIndex: 0 });
  },

  advanceStep: () => {
    const { frictionSteps, currentStepIndex } = get();
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < frictionSteps.length) {
      frictionSteps[nextIndex].status = 'active';
      frictionSteps[nextIndex].startedAt = Date.now();
      set({ frictionSteps: [...frictionSteps], currentStepIndex: nextIndex });
    }
  },

  completeStep: (index) => {
    const { frictionSteps } = get();
    frictionSteps[index].status = 'complete';
    frictionSteps[index].completedAt = Date.now();
    set({ frictionSteps: [...frictionSteps] });

    const allComplete = frictionSteps.every((s) => s.status === 'complete');
    if (allComplete) {
      set({ status: 'complete', completedAt: Date.now() });
    } else {
      get().advanceStep();
    }
  },

  completeUnlock: () => set({ status: 'complete', completedAt: Date.now() }),

  failUnlock: (error) => set({ status: 'failed', error }),

  reset: () =>
    set({
      status: 'idle',
      stationId: null,
      stationName: null,
      frictionSteps: [],
      currentStepIndex: 0,
      error: null,
      completedAt: null,
    }),
}));

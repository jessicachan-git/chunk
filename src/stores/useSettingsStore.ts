import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { FrictionLayerConfig } from '../types';
import { DEFAULT_FRICTION_LAYERS, PASSCODE_REVEAL_DURATION, EMERGENCY_WAIT_MINUTES } from '../utils/constants';
import { indexedDBStorage } from './storage';

interface SettingsState {
  theme: 'dark' | 'light' | 'system';
  passcodeLength: 4 | 6;
  passcodeRevealDuration: number;
  frictionLayers: FrictionLayerConfig[];
  emergencyWaitMinutes: number;
  requireSpecificStation: boolean;
  onboardingComplete: boolean;
}

interface SettingsActions {
  updateSettings: (partial: Partial<SettingsState>) => void;
  reorderFrictionLayers: (layers: FrictionLayerConfig[]) => void;
  toggleFrictionLayer: (id: string, enabled: boolean) => void;
  completeOnboarding: () => void;
}

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      theme: 'dark',
      passcodeLength: 4,
      passcodeRevealDuration: PASSCODE_REVEAL_DURATION,
      frictionLayers: DEFAULT_FRICTION_LAYERS,
      emergencyWaitMinutes: EMERGENCY_WAIT_MINUTES,
      requireSpecificStation: false,
      onboardingComplete: false,

      updateSettings: (partial) => set(partial),

      reorderFrictionLayers: (layers) => set({ frictionLayers: layers }),

      toggleFrictionLayer: (id, enabled) =>
        set((state) => ({
          frictionLayers: state.frictionLayers.map((l) =>
            l.id === id ? { ...l, enabled } : l,
          ),
        })),

      completeOnboarding: () => set({ onboardingComplete: true }),
    }),
    {
      name: 'chunk-settings',
      storage: createJSONStorage(() => indexedDBStorage),
    },
  ),
);

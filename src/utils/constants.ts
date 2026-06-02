import type { FrictionLayerConfig } from '../types';

export const DEFAULT_FRICTION_LAYERS: FrictionLayerConfig[] = [
  {
    id: 'delay',
    enabled: true,
    order: 0,
    settings: { type: 'delay', durationSeconds: 180 },
  },
  {
    id: 'breathing',
    enabled: true,
    order: 1,
    settings: { type: 'breathing', durationSeconds: 60, pattern: [4, 4, 4, 4] },
  },
  {
    id: 'reflection',
    enabled: true,
    order: 2,
    settings: {
      type: 'reflection',
      prompt: 'Why do you want to unlock right now? Is this intentional or impulsive?',
      minLength: 50,
    },
  },
  {
    id: 'typing',
    enabled: true,
    order: 3,
    settings: {
      type: 'typing',
      phrase: 'I am choosing to break my focus intentionally and accept the consequences.',
    },
  },
  {
    id: 'math',
    enabled: false,
    order: 4,
    settings: { type: 'math', difficulty: 'medium', problemCount: 3 },
  },
];

export const PASSCODE_REVEAL_DURATION = 45;
export const EMERGENCY_WAIT_MINUTES = 15;

export const STATION_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
];

export const STATION_ICONS = ['🏠', '🚗', '📚', '🛁', '🌳', '🏃', '🧘', '☕'];

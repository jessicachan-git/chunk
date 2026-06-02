export type FrictionLayerId =
  | 'delay'
  | 'reflection'
  | 'typing'
  | 'math'
  | 'breathing';

export interface FrictionLayerConfig {
  id: FrictionLayerId;
  enabled: boolean;
  order: number;
  settings: FrictionLayerSettings;
}

export type FrictionLayerSettings =
  | { type: 'delay'; durationSeconds: number }
  | { type: 'reflection'; prompt: string; minLength: number }
  | { type: 'typing'; phrase: string }
  | { type: 'math'; difficulty: 'easy' | 'medium' | 'hard'; problemCount: number }
  | { type: 'breathing'; durationSeconds: number; pattern: [number, number, number, number] };

export interface FrictionStepState {
  layerId: FrictionLayerId;
  status: 'pending' | 'active' | 'complete';
  startedAt: number | null;
  completedAt: number | null;
}

export interface UnlockStation {
  id: string;
  name: string;
  token: string;
  createdAt: number;
  color: string;
  icon: string;
}

export interface LockSession {
  id: string;
  startedAt: number;
  endedAt: number | null;
  targetEndAt: number | null;
  mode: 'timed' | 'indefinite';
  endReason: 'timer' | 'unlock' | 'emergency' | null;
}

export interface UnlockAttempt {
  id: string;
  timestamp: number;
  stationId: string | null;
  completed: boolean;
  abandonedAtStep: string | null;
  frictionDurationMs: number;
}

export interface DailyLog {
  id: string;
  date: string;
  totalLockedMinutes: number;
  unlockCount: number;
  abandonedCount: number;
}

export interface WeeklySummary {
  weekStart: string;
  totalLockedHours: number;
  totalUnlocks: number;
  totalAbandoned: number;
  streakDays: number;
  avgSessionMinutes: number;
}

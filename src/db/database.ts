import Dexie, { type Table } from 'dexie';
import type { UnlockStation, LockSession, UnlockAttempt, DailyLog } from '../types';

export interface PasscodeRecord {
  id: string;
  encryptedData: ArrayBuffer;
  iv: ArrayBuffer;
  createdAt: number;
}

export interface CryptoKeyRecord {
  id: string;
  key: CryptoKey;
  createdAt: number;
}

export interface StoreState {
  key: string;
  value: string;
}

class ChunkDatabase extends Dexie {
  passcodes!: Table<PasscodeRecord>;
  cryptoKeys!: Table<CryptoKeyRecord>;
  lockSessions!: Table<LockSession>;
  unlockAttempts!: Table<UnlockAttempt>;
  unlockStations!: Table<UnlockStation>;
  dailyLogs!: Table<DailyLog>;
  storeState!: Table<StoreState>;

  constructor() {
    super('ChunkDB');

    this.version(1).stores({
      passcodes: 'id, createdAt',
      cryptoKeys: 'id',
      lockSessions: 'id, startedAt',
      unlockAttempts: 'id, timestamp, completed',
      unlockStations: 'id, token',
      dailyLogs: 'id, date',
      storeState: 'key',
    });
  }
}

export const db = new ChunkDatabase();

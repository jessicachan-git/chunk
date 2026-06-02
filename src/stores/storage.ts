import type { StateStorage } from 'zustand/middleware';
import { db } from '../db/database';

export const indexedDBStorage: StateStorage = {
  getItem: async (name) => {
    const record = await db.storeState.get(name);
    return record?.value ?? null;
  },
  setItem: async (name, value) => {
    await db.storeState.put({ key: name, value });
  },
  removeItem: async (name) => {
    await db.storeState.delete(name);
  },
};

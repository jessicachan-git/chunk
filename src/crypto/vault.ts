import { db } from '../db/database';

const KEY_ID = 'master';
const PASSCODE_ID = 'primary';

async function getOrCreateKey(): Promise<CryptoKey> {
  const existing = await db.cryptoKeys.get(KEY_ID);
  if (existing) return existing.key;

  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );

  await db.cryptoKeys.put({ id: KEY_ID, key, createdAt: Date.now() });
  return key;
}

export async function encryptPasscode(passcode: string): Promise<void> {
  const key = await getOrCreateKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(passcode);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded,
  );

  await db.passcodes.put({
    id: PASSCODE_ID,
    encryptedData: ciphertext,
    iv: iv.buffer,
    createdAt: Date.now(),
  });
}

export async function decryptPasscode(): Promise<string | null> {
  const record = await db.passcodes.get(PASSCODE_ID);
  if (!record) return null;

  const key = await getOrCreateKey();

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(record.iv) },
    key,
    record.encryptedData,
  );

  return new TextDecoder().decode(decrypted);
}

export async function hasPasscode(): Promise<boolean> {
  const record = await db.passcodes.get(PASSCODE_ID);
  return record !== null && record !== undefined;
}

export async function deletePasscode(): Promise<void> {
  await db.passcodes.delete(PASSCODE_ID);
}

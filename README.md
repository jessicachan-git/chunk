# Chunk — Focus Vault

A PWA that guards your Screen Time passcode behind physical friction layers. No app store required.

## How It Works

1. Set iOS Screen Time limits to 0 minutes for distracting apps
2. Chunk generates a passcode you don't memorize and encrypts it locally
3. Set that passcode as your Screen Time passcode
4. To unlock: scan an NFC tag or QR code → complete friction layers → passcode revealed briefly

## Features

- **Passcode Vault** — AES-256 encrypted, stored locally in IndexedDB
- **NFC/QR Unlock Stations** — Physical locations that trigger the unlock flow
- **Friction Pipeline** — Configurable delay timers, breathing exercises, reflection prompts, typing challenges, math problems
- **Focus Mode** — Timed or indefinite lock sessions
- **Analytics** — Streaks, session history, resist rate tracking
- **PWA** — Installable, works offline, no backend required

## Tech Stack

- Vite + React 19 + TypeScript
- Tailwind CSS
- Zustand (state management)
- Dexie.js (IndexedDB)
- Framer Motion (animations)
- Web Crypto API (encryption)
- vite-plugin-pwa (service worker)

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Deploy

### GitHub Pages

Push to `main` — the included GitHub Actions workflow deploys automatically.

Update `vite.config.ts` base to match your repo name:
```ts
base: '/your-repo-name/',
```

### Cloudflare Pages

1. Connect your GitHub repo
2. Build command: `npm run build`
3. Output directory: `dist`

### Vercel

Zero config — just connect the repo.

## NFC Setup (iOS)

1. Get NFC tags (NTAG215 or similar)
2. Create stations in Chunk → copy the URL
3. Open iOS Shortcuts → Automation → NFC → scan tag
4. Action: Open URL → paste station URL
5. Turn off "Ask Before Running"

Place tags somewhere inconvenient (garage, bathroom, car) to maximize friction.

## Architecture

All data is stored locally. No server, no accounts, no tracking. The encryption uses the Web Crypto API with non-extractable keys — the passcode cannot be read from IndexedDB without going through the unlock flow.

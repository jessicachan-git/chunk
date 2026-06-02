import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '../stores/useSettingsStore';
import { PasscodeGenerator } from '../components/passcode/PasscodeGenerator';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const STEPS = ['welcome', 'screentime', 'passcode', 'stations', 'shortcuts', 'done'] as const;
type Step = (typeof STEPS)[number];

export function OnboardingPage() {
  const [step, setStep] = useState<Step>('welcome');
  const navigate = useNavigate();
  const completeOnboarding = useSettingsStore((s) => s.completeOnboarding);

  const nextStep = useCallback(() => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1]);
    }
  }, [step]);

  const handleComplete = () => {
    completeOnboarding();
    navigate('/');
  };

  const stepIndex = STEPS.indexOf(step);

  return (
    <div className="flex flex-col gap-6 min-h-[80dvh]">
      <div className="flex items-center gap-1 justify-center pt-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${
              i <= stepIndex ? 'bg-accent w-6' : 'bg-surface-border w-3'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="flex-1 flex flex-col"
        >
          {step === 'welcome' && <WelcomeStep onNext={nextStep} />}
          {step === 'screentime' && <ScreenTimeStep onNext={nextStep} />}
          {step === 'passcode' && <PasscodeStep onNext={nextStep} />}
          {step === 'stations' && <StationsStep onNext={nextStep} />}
          {step === 'shortcuts' && <ShortcutsStep onNext={nextStep} />}
          {step === 'done' && <DoneStep onComplete={handleComplete} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-8 text-center">
      <div className="w-24 h-24 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center animate-breathe">
        <span className="text-4xl">◉</span>
      </div>
      <div>
        <h1 className="text-3xl font-bold">Chunk</h1>
        <p className="text-muted mt-2 max-w-xs">
          Break the impulse loop. Lock your distracting apps behind physical actions.
        </p>
      </div>
      <Button onClick={onNext} size="lg">
        Get Started
      </Button>
    </div>
  );
}

function ScreenTimeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col gap-6 flex-1">
      <h2 className="text-2xl font-bold">Set Up Screen Time</h2>
      <Card>
        <div className="flex flex-col gap-4 text-sm">
          <StepItem n={1} text="Open Settings → Screen Time" />
          <StepItem n={2} text="Tap 'App Limits' → Add Limit" />
          <StepItem n={3} text="Select your distracting apps (social media, games, etc.)" />
          <StepItem n={4} text="Set the time limit to 0 minutes (or 1 minute)" />
          <StepItem n={5} text="Tap 'Add' to confirm" />
        </div>
      </Card>
      <p className="text-xs text-muted">
        Don&apos;t set the Screen Time passcode yet — we&apos;ll generate one for you in the next step.
      </p>
      <div className="mt-auto">
        <Button onClick={onNext} className="w-full">
          Done, Next
        </Button>
      </div>
    </div>
  );
}

function PasscodeStep({ onNext }: { onNext: () => void }) {
  const [generated, setGenerated] = useState(false);

  return (
    <div className="flex flex-col gap-6 flex-1">
      <h2 className="text-2xl font-bold">Your Secret Passcode</h2>
      <PasscodeGenerator onGenerated={() => setGenerated(true)} />
      {generated && (
        <Card className="bg-success/5 border-success/20">
          <div className="flex flex-col gap-2 text-sm">
            <p className="font-medium text-success">Now set this as your Screen Time passcode:</p>
            <StepItem n={1} text="Go to Settings → Screen Time" />
            <StepItem n={2} text="Tap 'Lock Screen Time Settings'" />
            <StepItem n={3} text="Enter the passcode shown above" />
            <StepItem n={4} text="Confirm it again" />
          </div>
        </Card>
      )}
      <div className="mt-auto">
        <Button onClick={onNext} disabled={!generated} className="w-full">
          I&apos;ve Set It
        </Button>
      </div>
    </div>
  );
}

function StationsStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col gap-6 flex-1">
      <h2 className="text-2xl font-bold">Unlock Stations</h2>
      <Card>
        <p className="text-sm text-muted mb-4">
          Unlock stations are physical locations with QR codes or NFC tags.
          To unlock your passcode, you&apos;ll need to physically go to a station and scan it.
        </p>
        <div className="flex flex-col gap-3 text-sm">
          <StepItem n={1} text="Place QR codes in inconvenient locations (garage, basement, car)" />
          <StepItem n={2} text="The more inconvenient, the more friction you create" />
          <StepItem n={3} text="You can also use NFC tags for a tap-to-unlock experience" />
        </div>
      </Card>
      <p className="text-xs text-muted">
        You can set up stations now or later from the Stations tab.
      </p>
      <div className="mt-auto">
        <Button onClick={onNext} className="w-full">
          Continue
        </Button>
      </div>
    </div>
  );
}

function ShortcutsStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col gap-6 flex-1">
      <h2 className="text-2xl font-bold">NFC + Shortcuts</h2>
      <Card>
        <p className="text-sm text-muted mb-4">
          For NFC tags, set up an iOS Shortcut automation:
        </p>
        <div className="flex flex-col gap-3 text-sm">
          <StepItem n={1} text="Open the Shortcuts app" />
          <StepItem n={2} text="Go to Automation → New Automation" />
          <StepItem n={3} text="Select 'NFC' as the trigger" />
          <StepItem n={4} text="Scan your NFC tag" />
          <StepItem n={5} text="Add action: 'Open URL'" />
          <StepItem n={6} text="Paste the station URL from Chunk" />
          <StepItem n={7} text="Turn OFF 'Ask Before Running'" />
        </div>
      </Card>
      <p className="text-xs text-muted">
        Alternatively, just print QR codes and scan with your camera. No Shortcuts needed.
      </p>
      <div className="mt-auto">
        <Button onClick={onNext} className="w-full">
          Continue
        </Button>
      </div>
    </div>
  );
}

function DoneStep({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-8 text-center">
      <div className="w-20 h-20 rounded-full bg-success/20 border-2 border-success flex items-center justify-center">
        <span className="text-3xl">✓</span>
      </div>
      <div>
        <h2 className="text-2xl font-bold">You&apos;re All Set</h2>
        <p className="text-muted mt-2 max-w-xs">
          Your passcode is encrypted and locked away. Enter focus mode to start a session.
        </p>
      </div>
      <Button onClick={onComplete} size="lg">
        Start Using Chunk
      </Button>
    </div>
  );
}

function StepItem({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
        {n}
      </span>
      <span className="text-white/80">{text}</span>
    </div>
  );
}

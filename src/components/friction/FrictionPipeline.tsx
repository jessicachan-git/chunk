import { useUnlockStore } from '../../stores/useUnlockStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { DelayTimer } from './DelayTimer';
import { BreathingExercise } from './BreathingExercise';
import { ReflectionQuestion } from './ReflectionQuestion';
import { TypingChallenge } from './TypingChallenge';
import { MathProblem } from './MathProblem';
import { motion, AnimatePresence } from 'framer-motion';

export function FrictionPipeline() {
  const { frictionSteps, currentStepIndex, completeStep } = useUnlockStore();
  const frictionLayers = useSettingsStore((s) => s.frictionLayers);

  const activeStep = frictionSteps[currentStepIndex];
  if (!activeStep) return null;

  const layerConfig = frictionLayers.find((l) => l.id === activeStep.layerId);
  if (!layerConfig) return null;

  const handleComplete = () => {
    completeStep(currentStepIndex);
  };

  const totalSteps = frictionSteps.length;
  const completedSteps = frictionSteps.filter((s) => s.status === 'complete').length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 justify-center">
        {frictionSteps.map((step, i) => (
          <div
            key={step.layerId}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i < completedSteps
                ? 'bg-accent w-8'
                : i === currentStepIndex
                  ? 'bg-accent/50 w-8'
                  : 'bg-surface-border w-4'
            }`}
          />
        ))}
      </div>
      <p className="text-center text-sm text-muted">
        Step {completedSteps + 1} of {totalSteps}
      </p>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep.layerId}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderFrictionLayer(layerConfig.settings, handleComplete)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function renderFrictionLayer(
  settings: import('../../types').FrictionLayerSettings,
  onComplete: () => void,
) {
  switch (settings.type) {
    case 'delay':
      return <DelayTimer durationSeconds={settings.durationSeconds} onComplete={onComplete} />;
    case 'breathing':
      return (
        <BreathingExercise
          durationSeconds={settings.durationSeconds}
          pattern={settings.pattern}
          onComplete={onComplete}
        />
      );
    case 'reflection':
      return (
        <ReflectionQuestion
          prompt={settings.prompt}
          minLength={settings.minLength}
          onComplete={onComplete}
        />
      );
    case 'typing':
      return <TypingChallenge phrase={settings.phrase} onComplete={onComplete} />;
    case 'math':
      return (
        <MathProblem
          difficulty={settings.difficulty}
          problemCount={settings.problemCount}
          onComplete={onComplete}
        />
      );
  }
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

interface ReflectionQuestionProps {
  prompt: string;
  minLength: number;
  onComplete: () => void;
}

export function ReflectionQuestion({ prompt, minLength, onComplete }: ReflectionQuestionProps) {
  const [answer, setAnswer] = useState('');
  const canSubmit = answer.trim().length >= minLength;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <h2 className="text-2xl font-semibold text-center">Reflect</h2>
      <p className="text-muted text-center">{prompt}</p>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Be honest with yourself..."
        className="w-full h-40 bg-surface border border-surface-border rounded-2xl p-4 text-white placeholder:text-muted/50 resize-none focus:outline-none focus:border-accent/50 transition-colors"
        autoFocus
      />
      <div className="flex items-center justify-between">
        <span className={`text-sm ${canSubmit ? 'text-success' : 'text-muted'}`}>
          {answer.trim().length}/{minLength} characters
        </span>
        <Button onClick={onComplete} disabled={!canSubmit} size="sm">
          Continue
        </Button>
      </div>
    </motion.div>
  );
}

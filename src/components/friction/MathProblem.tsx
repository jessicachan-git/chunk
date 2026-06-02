import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { generateMathProblem } from '../../utils/math';
import { Button } from '../ui/Button';

interface MathProblemProps {
  difficulty: 'easy' | 'medium' | 'hard';
  problemCount: number;
  onComplete: () => void;
}

export function MathProblem({ difficulty, problemCount, onComplete }: MathProblemProps) {
  const problems = useMemo(
    () => Array.from({ length: problemCount }, () => generateMathProblem(difficulty)),
    [difficulty, problemCount],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  const current = problems[currentIndex];

  const handleSubmit = () => {
    if (parseInt(answer, 10) === current.answer) {
      setError(false);
      setAnswer('');
      if (currentIndex + 1 >= problemCount) {
        onComplete();
      } else {
        setCurrentIndex((i) => i + 1);
      }
    } else {
      setError(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6"
    >
      <h2 className="text-2xl font-semibold">Solve to Continue</h2>
      <p className="text-muted text-sm">
        Problem {currentIndex + 1} of {problemCount}
      </p>
      <div className="bg-surface border border-surface-border rounded-2xl p-8 min-w-[200px] text-center">
        <span className="text-4xl font-mono font-semibold">{current.question}</span>
      </div>
      <div className="flex gap-3 items-center">
        <input
          type="number"
          inputMode="numeric"
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className={`w-32 bg-surface border rounded-xl p-3 text-center text-xl font-mono text-white focus:outline-none transition-colors ${
            error ? 'border-danger' : 'border-surface-border focus:border-accent/50'
          }`}
          autoFocus
          placeholder="?"
        />
        <Button onClick={handleSubmit} disabled={!answer} size="sm">
          Check
        </Button>
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-danger text-sm"
        >
          Incorrect, try again
        </motion.p>
      )}
    </motion.div>
  );
}

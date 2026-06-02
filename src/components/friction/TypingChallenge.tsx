import { useState } from 'react';
import { motion } from 'framer-motion';

interface TypingChallengeProps {
  phrase: string;
  onComplete: () => void;
}

export function TypingChallenge({ phrase, onComplete }: TypingChallengeProps) {
  const [input, setInput] = useState('');
  const isMatch = input === phrase;

  const handleChange = (value: string) => {
    setInput(value);
    if (value === phrase) {
      setTimeout(onComplete, 300);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <h2 className="text-2xl font-semibold text-center">Type to Continue</h2>
      <p className="text-muted text-center text-sm">
        Type the following phrase exactly:
      </p>
      <div className="bg-surface border border-surface-border rounded-2xl p-4">
        <p className="text-white/80 font-medium leading-relaxed select-none">
          {phrase.split('').map((char, i) => {
            let color = 'text-white/40';
            if (i < input.length) {
              color = input[i] === char ? 'text-success' : 'text-danger';
            }
            return (
              <span key={i} className={color}>
                {char}
              </span>
            );
          })}
        </p>
      </div>
      <textarea
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Start typing..."
        className="w-full h-24 bg-surface border border-surface-border rounded-2xl p-4 text-white placeholder:text-muted/50 resize-none focus:outline-none focus:border-accent/50 transition-colors"
        autoFocus
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
      {isMatch && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-success text-center font-medium"
        >
          ✓ Match
        </motion.p>
      )}
    </motion.div>
  );
}

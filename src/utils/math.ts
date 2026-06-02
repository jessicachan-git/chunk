interface MathProblem {
  question: string;
  answer: number;
}

export function generateMathProblem(difficulty: 'easy' | 'medium' | 'hard'): MathProblem {
  const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  switch (difficulty) {
    case 'easy': {
      const a = rand(10, 50);
      const b = rand(10, 50);
      return { question: `${a} + ${b}`, answer: a + b };
    }
    case 'medium': {
      const a = rand(12, 30);
      const b = rand(3, 12);
      return { question: `${a} × ${b}`, answer: a * b };
    }
    case 'hard': {
      const a = rand(50, 200);
      const b = rand(25, 99);
      return { question: `${a} × ${b}`, answer: a * b };
    }
  }
}

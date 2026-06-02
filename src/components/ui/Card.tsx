import { cn } from '../../utils/cn';
import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function Card({ className, children, glow, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl bg-surface-elevated border border-surface-border p-6',
        glow && 'shadow-lg shadow-accent-glow border-accent/20',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

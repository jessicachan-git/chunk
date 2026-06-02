import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  onClick,
  type = 'button',
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      type={type}
      className={cn(
        'rounded-2xl font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed',
        {
          'bg-accent text-white shadow-lg shadow-accent/20 hover:bg-accent-soft': variant === 'primary',
          'bg-surface-elevated text-white border border-surface-border hover:bg-surface-hover': variant === 'secondary',
          'bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20': variant === 'danger',
          'text-muted hover:text-white hover:bg-surface-elevated': variant === 'ghost',
        },
        {
          'px-4 py-2 text-sm': size === 'sm',
          'px-6 py-3 text-base': size === 'md',
          'px-8 py-4 text-lg': size === 'lg',
        },
        className,
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

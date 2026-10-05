'use client';

import { HTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/cn';

type Variant = 'default' | 'muted' | 'ink' | 'outline';

const variants: Record<Variant, string> = {
  default: 'bg-[oklch(0.988_0.002_260)] border-[oklch(0.89_0.008_260/0.55)]',
  muted: 'bg-[oklch(0.968_0.004_260)] border-[oklch(0.89_0.008_260/0.55)]',
  ink: 'bg-[oklch(0.16_0.02_260)] border-[oklch(0.16_0.02_260)] text-white',
  outline: 'bg-transparent border-[oklch(0.89_0.008_260/0.55)]',
};

export interface BentoCardProps extends HTMLMotionProps<"div"> {
  variant?: Variant;
}

export function BentoCard({ variant = 'default', className, children, ...props }: BentoCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'rounded-2xl border transition-shadow duration-300 motion-reduce:transition-none motion-reduce:transform-none hover:shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]',
        'relative overflow-hidden before:absolute before:inset-0 before:-z-10 before:translate-y-full before:bg-gradient-to-t before:from-[oklch(0.9_0.01_260/0.1)] before:to-transparent before:opacity-0 hover:before:translate-y-0 hover:before:opacity-100 before:transition-all before:duration-500',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function BentoCardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-5 py-4 md:px-6 md:py-5 flex-1', className)} {...props}>
      {children}
    </div>
  );
}

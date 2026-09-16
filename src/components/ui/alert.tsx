import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, Scale } from 'lucide-react';
import { cn } from '@/lib/cn';

type Tone = 'info' | 'success' | 'warning' | 'legal';

const tones: Record<Tone, { box: string; icon: typeof Info }> = {
  info: { box: 'bg-info-soft border-info/25 text-foreground', icon: Info },
  success: { box: 'bg-success-soft border-success/25 text-foreground', icon: CheckCircle2 },
  warning: { box: 'bg-warning-soft border-warning/30 text-foreground', icon: AlertTriangle },
  legal: { box: 'bg-surface-muted border-border-strong text-foreground', icon: Scale },
};

export interface AlertProps {
  tone?: Tone;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Alert({ tone = 'info', title, children, className }: AlertProps) {
  const { box, icon: Icon } = tones[tone];

  return (
    <div className={cn('flex gap-3 rounded-lg border p-4', box, className)} role="note">
      <Icon size={18} className="mt-0.5 shrink-0 opacity-80" aria-hidden />
      <div className="min-w-0 text-[13px] leading-relaxed">
        {title && <p className="mb-1 font-bold">{title}</p>}
        {children}
      </div>
    </div>
  );
}

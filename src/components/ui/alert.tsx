import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { GlyphHakenKreis } from '@/components/visual/glyphen/haken-kreis';
import { GlyphInfo } from '@/components/visual/glyphen/info';
import { GlyphWaage } from '@/components/visual/glyphen/waage';
import { GlyphWarnung } from '@/components/visual/glyphen/warnung';

type Tone = 'info' | 'success' | 'warning' | 'danger' | 'legal';

const tones: Record<Tone, { box: string; icon: typeof GlyphInfo }> = {
  info: { box: 'bg-info-soft border-info/25 text-foreground', icon: GlyphInfo },
  success: { box: 'bg-success-soft border-success/25 text-foreground', icon: GlyphHakenKreis },
  warning: { box: 'bg-warning-soft border-warning/30 text-foreground', icon: GlyphWarnung },
  danger: { box: 'bg-danger-soft border-danger/30 text-foreground', icon: GlyphWarnung },
  legal: { box: 'bg-surface-muted border-border-strong text-foreground', icon: GlyphWaage },
};

export interface AlertProps {
  tone?: Tone;
  title?: string;
  children: ReactNode;
  className?: string;
  /**
   * Rolle für Hilfsmittel. Standard `note` (ruhiger Hinweis). `alert` für Fehler,
   * die nach einer Aktion erscheinen (wird sofort angesagt), `status` für
   * Rückmeldungen wie „gespeichert“ (höflich angesagt).
   */
  role?: 'note' | 'alert' | 'status';
}

export function Alert({ tone = 'info', title, children, className, role = 'note' }: AlertProps) {
  const { box, icon: Icon } = tones[tone];

  return (
    <div className={cn('flex gap-3 rounded-lg border p-4', box, className)} role={role}>
      <Icon size={18} className="mt-0.5 shrink-0 opacity-80" />
      <div className="min-w-0 text-small leading-relaxed">
        {title && <p className="mb-1 font-bold">{title}</p>}
        {children}
      </div>
    </div>
  );
}

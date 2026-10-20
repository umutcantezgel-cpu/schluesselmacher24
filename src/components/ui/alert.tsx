import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { GlyphHakenKreis } from '@/components/visual/glyphen/haken-kreis';
import { GlyphInfo } from '@/components/visual/glyphen/info';
import { GlyphWaage } from '@/components/visual/glyphen/waage';
import { GlyphWarnung } from '@/components/visual/glyphen/warnung';

type Tone = 'info' | 'success' | 'warning' | 'danger' | 'legal';

/*
 * Ruhige Fläche mit 2-px-Leiste in der Tonfarbe statt getönter Kästen (KERN 1.10, sparsame
 * Flächen): Die Farbe trägt nur die Leiste und das Glyph, der Text steht auf Papier.
 */
const tones: Record<Tone, { box: string; icon: typeof GlyphInfo; farbe: string }> = {
  info: { box: 'border-l-info', icon: GlyphInfo, farbe: 'text-info' },
  success: { box: 'border-l-success', icon: GlyphHakenKreis, farbe: 'text-success' },
  warning: { box: 'border-l-warning', icon: GlyphWarnung, farbe: 'text-warning' },
  danger: { box: 'border-l-danger', icon: GlyphWarnung, farbe: 'text-danger' },
  legal: { box: 'border-l-border-strong', icon: GlyphWaage, farbe: 'text-foreground-muted' },
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
  const { box, icon: Icon, farbe } = tones[tone];

  return (
    <div
      className={cn('flex gap-3 rounded-md border border-l-2 border-border bg-surface p-4 text-foreground', box, className)}
      role={role}
    >
      <Icon size={18} className={cn('mt-0.5 shrink-0', farbe)} />
      <div className="min-w-0 text-small leading-relaxed">
        {title && <p className="mb-1 font-bold">{title}</p>}
        {children}
      </div>
    </div>
  );
}

'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/cn';
import { GlyphWinkelUnten } from '@/components/visual/glyphen/winkel-unten';

export interface AccordionItem {
  question: string;
  answer: string;
}

export function Accordion({ items, className }: { items: AccordionItem[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  if (items.length === 0) return null;

  return (
    <div className={cn('divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface', className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${baseId}-panel-${index}`;
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex min-h-touch w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-quick hover:bg-surface-muted"
              >
                <span className="text-body font-semibold text-foreground">{item.question}</span>
                <GlyphWinkelUnten
                  size={18}
                  className={cn(
                    'shrink-0 text-foreground-subtle transition-transform duration-base ease-standard',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>
            </h3>
            {/* Der Inhalt bleibt im Dokument, damit `aria-controls` immer auf ein Element zeigt. */}
            <div
              id={panelId}
              hidden={!isOpen}
              className={cn(
                'px-5 pb-5 text-body leading-relaxed text-foreground-muted',
                isOpen && 'sm24-fade [--sm24-duration:var(--dauer-quick)]',
              )}
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}

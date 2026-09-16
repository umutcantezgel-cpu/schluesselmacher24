'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface AccordionItem {
  question: string;
  answer: string;
}

export function Accordion({ items, className }: { items: AccordionItem[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0);

  if (items.length === 0) return null;

  return (
    <div className={cn('divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface', className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-[15px] font-semibold text-foreground">{item.question}</span>
                <ChevronDown
                  size={18}
                  aria-hidden
                  className={cn(
                    'shrink-0 text-foreground-subtle transition-transform',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>
            </h3>
            {isOpen && (
              <div className="px-5 pb-5 text-[15px] leading-relaxed text-foreground-muted">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

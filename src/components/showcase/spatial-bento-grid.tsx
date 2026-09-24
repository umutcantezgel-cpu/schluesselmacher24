'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface BentoItem {
  id: string;
  title: string;
  summary: string;
  href: string;
  highlightLabel?: string;
}

interface SpatialBentoGridProps {
  items: BentoItem[];
  className?: string;
}

export function SpatialBentoGrid({ items, className }: SpatialBentoGridProps) {
  const containerRef = useRef<HTMLUListElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', () => setIsHovering(true));
      container.addEventListener('mouseleave', () => setIsHovering(false));
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', () => setIsHovering(true));
        container.removeEventListener('mouseleave', () => setIsHovering(false));
      }
    };
  }, []);

  return (
    <ul
      ref={containerRef}
      className={cn(
        "relative grid gap-3 md:grid-cols-3 grid-rows-[subgrid]",
        className
      )}
      style={{
        '--mouse-x': `${mousePos.x}px`,
        '--mouse-y': `${mousePos.y}px`,
      } as React.CSSProperties}
    >
      {items.map((item) => (
        <li key={item.id} className="relative row-span-1 flex flex-col group/bento">
          <div
            className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), oklch(0.968 0.004 260 / 0.8), transparent 40%)`,
              opacity: isHovering ? 1 : 0
            }}
          />
          <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_16px_32px_-8px_oklch(0.16_0.02_260/0.08)] hover:-translate-y-1">
            <div className="flex flex-1 flex-col z-10 relative">
               <h3 className="text-[16px] font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">{item.title}</h3>
               <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
                 {item.summary}
               </p>
               <Link
                 href={item.href}
                 className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[oklch(0.52_0.24_260)] hover:text-[oklch(0.46_0.24_260)] transition-colors group-hover/bento:underline"
                 style={{ viewTransitionName: `bento-link-${item.id}` }}
               >
                 {item.highlightLabel ?? `${item.title} entdecken`}
                 <ArrowRight size={15} aria-hidden />
               </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

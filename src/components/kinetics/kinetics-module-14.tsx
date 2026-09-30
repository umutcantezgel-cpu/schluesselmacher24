'use client';

import { useRef, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

function useNativeReducedMotion() {
  const [reduced, setReduced] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Defer the initial state update so it isn't synchronous in the effect
    const timer = setTimeout(() => {
      setReduced(mediaQuery.matches);
    }, 0);

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => {
      clearTimeout(timer);
      mediaQuery.removeEventListener('change', handler);
    };
  }, []);

  return reduced ?? false;
}

interface KineticsModuleProps {
  children: ReactNode;
}

export function KineticsModule14({ children }: KineticsModuleProps) {
  const containerRef = useRef<HTMLUListElement>(null);
  const shouldReduceMotion = useNativeReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    const updateMousePos = (ev: MouseEvent) => {
      const cards = document.querySelectorAll('.kinetics-card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
      });

      if (containerRef.current) {
        const cRect = containerRef.current.getBoundingClientRect();
        const cx = ev.clientX - cRect.left;
        const cy = ev.clientY - cRect.top;
        containerRef.current.style.setProperty('--c-mouse-x', `${cx}px`);
        containerRef.current.style.setProperty('--c-mouse-y', `${cy}px`);
      }
    };

    window.addEventListener('mousemove', updateMousePos);
    return () => window.removeEventListener('mousemove', updateMousePos);
  }, [shouldReduceMotion]);

  return (
    <ul
      ref={containerRef}
      className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 relative overflow-hidden"
    >
      {!shouldReduceMotion && (
        <div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100 z-0 hidden lg:block"
          style={{
            background: `radial-gradient(400px circle at var(--c-mouse-x, -1000px) var(--c-mouse-y, -1000px), oklch(0.89 0.008 260 / 0.15), transparent 40%)`,
          }}
        />
      )}

      {children}
    </ul>
  );
}

interface KineticsCardProps {
  children: ReactNode;
  wide?: boolean;
}

export function KineticsCard({ children, wide }: KineticsCardProps) {
  const shouldReduceMotion = useNativeReducedMotion();

  return (
    <li className={`relative z-10 ${wide ? 'sm:col-span-2 lg:col-span-3' : ''}`}>
      <div className="kinetics-card group relative h-full rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] transition-all motion-reduce:transition-none hover:-translate-y-1 hover:shadow-[0_16px_32px_-8px_oklch(0.16_0.02_260/0.08)]">
        {!shouldReduceMotion && (
          <div
             className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
             style={{
               background: `radial-gradient(300px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), oklch(0.89 0.008 260 / 0.4), transparent 40%)`,
             }}
          />
        )}
        <div className="relative z-10 flex h-full flex-col">
          {children}
        </div>
      </div>
    </li>
  );
}
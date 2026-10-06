'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, KeyRound, ShieldCheck, Layers, ClipboardList, ScanLine, Package, Wrench, CalendarClock } from 'lucide-react';
import { PROCESS_LABELS, QUICK_ENTRIES } from '@/lib/navigation';

const AREA_ICONS: Record<string, React.ComponentType<{ size?: number; 'aria-hidden'?: boolean }>> = {
  autoschluessel: KeyRound,
  'schluessel-nach-vorlage': ScanLine,
  'schluessel-nach-code': Package,
  'gleichschliessende-zylinder': Layers,
  schliessanlagen: ClipboardList,
  'elektronische-zutrittsloesungen': ShieldCheck,
  'tuer-und-schliesstechnik': Wrench,
  sicherheitstechnik: ShieldCheck,
  'service-und-termin': CalendarClock,
};

export function SpatialBentoGrid() {
  const containerRef = useRef<HTMLUListElement>(null);

  // We track cursor position for the whole container to calculate glow
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = (e: React.MouseEvent<HTMLUListElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: -1000, y: -1000 });
  };

  return (
    <ul
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr relative motion-reduce:transition-none"
    >
      {QUICK_ENTRIES.map((area, index) => {
        const Icon = AREA_ICONS[area.key] ?? KeyRound;
        const isFeatured = index === 0;

        return (
          <li key={area.key} className={`relative flex ${isFeatured ? 'sm:col-span-2 lg:col-span-2' : ''}`}>
            <CardWithGlow
              href={area.href}
              mouseX={mousePosition.x}
              mouseY={mousePosition.y}
              containerRef={containerRef}
            >
              <div className="flex h-full flex-col p-6 sm:p-8 relative z-10 grid-rows-[subgrid] row-span-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.968_0.004_260)] border border-[oklch(0.89_0.008_260/0.55)] text-[oklch(0.16_0.02_260)] shadow-sm">
                  <Icon size={22} aria-hidden />
                </span>
                <span className="mt-6 block text-lg font-bold text-[oklch(0.16_0.02_260)] group-hover:text-[oklch(0.52_0.24_260)] transition-colors motion-reduce:transition-none">
                  {area.label}
                </span>
                <span className="mt-2 block flex-1 text-sm leading-relaxed text-[oklch(0.32_0.02_260)]">
                  {area.summary}
                </span>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[oklch(0.52_0.015_260)]">
                  {PROCESS_LABELS[area.process]?.label || 'Mehr erfahren'}
                  <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                </span>
              </div>
            </CardWithGlow>
          </li>
        );
      })}
    </ul>
  );
}

function CardWithGlow({
  children,
  href,
  mouseX,
  mouseY,
  containerRef
}: {
  children: React.ReactNode;
  href: string;
  mouseX: number;
  mouseY: number;
  containerRef: React.RefObject<HTMLUListElement | null>;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [localMouse, setLocalMouse] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    if (!cardRef.current || !containerRef.current) return;
    const cardRect = cardRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    // Relative position of card inside container
    const relativeLeft = cardRect.left - containerRect.left;
    const relativeTop = cardRect.top - containerRect.top;

    setLocalMouse({
      x: mouseX - relativeLeft,
      y: mouseY - relativeTop,
    });
  }, [mouseX, mouseY, containerRef]);

  return (
    <Link
      href={href}
      ref={cardRef}
      className="group relative flex h-full w-full flex-col rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none"
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 motion-reduce:transition-none"
        style={{
          background: `radial-gradient(400px circle at ${localMouse.x}px ${localMouse.y}px, rgba(255,255,255,0.4), transparent 40%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl border border-transparent opacity-0 transition duration-300 group-hover:opacity-100 motion-reduce:transition-none"
        style={{
          background: `radial-gradient(300px circle at ${localMouse.x}px ${localMouse.y}px, oklch(0.89 0.008 260 / 0.8), transparent 40%) border-box`,
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      {children}
    </Link>
  );
}

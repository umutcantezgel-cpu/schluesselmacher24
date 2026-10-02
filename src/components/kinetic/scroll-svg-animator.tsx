'use client';

import React, { useEffect, useRef, useState } from 'react';

export function ScrollSvgAnimator() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how far the element is scrolled into view (0 to 1)
      const totalScrollableDistance = windowHeight + rect.height;
      let progress = (windowHeight - rect.top) / totalScrollableDistance;

      // Clamp between 0 and 1
      progress = Math.max(0, Math.min(1, progress));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial calculation
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 md:p-12 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] mb-8"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.988_0.002_260)] to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
        <div className="flex-1 space-y-4">
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">
            Auftragsfortschritt & Verifizierung
          </h3>
          <p className="text-[oklch(0.32_0.02_260)] leading-relaxed max-w-lg">
            Unsere Schweizer Präzisionsarchitektur gewährleistet eine lückenlose Dokumentation und
            sichere Verarbeitung Ihrer Vorgangsdaten. Scrollen Sie, um den detaillierten
            Verarbeitungsprozess zu explorieren.
          </p>
        </div>

        <div className="flex-shrink-0 relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
          {/* Animated SVG Path - Drawn based on scroll progress */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full transform -rotate-90"
            aria-hidden="true"
          >
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="oklch(0.89 0.008 260)"
              strokeWidth="4"
              className="opacity-40"
            />
            {/* Progress Track */}
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="oklch(0.52 0.24 260)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="289" // 2 * PI * 46
              strokeDashoffset={289 - (289 * scrollProgress)}
              className="transition-all duration-300 ease-out"
            />

            {/* Inner checkmark / success indicator */}
            <g
              className="transition-all duration-500 ease-out transform origin-center"
              style={{
                opacity: scrollProgress > 0.8 ? 1 : 0,
                scale: scrollProgress > 0.8 ? '1' : '0.5',
              }}
            >
              <path
                d="M35 50 L45 60 L65 40"
                fill="none"
                stroke="oklch(0.52 0.24 260)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-[oklch(0.16_0.02_260)]">
              {Math.round(scrollProgress * 100)}%
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold text-[oklch(0.52_0.015_260)]">
              Prozessierung
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

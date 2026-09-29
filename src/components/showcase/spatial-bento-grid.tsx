'use client';

import { useActionState, useOptimistic, startTransition, useState } from 'react';
import { calculateServiceBudget } from '@/actions/calculate-budget';
import type { BudgetCalculationResult } from '@/types/budget';

const initialState: BudgetCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'STANDARD'
};

export function SpatialBentoGrid() {
  const [state, formAction, isPending] = useActionState(calculateServiceBudget, initialState);

  const [scopeDays, setScopeDays] = useState(15);

  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  // Derive initial/display value from local state, only use optimistic state during form submission
  const displayTotal = isPending ? optimisticTotal : scopeDays * 150;

  function handleScopeChange(e: React.ChangeEvent<HTMLInputElement>) {
      setScopeDays(Number(e.target.value));
  }

  return (
    <div className="relative group/bento grid grid-cols-1 md:grid-cols-3 gap-6 my-16">

      {/* Kinetischer Glow Effekt via CSS Hover auf Parent */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[oklch(0.52_0.24_260)] to-[oklch(0.46_0.24_260)] rounded-3xl opacity-0 group-hover/bento:opacity-20 transition duration-1000 group-hover/bento:duration-200 motion-reduce:transition-none blur-xl pointer-events-none"></div>

      {/* Main Info Tile */}
      <div className="md:col-span-2 rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] transition-all hover:shadow-[0_12px_32px_-4px_oklch(0.16_0.02_260/0.08)] motion-reduce:transition-none overflow-hidden relative z-10">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        </div>
        <h3 className="text-2xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">
           Sicherheitstechnik & Projektplanung
        </h3>
        <p className="mt-4 text-[oklch(0.32_0.02_260)] leading-relaxed max-w-xl">
           Unsere zertifizierte Herangehensweise an moderne Sicherheitssysteme kombiniert physischen Schutz mit intelligenter Zutrittskontrolle. Jeder Schritt, von der initialen Schwachstellenanalyse bis zur finalen Implementierung, wird mit höchster Präzision ausgeführt.
        </p>
        <ul className="mt-8 space-y-3">
          {['Zertifizierte Sicherheitsanalyse (DIN EN 1627)', 'Herstellerunabhängige Technologieberatung', 'Strukturierte Schließplankonzeption'].map((item, i) => (
            <li key={i} className="flex items-center text-[oklch(0.32_0.02_260)]">
               <span className="flex-shrink-0 mr-3 w-5 h-5 flex items-center justify-center rounded-full bg-[oklch(0.52_0.24_260)/0.1] text-[oklch(0.52_0.24_260)]">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
               </span>
               {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Interactive Calculator Tile */}
      <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] transition-all hover:border-[oklch(0.52_0.24_260/0.3)] motion-reduce:transition-none relative z-10 flex flex-col">
        <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Projekt-Budget Kalkulator</h3>
        <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)] leading-relaxed">
           Erhalten Sie in Echtzeit einen ersten Richtwert für Ihr Sicherheitsprojekt.
        </p>

        <form action={(formData) => {
          startTransition(() => {
            setOptimisticTotal(scopeDays * 150);
            formAction(formData);
          });
        }} className="mt-6 flex-1 flex flex-col">
          <div className="flex-1">
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] flex justify-between">
              <span>Projektumfang</span>
              <span className="text-[oklch(0.52_0.24_260)] font-semibold">{scopeDays} Tage</span>
            </label>
            <input
              type="range"
              name="scopeDays"
              min="5"
              max="60"
              value={scopeDays}
              onChange={handleScopeChange}
              className="mt-3 w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>

          <div className="mt-8 flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-4">
            <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
            <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {displayTotal.toLocaleString('de-DE')} €
            </span>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-6 w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 motion-reduce:transition-none"
          >
            {isPending ? 'Kalkuliere...' : 'Detaillierte Aufstellung anfordern'}
          </button>
        </form>
      </div>

    </div>
  );
}

'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateServiceBudget } from '@/actions/calculate-budget';
import type { BudgetCalculationResult } from '@/types/budget';

const initialState: BudgetCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'STANDARD'
};

export function ServiceBudgetCalculator() {
  const [state, formAction, isPending] = useActionState(calculateServiceBudget, initialState);

  // Wir nutzen useOptimistic um sofortiges Feedback bei Slider-Änderungen zu geben
  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate || 15000,
    (current, update: number) => update
  );

  function handleScopeChange(value: number) {
    startTransition(() => {
      // Sehr grobe Schätzung für die Optimistic UI (850€ Tagessatz + Basis-Pauschale)
      setOptimisticTotal((value * 850) + 3000);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 sm:p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] my-12">
      <div className="mb-8">
        <h3 className="text-xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">
          Interaktiver Budget-Kalkulator
        </h3>
        <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
          Ermitteln Sie einen ersten finanziellen Richtwert für Ihr Sicherheitsprojekt basierend auf Umfang und technischer Ausstattung.
        </p>
      </div>

      <form action={formAction} className="space-y-8">
        {/* Schieberegler für Projekttage */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="scopeDays" className="text-sm font-medium text-[oklch(0.16_0.02_260)]">
              Geschätzter Projektumfang (Tage)
            </label>
            <span className="font-mono text-sm text-[oklch(0.32_0.02_260)]">
              5 - 60 Tage
            </span>
          </div>
          <input
            type="range"
            id="scopeDays"
            name="scopeDays"
            min="5"
            max="60"
            defaultValue="15"
            onChange={(e) => handleScopeChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg bg-[oklch(0.89_0.008_260)] appearance-none cursor-pointer accent-[oklch(0.52_0.24_260)]"
          />
        </div>

        {/* Checkboxen für Technik-Features */}
        <div className="space-y-4 border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <p className="text-sm font-medium text-[oklch(0.16_0.02_260)] mb-4">
            Gewünschte Technologie-Bausteine
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-start gap-3 p-3 rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] hover:border-[oklch(0.52_0.24_260)] transition-colors cursor-pointer">
              <input type="checkbox" name="includeVideo" className="mt-1 accent-[oklch(0.52_0.24_260)]" />
              <div>
                <span className="block text-sm font-medium text-[oklch(0.16_0.02_260)]">Videoüberwachung</span>
                <span className="block text-xs text-[oklch(0.32_0.02_260)] mt-0.5">Kameras & Aufzeichnung</span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] hover:border-[oklch(0.52_0.24_260)] transition-colors cursor-pointer">
              <input type="checkbox" name="includeAlarm" className="mt-1 accent-[oklch(0.52_0.24_260)]" />
              <div>
                <span className="block text-sm font-medium text-[oklch(0.16_0.02_260)]">Alarmtechnik</span>
                <span className="block text-xs text-[oklch(0.32_0.02_260)] mt-0.5">Melder & Signalgeber</span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] hover:border-[oklch(0.52_0.24_260)] transition-colors cursor-pointer sm:col-span-2">
              <input type="checkbox" name="includeSmart" className="mt-1 accent-[oklch(0.52_0.24_260)]" />
              <div>
                <span className="block text-sm font-medium text-[oklch(0.16_0.02_260)]">Smarte Funktionen</span>
                <span className="block text-xs text-[oklch(0.32_0.02_260)] mt-0.5">App-Steuerung & Automationen</span>
              </div>
            </label>
          </div>
        </div>

        {/* Ergebnis & Submit */}
        <div className="rounded-xl bg-[oklch(0.988_0.002_260)] p-6 border border-[oklch(0.89_0.008_260/0.55)]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <span className="block text-sm font-medium text-[oklch(0.32_0.02_260)]">
                Kalkulierter Richtwert
              </span>
              {state.tier && (
                <span className="inline-block mt-1 text-xs font-mono px-2 py-0.5 rounded-full bg-[oklch(0.968_0.004_260)] border border-[oklch(0.89_0.008_260)] text-[oklch(0.16_0.02_260)]">
                  {state.tier} TIER
                </span>
              )}
            </div>
            <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticTotal > 0 ? `~ ${optimisticTotal.toLocaleString('de-DE')} €` : '---'}
            </span>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center rounded-xl bg-[oklch(0.52_0.24_260)] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Kalkuliere präzise...
              </span>
            ) : (
              'Detaillierte Kostenaufstellung anfordern'
            )}
          </button>

          {state.breakdown && state.breakdown.length > 0 && !isPending && (
            <div className="mt-4 pt-4 border-t border-[oklch(0.89_0.008_260/0.55)] space-y-2">
              <p className="text-xs font-semibold text-[oklch(0.16_0.02_260)] uppercase tracking-wider mb-3">
                Aufschlüsselung:
              </p>
              {state.breakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-[oklch(0.32_0.02_260)]">{item.label}</span>
                  <span className="font-medium text-[oklch(0.16_0.02_260)]">{item.amount.toLocaleString('de-DE')} €</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

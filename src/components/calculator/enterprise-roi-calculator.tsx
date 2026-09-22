'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateServiceBudget } from '@/lib/actions/calculate-budget';
import type { BudgetCalculationResult } from '@/types/budget';

const initialState: BudgetCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'STANDARD'
};

export function EnterpriseROICalculator() {
  const [state, formAction, isPending] = useActionState(calculateServiceBudget, initialState);
  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  function handleScopeChange(value: number) {
    startTransition(() => {
      setOptimisticTotal(value * 150);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">
        Interaktiver Enterprise ROI- und Ladezeit-Kalkulator
      </h3>
      <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
        Ermitteln Sie mit unserem präzisen Kalkulator die potenziellen Kosten und Effizienzgewinne für Ihr Schließanlagen-Projekt.
        Die Berechnung basiert auf Echtzeit-Ressourcennutzung und liefert eine detaillierte Kosteneinschätzung.
      </p>

      <form action={formAction} className="mt-8 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">
            Projektumfang (Anzahl der Schließstellen & Schlüssel)
          </label>
          <input
            type="range"
            name="scopeDays"
            min="5"
            max="150"
            defaultValue="15"
            onChange={(e) => handleScopeChange(Number(e.target.value))}
            className="w-full mt-3 accent-[oklch(0.52_0.24_260)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[oklch(0.52_0.24_260)]"
          />
        </div>

        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <span className="text-sm font-medium text-[oklch(0.52_0.015_260)]">
            Kalkulierter Richtwert:
          </span>
          <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
            {optimisticTotal.toLocaleString('de-DE')} €
          </span>
        </div>

        {state.breakdown.length > 0 && (
          <div className="mt-6 space-y-3 rounded-lg bg-[oklch(0.988_0.002_260)] p-4 border border-[oklch(0.89_0.008_260/0.55)]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[oklch(0.16_0.02_260)] mb-3">
              Kostenaufschlüsselung
            </h4>
            {state.breakdown.map((item, index) => (
              <div key={index} className="flex justify-between text-sm text-[oklch(0.32_0.02_260)]">
                <span>{item.label}</span>
                <span className="font-semibold">{item.value.toLocaleString('de-DE')} €</span>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-6 rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.46_0.24_260)] active:scale-[0.99] disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[oklch(0.52_0.24_260)]"
        >
          {isPending ? 'Kalkuliere detaillierte Aufstellung...' : 'Detaillierte Kostenaufstellung anfordern'}
        </button>
      </form>
    </div>
  );
}

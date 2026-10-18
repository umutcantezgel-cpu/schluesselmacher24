'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateSecurityBudget } from '@/actions/calculate-budget';
import type { BudgetCalculationResult } from '@/types/budget';

const initialState: BudgetCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'STANDARD'
};

export function SecurityBudgetCalculator() {
  const [state, formAction, isPending] = useActionState(calculateSecurityBudget, initialState);

  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  function handleCalculate(e: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const areaSize = Number(formData.get('areaSize') as string) || 0;
    const cameras = Number(formData.get('cameras') as string) || 0;

    startTransition(() => {
      setOptimisticTotal(1500 + (areaSize * 25) + (cameras * 450));
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Sicherheits-Budget Kalkulator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
        Ermitteln Sie einen ersten Richtwert für Ihr Sicherheitssystem.
      </p>

      <form action={formAction} onChange={handleCalculate} className="mt-8 space-y-8">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="areaSize" className="text-sm font-medium text-[oklch(0.32_0.02_260)]">
                Abzusichernde Fläche (m²)
              </label>
            </div>
            <input
              type="range"
              name="areaSize"
              id="areaSize"
              min="50"
              max="1000"
              step="50"
              defaultValue="150"
              className="w-full accent-[oklch(0.52_0.24_260)]"
            />
            <div className="flex justify-between text-xs text-[oklch(0.52_0.015_260)] mt-1">
              <span>50 m²</span>
              <span>1000 m²</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="cameras" className="text-sm font-medium text-[oklch(0.32_0.02_260)]">
                Anzahl Kameras
              </label>
            </div>
            <input
              type="range"
              name="cameras"
              id="cameras"
              min="0"
              max="20"
              step="1"
              defaultValue="2"
              className="w-full accent-[oklch(0.52_0.24_260)]"
            />
             <div className="flex justify-between text-xs text-[oklch(0.52_0.015_260)] mt-1">
              <span>0</span>
              <span>20</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-[oklch(0.988_0.002_260)] p-5 border border-[oklch(0.89_0.008_260/0.55)]">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert (netto):</span>
            <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticTotal > 0 ? optimisticTotal.toLocaleString('de-DE') : '---'} €
            </span>
          </div>
          <p className="text-xs text-[oklch(0.52_0.015_260)] mt-2">
            Dies ist eine grobe Schätzung. Für ein verbindliches Angebot empfehlen wir einen Sicherheitscheck vor Ort.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {isPending ? (
            <span className="inline-block animate-pulse">Kalkuliere detailliert...</span>
          ) : (
            'Detaillierte Kostenaufstellung berechnen'
          )}
        </button>

        {state.breakdown.length > 0 && !isPending && (
          <div className="mt-6 pt-6 border-t border-[oklch(0.89_0.008_260/0.55)] animate-in fade-in slide-in-from-top-4 duration-500">
            <h4 className="text-sm font-semibold text-[oklch(0.16_0.02_260)] mb-4">Ihre Aufschlüsselung:</h4>
            <ul className="space-y-3">
              {state.breakdown.map((item, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span className="text-[oklch(0.32_0.02_260)]">{item.label}</span>
                  <span className="font-medium text-[oklch(0.16_0.02_260)]">{item.amount.toLocaleString('de-DE')} €</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}

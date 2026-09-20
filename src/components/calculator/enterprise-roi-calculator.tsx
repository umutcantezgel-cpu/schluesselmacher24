'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseRoi } from '@/lib/actions/calculate-roi';
import type { RoiCalculationResult } from '@/lib/types/roi';

const initialState: RoiCalculationResult = {
  traditionalCost: 0,
  digitalCost: 0,
  savedTimeHours: 0,
  costSavings: 0,
  roiPercentage: 0,
  breakdown: [],
  tier: 'ESSENTIAL',
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseRoi, initialState);
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current, update: Partial<RoiCalculationResult>) => ({ ...current, ...update })
  );

  function handleInputChange() {
    const usersCount = Number((document.getElementById('usersCount') as HTMLInputElement | null)?.value) || 10;
    const doorsCount = Number((document.getElementById('doorsCount') as HTMLInputElement | null)?.value) || 20;

    startTransition(() => {
      // Very basic local preview calculation to simulate immediate feedback
      const traditionalCost = (usersCount * 45) + (doorsCount * 120) + 1500;
      const digitalCost = (usersCount * 85) + (doorsCount * 350) + 2500;
      const costSavings = Math.max(0, traditionalCost - digitalCost * 0.8);
      const roiPercentage = traditionalCost > 0 ? Math.round((costSavings / traditionalCost) * 100) : 0;

      setOptimisticState({
        traditionalCost,
        digitalCost,
        costSavings,
        roiPercentage
      });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Interaktiver Enterprise ROI- und Ladezeit-Kalkulator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)] leading-relaxed">
        Ermitteln Sie die Wirtschaftlichkeit einer mechanischen gegenüber einer elektronischen Schließanlage.
        Basierend auf aktuellen Marktpreisen und Erfahrungswerten.
      </p>

      <form action={formAction} className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start">
        <div className="space-y-6">
          <div>
            <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)]">
              <span>Anzahl Nutzer (Mitarbeiter/Mieter)</span>
            </label>
            <input
              type="range"
              id="usersCount"
              name="usersCount"
              min="5"
              max="500"
              defaultValue="50"
              onChange={() => handleInputChange()}
              className="mt-3 w-full accent-[oklch(0.52_0.24_260)]"
            />
            <div className="mt-1 flex justify-between text-xs text-[oklch(0.52_0.015_260)]">
              <span>5</span>
              <span>500+</span>
            </div>
          </div>

          <div>
            <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)]">
              <span>Anzahl Schließstellen (Türen)</span>
            </label>
            <input
              type="range"
              id="doorsCount"
              name="doorsCount"
              min="5"
              max="200"
              defaultValue="20"
              onChange={() => handleInputChange()}
              className="mt-3 w-full accent-[oklch(0.52_0.24_260)]"
            />
            <div className="mt-1 flex justify-between text-xs text-[oklch(0.52_0.015_260)]">
              <span>5</span>
              <span>200+</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
          >
            {isPending ? 'Kalkuliere...' : 'Detaillierte Analyse generieren'}
          </button>
        </div>

        <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-[oklch(0.52_0.015_260)]">Prognose</h4>

          <div className="mt-6 space-y-5">
            <div className="flex items-end justify-between border-b border-[oklch(0.89_0.008_260/0.55)] pb-3">
              <span className="text-sm text-[oklch(0.32_0.02_260)]">Mechanisches System (ca.)</span>
              <span className="text-xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                {optimisticState.traditionalCost.toLocaleString('de-DE')} €
              </span>
            </div>

            <div className="flex items-end justify-between border-b border-[oklch(0.89_0.008_260/0.55)] pb-3">
              <span className="text-sm text-[oklch(0.32_0.02_260)]">Digitales System (ca.)</span>
              <span className="text-xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                {optimisticState.digitalCost.toLocaleString('de-DE')} €
              </span>
            </div>

            <div className="flex items-end justify-between pt-2">
              <span className="text-sm font-semibold text-[oklch(0.52_0.24_260)]">ROI Potenzial</span>
              <span className="text-3xl font-bold tracking-tight text-[oklch(0.52_0.24_260)]">
                {optimisticState.roiPercentage > 0 ? `+${optimisticState.roiPercentage}%` : '---'}
              </span>
            </div>

            {state.breakdown.length > 0 && !isPending && (
              <div className="mt-6 rounded-lg bg-white p-4 shadow-sm border border-[oklch(0.89_0.008_260/0.55)]">
                 <h5 className="text-xs font-bold text-[oklch(0.32_0.02_260)] mb-3 uppercase tracking-wider">Breakdown</h5>
                 <ul className="space-y-2">
                    {state.breakdown.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-xs">
                        <span className="text-[oklch(0.52_0.015_260)]">{item.label}</span>
                        <span className="font-semibold text-[oklch(0.16_0.02_260)]">{item.value.toLocaleString('de-DE')} €</span>
                      </li>
                    ))}
                 </ul>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

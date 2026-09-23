'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseRoi } from '@/lib/actions/estimate-cost-51';
import type { RoiCalculationResult } from '@/types/roi-budget';

const initialState: RoiCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'STANDARD',
  savingsPerYear: 0,
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseRoi, initialState);

  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current, update: Partial<RoiCalculationResult>) => ({ ...current, ...update })
  );

  function handleOptimisticUpdate(form: HTMLFormElement) {
    const doors = Number(form.doors.value) || 0;
    const users = Number(form.users.value) || 0;
    const complexity = form.complexity.value;

    let multiplier = 1;
    if (complexity === 'medium') multiplier = 1.3;
    if (complexity === 'high') multiplier = 1.8;

    const estimate = (doors * 150 + users * 50) * multiplier;
    const savings = (doors * 15 + users * 5) * multiplier;

    startTransition(() => {
      setOptimisticState({
        totalEstimate: Math.round(estimate),
        savingsPerYear: Math.round(savings),
      });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Enterprise ROI- & Ladezeit-Kalkulator</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
        Berechnen Sie unverbindlich das Budget für Ihre Schließanlage und erfahren Sie die theoretischen Einsparungen pro Jahr durch unsere effizienten Systeme.
      </p>

      <form
        action={formAction}
        onChange={(e) => handleOptimisticUpdate(e.currentTarget as HTMLFormElement)}
        className="mt-8 grid gap-8 md:grid-cols-2"
      >
        <div className="space-y-6">
          <div>
            <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)]">
              <span>Anzahl Schließstellen (Türen)</span>
              <span className="font-bold"></span>
            </label>
            <input
              type="range"
              name="doors"
              min="0"
              max="200"
              defaultValue="10"
              className="mt-3 w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>

          <div>
            <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)]">
              <span>Anzahl Nutzer (Schlüssel)</span>
              <span className="font-bold"></span>
            </label>
            <input
              type="range"
              name="users"
              min="0"
              max="500"
              defaultValue="25"
              className="mt-3 w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anlagen-Komplexität</label>
            <select
              name="complexity"
              defaultValue="low"
              className="mt-3 block w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white px-4 py-3 text-[14px] text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
            >
              <option value="low">Gering (Gleichschließung, wenige Gruppen)</option>
              <option value="medium">Mittel (Hauptschlüsselanlage)</option>
              <option value="high">Hoch (Generalhauptschlüsselanlage, viele Ebenen)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-xl bg-white p-6 border border-[oklch(0.89_0.008_260/0.55)]">
           <div className="flex items-baseline justify-between border-b border-[oklch(0.89_0.008_260/0.55)] pb-4">
             <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Richtwert:</span>
             <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
               {optimisticState.totalEstimate > 0 ? optimisticState.totalEstimate.toLocaleString('de-DE') : '0'} €
             </span>
           </div>

           <div className="flex items-baseline justify-between pt-4">
             <span className="text-sm text-[oklch(0.52_0.015_260)]">Geschätzte Einsparung/Jahr:</span>
             <span className="text-xl font-bold text-[oklch(0.62_0.18_150)]"> {/* Greenish hue for savings */}
               {optimisticState.savingsPerYear > 0 ? optimisticState.savingsPerYear.toLocaleString('de-DE') : '0'} €
             </span>
           </div>

           <button
             type="submit"
             disabled={isPending}
             className="mt-8 w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
           >
             {isPending ? 'Berechne...' : 'Detailauswertung anfordern'}
           </button>
        </div>
      </form>
    </div>
  );
}

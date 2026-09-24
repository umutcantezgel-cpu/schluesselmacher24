'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseRoi } from '@/actions/calculate-enterprise-roi';

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseRoi, {
    roiPercentage: 0,
    paybackMonths: 0,
    annualSavings: 0,
    estimatedCost: 0
  });

  const [optimisticRoi, setOptimisticRoi] = useOptimistic(
    state.roiPercentage,
    (current, update: number) => update
  );

  const [optimisticSavings, setOptimisticSavings] = useOptimistic(
    state.annualSavings,
    (current, update: number) => update
  );

  function handleDoorsChange(value: number) {
    startTransition(() => {
      // Very rough optimistic logic for instant feedback
      const cost = value * 250;
      const savings = value * 80; // Estimated 80 eur savings per door
      const roi = ((savings * 5 - cost) / cost) * 100;
      setOptimisticRoi(Math.max(0, roi));
      setOptimisticSavings(savings);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] grid-rows-[subgrid]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Enterprise ROI-Kalkulator</h3>
      <p className="mt-2 text-[14px] text-[oklch(0.32_0.02_260)]">
        Berechnen Sie das Einsparpotenzial und den Return on Investment einer modernen Schließanlage.
      </p>

      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl der Türen im Gebäude</label>
          <input
            type="range"
            name="doorsCount"
            min="10"
            max="500"
            defaultValue="50"
            step="10"
            onChange={(e) => handleDoorsChange(Number(e.target.value))}
            className="w-full accent-[oklch(0.52_0.24_260)] mt-2"
          />
          <div className="flex justify-between text-xs text-[oklch(0.52_0.015_260)] mt-1">
            <span>10 Türen</span>
            <span>500 Türen</span>
          </div>
        </div>

        <div>
           <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Durchschnittlicher Schlüsselverlust pro Jahr</label>
            <select name="lostKeys" className="mt-2 w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-2 text-[14px] text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]">
              <option value="1">1-2 Schlüssel (Gering)</option>
              <option value="5">3-5 Schlüssel (Mittel)</option>
              <option value="10">6-10 Schlüssel (Hoch)</option>
              <option value="20">&gt;10 Schlüssel (Sehr hoch)</option>
            </select>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <div className="flex flex-col">
             <span className="text-sm text-[oklch(0.52_0.015_260)]">Jährliche Einsparung:</span>
             <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
               {optimisticSavings.toLocaleString('de-DE')} €
             </span>
          </div>
          <div className="flex flex-col">
             <span className="text-sm text-[oklch(0.52_0.015_260)]">ROI (5 Jahre):</span>
             <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
               {optimisticRoi > 0 ? `+${optimisticRoi.toFixed(0)}` : optimisticRoi.toFixed(0)} %
             </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Berechne detaillierten ROI...' : 'Detaillierten ROI berechnen'}
        </button>
      </form>
    </div>
  );
}

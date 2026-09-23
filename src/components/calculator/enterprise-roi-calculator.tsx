
'use client';

import { useActionState, useOptimistic, startTransition, useState } from 'react';
import { calculateEnterpriseRoi } from '@/actions/calculate-enterprise-roi';
import type { EnterpriseRoiResult } from '@/types/enterprise-roi';

const initialState: EnterpriseRoiResult = {
  totalSavings: 0,
  timeSaved: 0,
  efficiencyGain: 0,
  breakdown: [],
  tier: 'BASIC'
};

export function EnterpriseRoiCalculator() {
  const [doorValue, setDoorValue] = useState(50);
  const [userValue, setUserValue] = useState(100);

  const [state, formAction, isPending] = useActionState(calculateEnterpriseRoi, initialState);
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current, update: Partial<EnterpriseRoiResult>) => ({ ...current, ...update })
  );

  function handleInteraction(formData: FormData) {
    setDoorValue(Number(formData.get('doors')) || 50);
    setUserValue(Number(formData.get('users')) || 100);

    const users = Number(formData.get('users')) || 100;

    // Quick local optimistic calculation
    const oldCost = (users * 0.5) * 65;
    const newCost = (users * 0.5 * 0.15) * 65;

    startTransition(() => {
      setOptimisticState({
        totalSavings: Math.round(oldCost - newCost),
        timeSaved: Math.round((users * 0.5) * 0.85),
      });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] @container">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Enterprise ROI & Effizienz Kalkulator</h3>
      <p className="mt-2 text-[14px] text-[oklch(0.32_0.02_260)] leading-relaxed">
        Berechnen Sie die direkten administrativen Einsparungen einer digitalisierten Schließanlage gegenüber herkömmlichen mechanischen Prozessen.
      </p>

      <form action={formAction} onChange={(e) => handleInteraction(new FormData(e.currentTarget))} className="mt-8 space-y-8">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-bold text-[oklch(0.32_0.02_260)]">
              Anzahl der Türen
            </label>
            <div className="mt-3 flex items-center gap-4">
              <input
                type="range"
                name="doors"
                min="10"
                max="500"
                step="10"
                defaultValue="50"
                className="w-full accent-[oklch(0.52_0.24_260)]"
              />
              <span className="w-12 text-right text-sm font-semibold text-[oklch(0.16_0.02_260)]">
                {doorValue}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-[oklch(0.32_0.02_260)]">
              Anzahl der Nutzer/Mitarbeiter
            </label>
            <div className="mt-3 flex items-center gap-4">
              <input
                type="range"
                name="users"
                min="20"
                max="2000"
                step="20"
                defaultValue="100"
                className="w-full accent-[oklch(0.52_0.24_260)]"
              />
              <span className="w-12 text-right text-sm font-semibold text-[oklch(0.16_0.02_260)]">
                {userValue}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 @md:grid-cols-3 border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <div className="rounded-xl bg-white p-5 border border-[oklch(0.89_0.008_260/0.3)] shadow-sm">
            <span className="block text-xs uppercase tracking-wider font-bold text-[oklch(0.52_0.015_260)]">Ersparnis pro Jahr</span>
            <span className="mt-2 block text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.totalSavings.toLocaleString('de-DE')} €
            </span>
          </div>
          <div className="rounded-xl bg-white p-5 border border-[oklch(0.89_0.008_260/0.3)] shadow-sm">
            <span className="block text-xs uppercase tracking-wider font-bold text-[oklch(0.52_0.015_260)]">Zeitersparnis Admin</span>
            <span className="mt-2 block text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.timeSaved} Std.
            </span>
          </div>
          <div className="rounded-xl bg-[oklch(0.52_0.24_260)] p-5 shadow-md flex items-center justify-center flex-col text-white">
            <span className="block text-xs uppercase tracking-wider font-bold text-white/80">Prozess-Effizienz</span>
            <span className="mt-2 block text-3xl font-bold tracking-tight">
              +85 %
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.16_0.02_260)] py-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-black active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Berechne exakten Report...' : 'Detaillierten ROI-Report generieren'}
        </button>
      </form>
    </div>
  );
}

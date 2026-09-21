'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseRoi, type EnterpriseRoiResult } from '@/lib/actions/calculate-enterprise-roi';

const initialState: EnterpriseRoiResult = {
  estimatedSavings: 4100,
  amortizationMonths: 8.5,
  systemCost: 2900,
  tier: 'BASIC'
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseRoi, initialState);

  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current, update: Partial<EnterpriseRoiResult>) => ({ ...current, ...update })
  );

  function handleInputChange(e: React.ChangeEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const doors = Number(formData.get('doors')) || 10;
    const employees = Number(formData.get('employees')) || 20;

    startTransition(() => {
      const sysCost = doors * 250 + employees * 20;
      const estSavings = (employees * 15 * 12) + (doors * 50);
      const amortMonths = (sysCost / estSavings) * 12;

      setOptimisticState({
        systemCost: sysCost,
        estimatedSavings: estSavings,
        amortizationMonths: Math.round(amortMonths * 10) / 10,
        tier: doors > 50 ? 'ENTERPRISE' : (doors > 20 ? 'PRO' : 'BASIC')
      });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] [view-transition-name:roi-calculator]">
      <h3 className="text-xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">
        Enterprise ROI & Ladezeit Kalkulator
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[oklch(0.32_0.02_260)]">
        Berechnen Sie das Potenzial für Ihr Objekt. Skalieren Sie Schließstellen und Nutzer.
      </p>

      <form action={formAction} onChange={handleInputChange} className="mt-8 space-y-8">
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-3">
            <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)]">
              <span>Schließstellen (Türen)</span>
              <span className="font-semibold text-[oklch(0.16_0.02_260)]">Max. 200</span>
            </label>
            <input
              type="range"
              name="doors"
              min="1"
              max="200"
              defaultValue="10"
              className="w-full accent-[oklch(0.52_0.24_260)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[oklch(0.52_0.24_260)]"
            />
          </div>

          <div className="space-y-3">
            <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)]">
              <span>Nutzer / Mitarbeiter</span>
              <span className="font-semibold text-[oklch(0.16_0.02_260)]">Max. 1000</span>
            </label>
            <input
              type="range"
              name="employees"
              min="5"
              max="1000"
              defaultValue="20"
              className="w-full accent-[oklch(0.52_0.24_260)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[oklch(0.52_0.24_260)]"
            />
          </div>
        </div>

        <div className="grid gap-6 border-t border-[oklch(0.89_0.008_260/0.55)] pt-6 sm:grid-cols-3">
          <div className="space-y-1">
            <span className="text-[13px] text-[oklch(0.52_0.015_260)]">Systemkosten (Initial)</span>
            <div className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.systemCost.toLocaleString('de-DE')} €
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[13px] text-[oklch(0.52_0.015_260)]">Ersparnis (Pro Jahr)</span>
            <div className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.estimatedSavings.toLocaleString('de-DE')} €
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[13px] text-[oklch(0.52_0.015_260)]">Amortisation</span>
            <div className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.amortizationMonths} Monate
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[oklch(0.52_0.24_260)]"
        >
          {isPending ? 'Kalkuliere detaillierten ROI...' : 'Detaillierten ROI anfordern'}
        </button>
      </form>
    </div>
  );
}

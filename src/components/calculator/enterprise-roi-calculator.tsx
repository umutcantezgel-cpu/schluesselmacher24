'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseROI } from '@/lib/actions/calculate-enterprise-roi';
import type { EnterpriseROICalculationResult } from '@/lib/actions/calculate-enterprise-roi';

const initialState: EnterpriseROICalculationResult = {
  estimatedCost: 0,
  estimatedSavings: 0,
  roiMonths: 0,
  tier: 'BASIC',
  maintenanceCostPerYear: 0,
};

export function EnterpriseROICalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseROI, initialState);

  // Optimistic updates for the primary cost estimate to make the UI feel instantaneous
  const [optimisticCost, setOptimisticCost] = useOptimistic(
    state.estimatedCost,
    (current, update: number) => update
  );

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Enterprise ROI-Kalkulator</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
        Ermitteln Sie die Investitions- und Betriebskosten für Ihre Schließanlage. Vergleichen Sie mechanische mit elektronischen Systemen und berechnen Sie Ihren ROI.
      </p>

      <form action={formAction} className="mt-8 space-y-6" onChange={(e) => {
        // extract logic so we can call it on change, AND we submit the form if we want the actual server action to be called
        const form = e.currentTarget;
        const formData = new FormData(form);
        const doors = Number(formData.get('doors')) || 10;
        const employees = Number(formData.get('employees')) || 20;
        const isElectronic = formData.get('systemType') === 'electronic';

        const mechCost = doors * 120 + employees * 35;
        const elecCost = doors * 450 + employees * 25;
        const planning = doors * 20 + 200;

        startTransition(() => {
          setOptimisticCost((isElectronic ? elecCost : mechCost) + planning);
        });

        // Submitting on change is not recommended because it triggers full server action request on every keystroke
        // The optimistic cost takes care of visual updates.
      }}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Doors Input */}
          <div>
            <label htmlFor="doors" className="block text-sm font-medium text-[oklch(0.32_0.02_260)]">
              Anzahl der Türen (Schließstellen)
            </label>
            <input
              type="number"
              id="doors"
              name="doors"
              min="1"
              max="1000"
              defaultValue="10"
              className="mt-2 block w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-3 py-2 text-[15px] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
            />
          </div>

          {/* Employees Input */}
          <div>
            <label htmlFor="employees" className="block text-sm font-medium text-[oklch(0.32_0.02_260)]">
              Anzahl der Nutzer (Mitarbeiter)
            </label>
            <input
              type="number"
              id="employees"
              name="employees"
              min="1"
              max="5000"
              defaultValue="20"
              className="mt-2 block w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-3 py-2 text-[15px] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
            />
          </div>

          {/* Lost Keys Input */}
          <div className="md:col-span-2">
            <label htmlFor="lostKeys" className="block text-sm font-medium text-[oklch(0.32_0.02_260)]">
              Geschätzte Schlüsselverluste pro Jahr
            </label>
            <input
              type="range"
              id="lostKeys"
              name="lostKeys"
              min="0"
              max="50"
              defaultValue="2"
              className="mt-4 w-full accent-[oklch(0.52_0.24_260)]"
            />
            <div className="mt-2 flex justify-between text-xs text-[oklch(0.52_0.015_260)]">
              <span>0 (Sehr sicher)</span>
              <span>25</span>
              <span>50 (Hohe Fluktuation)</span>
            </div>
          </div>

          {/* System Type Toggle */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[oklch(0.32_0.02_260)] mb-2">
              Präferiertes System
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="systemType"
                  value="mechanical"
                  defaultChecked
                  className="accent-[oklch(0.52_0.24_260)]"
                />
                <span className="text-[14px] text-[oklch(0.16_0.02_260)]">Mechanisch (Klassisch)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="systemType"
                  value="electronic"
                  className="accent-[oklch(0.52_0.24_260)]"
                />
                <span className="text-[14px] text-[oklch(0.16_0.02_260)]">Elektronisch (Smart)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Bento Grid Area */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Main Cost */}
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-5">
            <span className="block text-sm text-[oklch(0.52_0.015_260)]">Geschätzte Investition</span>
            <span className="mt-1 block text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticCost > 0 ? optimisticCost.toLocaleString('de-DE') : (state.estimatedCost > 0 ? state.estimatedCost.toLocaleString('de-DE') : '—')} €
            </span>
          </div>

          {/* Maintenance Cost */}
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-5">
            <span className="block text-sm text-[oklch(0.52_0.015_260)]">Betriebskosten / Jahr</span>
            <span className="mt-1 block text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {state.maintenanceCostPerYear > 0 ? state.maintenanceCostPerYear.toLocaleString('de-DE') : '—'} €
            </span>
          </div>

          {/* ROI / Savings */}
          <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-5 sm:col-span-2 lg:col-span-1">
            <span className="block text-sm text-[oklch(0.52_0.015_260)]">ROI ggü. Mechanik</span>
            <span className="mt-1 block text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {state.roiMonths > 0 ? `${state.roiMonths} Monate` : 'N/A'}
            </span>
            {state.estimatedSavings > 0 && (
              <span className="mt-2 block text-xs text-emerald-600">
                Einsparung bei Verlust: {state.estimatedSavings.toLocaleString('de-DE')} €/Jahr
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.46_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Berechne exaktes ROI-Modell...' : 'Detailliertes Modell berechnen'}
        </button>
      </form>
    </div>
  );
}
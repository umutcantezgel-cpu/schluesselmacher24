'use client';

import { useActionState, useOptimistic, startTransition, useState } from 'react';
import { calculateEnterpriseRoi } from '@/lib/actions/estimate-roi';
import type { RoiCalculationResult } from '@/types/roi-budget';

const initialState: RoiCalculationResult = {
  upfrontCost: 0,
  annualMaintenance: 0,
  estimatedSavings10Years: 0,
  amortizationYears: 0,
  tier: 'MECHANICAL'
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseRoi, initialState);
  const [doorsVal, setDoorsVal] = useState(10);
  const [empVal, setEmpVal] = useState(20);

  // We use optimistic state for the primary visual metric: estimated savings
  const [optimisticSavings, setOptimisticSavings] = useOptimistic(
    state.estimatedSavings10Years,
    (current, update: number) => update
  );

  function handleDoorsChange(value: number) {
    startTransition(() => {
      // Rough heuristic for optimistic update
      setOptimisticSavings(value * 150);
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] motion-reduce:transition-none">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Enterprise ROI Kalkulator</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
        Simulieren Sie die Total Cost of Ownership (TCO) und die Amortisation Ihrer neuen Schließanlage.
      </p>

      <form action={formAction} className="mt-8 space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Inputs */}
          <div className="space-y-6">
            <div>
              <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)]">
                <span>Anzahl der Türen</span>
                <span className="font-bold text-[oklch(0.16_0.02_260)]" id="doors-val">{doorsVal}</span>
              </label>
              <input
                type="range"
                name="doors"
                min="5"
                max="500"
                defaultValue="10"
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setDoorsVal(val);
                  handleDoorsChange(val);
                }}
                className="mt-3 w-full accent-[oklch(0.52_0.24_260)]"
              />
            </div>

            <div>
              <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)]">
                <span>Anzahl der Mitarbeiter (Nutzer)</span>
                <span className="font-bold text-[oklch(0.16_0.02_260)]" id="emp-val">{empVal}</span>
              </label>
              <input
                type="range"
                name="employees"
                min="5"
                max="1000"
                defaultValue="20"
                onChange={(e) => {
                  setEmpVal(Number(e.target.value));
                }}
                className="mt-3 w-full accent-[oklch(0.52_0.24_260)]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">System-Technologie</label>
              <select
                name="systemType"
                className="mt-2 block w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white px-4 py-2.5 text-[15px] text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
              >
                <option value="mechanical">Mechanisch (Wendeschlüssel)</option>
                <option value="electronic">Elektronisch (Transponder/Smart)</option>
                <option value="mechatronic">Mechatronisch (Hybrid)</option>
              </select>
            </div>
          </div>

          {/* Results Bento Box */}
          <div className="flex flex-col justify-between rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-[oklch(0.89_0.008_260/0.55)] pb-4">
                <span className="text-sm text-[oklch(0.32_0.02_260)]">Initiale Investition:</span>
                <span className="text-xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">
                  {state.upfrontCost > 0 ? `${state.upfrontCost.toLocaleString('de-DE')} €` : '---'}
                </span>
              </div>

              <div className="flex items-baseline justify-between border-b border-[oklch(0.89_0.008_260/0.55)] pb-4">
                <span className="text-sm text-[oklch(0.32_0.02_260)]">Wartung & Betrieb (p.a.):</span>
                <span className="text-xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">
                  {state.annualMaintenance > 0 ? `${state.annualMaintenance.toLocaleString('de-DE')} €` : '---'}
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-2">
                <span className="text-sm font-medium text-[oklch(0.52_0.24_260)]">Geschätzte Ersparnis (10 J.):</span>
                <span className="text-3xl font-bold tracking-tight text-[oklch(0.52_0.24_260)]">
                  {optimisticSavings > 0 ? `${optimisticSavings.toLocaleString('de-DE')} €` : '---'}
                </span>
              </div>

              {state.amortizationYears > 0 && (
                <p className="text-right text-xs text-[oklch(0.32_0.02_260)]">
                  Amortisation nach ca. {state.amortizationYears} Jahren
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-8 w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.46_0.24_260)] active:scale-[0.99] disabled:opacity-50"
            >
              {isPending ? 'Berechne TCO-Matrix...' : 'Wirtschaftlichkeit exakt berechnen'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

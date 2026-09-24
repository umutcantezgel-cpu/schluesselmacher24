'use client';

import { useActionState, useOptimistic, startTransition, useState } from 'react';
import { calculateEnterpriseRoi } from '@/actions/calculate-roi';
import type { RoiCalculationResult } from '@/types/roi-budget';

const initialState: RoiCalculationResult = {
  roiPercentage: 0,
  paybackMonths: 0,
  annualSavings: 0,
  totalInvestment: 0
};

export function EnterpriseRoiCalculator() {
  const [doorsVal, setDoorsVal] = useState(50);
  const [employeesVal, setEmployeesVal] = useState(100);
  const [keyLossRateVal, setKeyLossRateVal] = useState(5);
  const [state, formAction, isPending] = useActionState(calculateEnterpriseRoi, initialState);

  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (currentState, update: Partial<RoiCalculationResult>) => ({
      ...currentState,
      ...update
    })
  );

  function handleInputChange(form: HTMLFormElement) {
    const doorsInput = Number((form.elements.namedItem('doors') as HTMLInputElement)?.value || 50);
    setDoorsVal(doorsInput);
    const doors = doorsInput;
    const employeesInput = Number((form.elements.namedItem('employees') as HTMLInputElement)?.value || 100);
    setEmployeesVal(employeesInput);
    const employees = employeesInput;
    const keyLossRateInput = Number((form.elements.namedItem('keyLossRate') as HTMLInputElement)?.value || 5);
    setKeyLossRateVal(keyLossRateInput);
    const keyLossRate = keyLossRateInput;

    const costPerDoor = 120;
    const costPerEmployee = 15;
    const totalInvestment = doors * costPerDoor + employees * costPerEmployee;

    const costOfLostKeyIncident = 300;
    const annualSavings = (employees * (keyLossRate / 100)) * costOfLostKeyIncident;

    const paybackMonths = annualSavings > 0 ? (totalInvestment / annualSavings) * 12 : 0;
    const roiPercentage = totalInvestment > 0 ? ((annualSavings * 3) - totalInvestment) / totalInvestment * 100 : 0;

    startTransition(() => {
      setOptimisticState({
        totalInvestment,
        annualSavings,
        paybackMonths,
        roiPercentage
      });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]" style={{ viewTransitionName: 'enterprise-roi-calculator' }}>
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mb-6">Enterprise ROI Kalkulator</h3>

      <form action={formAction} onChange={(e) => handleInputChange(e.currentTarget)} className="space-y-6">

        <div className="space-y-4">
          <div>
            <div className="flex justify-between">
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl Türen (Schließstellen)</label>
              <span className="text-sm text-[oklch(0.32_0.02_260)]">
                {doorsVal}
              </span>
            </div>
            <input
              type="range"
              name="doors"
              min="10"
              max="500"
              defaultValue="50"
              className="w-full accent-[oklch(0.52_0.24_260)] mt-2"
            />
          </div>

          <div>
            <div className="flex justify-between">
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl Mitarbeiter (Nutzer)</label>
              <span className="text-sm text-[oklch(0.32_0.02_260)]">
                {employeesVal}
              </span>
            </div>
            <input
              type="range"
              name="employees"
              min="10"
              max="1000"
              defaultValue="100"
              className="w-full accent-[oklch(0.52_0.24_260)] mt-2"
            />
          </div>

          <div>
            <div className="flex justify-between">
              <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Geschätzte Schlüsselverlustrate (%)</label>
              <span className="text-sm text-[oklch(0.32_0.02_260)]">
                {keyLossRateVal}%
              </span>
            </div>
            <input
              type="range"
              name="keyLossRate"
              min="1"
              max="20"
              defaultValue="5"
              className="w-full accent-[oklch(0.52_0.24_260)] mt-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <div>
            <div className="text-sm text-[oklch(0.52_0.015_260)] mb-1">Geschätztes Investment</div>
            <div className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.totalInvestment.toLocaleString('de-DE')} €
            </div>
          </div>
          <div>
            <div className="text-sm text-[oklch(0.52_0.015_260)] mb-1">Jährliche Einsparung</div>
            <div className="text-2xl font-bold tracking-tight text-[#16a34a]">
              {optimisticState.annualSavings.toLocaleString('de-DE')} €
            </div>
          </div>
          <div>
            <div className="text-sm text-[oklch(0.52_0.015_260)] mb-1">Amortisation (Monate)</div>
            <div className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.paybackMonths.toFixed(1)}
            </div>
          </div>
          <div>
            <div className="text-sm text-[oklch(0.52_0.015_260)] mb-1">3-Jahres ROI</div>
            <div className="text-2xl font-bold tracking-tight text-[#16a34a]">
              {optimisticState.roiPercentage > 0 ? '+' : ''}{optimisticState.roiPercentage.toFixed(0)}%
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Berechne...' : 'Detaillierten Report anfordern'}
        </button>
      </form>
    </div>
  );
}

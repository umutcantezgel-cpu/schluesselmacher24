'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseROI } from '@/actions/calculate-roi';
import type { ROICalculationResult } from '@/actions/calculate-roi';

const initialState: ROICalculationResult = {
  totalSavings: 0,
  timeSaved: 0,
  amortizationMonths: 0,
  tier: 'BASIC'
};

export function EnterpriseROICalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseROI, initialState);

  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current, update: Partial<ROICalculationResult>) => ({
      ...current,
      ...update
    })
  );

  function handleCalculate(e: React.ChangeEvent<HTMLInputElement>) {
    const form = e.currentTarget.form;
    if (!form) return;

    // Quick local estimation for optimistic update
    const formData = new FormData(form);
    const doors = Number(formData.get('doors')) || 10;
    const employees = Number(formData.get('employees')) || 20;

    startTransition(() => {
       setOptimisticState({
           totalSavings: Math.round(doors * 150 + employees * 50), // Dummy optimistic calc
           timeSaved: Math.round(employees * 1.5)
       });
       // form.requestSubmit() handled by mouse up
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] my-12">
      <h3 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Enterprise ROI & Ladezeit-Kalkulator</h3>
      <p className="text-[oklch(0.32_0.02_260)] text-[15px] mt-2 mb-8">
        Vergleichen Sie die Folgekosten einer mechanischen Anlage mit den Vorteilen einer elektronischen Zutrittskontrolle.
      </p>

      <form action={formAction} className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Controls */}
        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-baseline mb-3">
              <label className="text-sm font-semibold text-[oklch(0.32_0.02_260)]">Anzahl Türen</label>
            </div>
            <input
              type="range"
              name="doors"
              min="5"
              max="200"
              defaultValue="10"
              onChange={handleCalculate} onMouseUp={(e) => e.currentTarget.form?.requestSubmit()} onTouchEnd={(e) => e.currentTarget.form?.requestSubmit()}
              className="w-full accent-[oklch(0.52_0.24_260)] h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
            />
             <div className="flex justify-between text-xs text-foreground-muted mt-2">
                <span>5</span>
                <span>200</span>
             </div>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-3">
              <label className="text-sm font-semibold text-[oklch(0.32_0.02_260)]">Mitarbeiter (Nutzer)</label>
            </div>
            <input
              type="range"
              name="employees"
              min="5"
              max="500"
              defaultValue="20"
              onChange={handleCalculate} onMouseUp={(e) => e.currentTarget.form?.requestSubmit()} onTouchEnd={(e) => e.currentTarget.form?.requestSubmit()}
              className="w-full accent-[oklch(0.52_0.24_260)] h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-foreground-muted mt-2">
                <span>5</span>
                <span>500</span>
             </div>
          </div>

          <div>
             <div className="flex justify-between items-baseline mb-3">
              <label className="text-sm font-semibold text-[oklch(0.32_0.02_260)]">Geschätzter Schlüsselverlust pro Jahr (%)</label>
            </div>
             <input
              type="range"
              name="keyLossRate"
              min="0"
              max="10"
              step="0.5"
              defaultValue="2"
              onChange={handleCalculate} onMouseUp={(e) => e.currentTarget.form?.requestSubmit()} onTouchEnd={(e) => e.currentTarget.form?.requestSubmit()}
              className="w-full accent-[oklch(0.52_0.24_260)] h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-foreground-muted mt-2">
                <span>0%</span>
                <span>10%</span>
             </div>
          </div>
        </div>

        {/* Results Bento */}
        <div className="grid grid-rows-[subgrid] row-span-1 gap-4">
            <div className="bg-[oklch(0.988_0.002_260)] rounded-xl p-6 border border-[oklch(0.89_0.008_260/0.55)] flex flex-col justify-center">
              <span className="text-sm text-[oklch(0.52_0.015_260)] font-medium mb-1">Jährliche Ersparnis (Mechanik vs. Elektronik)</span>
              <span className="text-4xl font-bold tracking-tight text-[oklch(0.52_0.24_260)] transition-all duration-300">
                {optimisticState.totalSavings.toLocaleString('de-DE')} €
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-[oklch(0.988_0.002_260)] rounded-xl p-5 border border-[oklch(0.89_0.008_260/0.55)]">
                   <span className="text-xs text-[oklch(0.52_0.015_260)] font-medium mb-1 block">Eingesparte Admin-Zeit</span>
                   <span className="text-xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                     {optimisticState.timeSaved} Std/Jahr
                   </span>
                </div>
                <div className="bg-[oklch(0.988_0.002_260)] rounded-xl p-5 border border-[oklch(0.89_0.008_260/0.55)]">
                   <span className="text-xs text-[oklch(0.52_0.015_260)] font-medium mb-1 block">ROI nach</span>
                   <span className="text-xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                     {optimisticState.amortizationMonths > 120 ? '> 10 Jahre' : `${Math.ceil(optimisticState.amortizationMonths / 12)} Jahren`}
                   </span>
                </div>
            </div>
             <button
                type="submit"
                disabled={isPending}
                className="mt-auto w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-4 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 motion-reduce:transition-none"
              >
                {isPending ? 'Berechne...' : 'Individuelles Angebot anfordern'}
            </button>
        </div>
      </form>
    </div>
  );
}

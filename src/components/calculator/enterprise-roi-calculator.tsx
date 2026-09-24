'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateRoi } from '@/lib/actions/calculate-roi';

type RoiState = {
  roiEstimate: number;
  paybackMonths: number;
  maintenanceSavings: number;
  doors: number;
  employees: number;
}

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateRoi, {
    roiEstimate: 0,
    paybackMonths: 0,
    maintenanceSavings: 0,
    doors: 50,
    employees: 100
  });

  const [optimisticState, setOptimisticState] = useOptimistic<RoiState, { doors: number, employees: number }>(
    state,
    (current, update: { doors: number, employees: number }) => ({
      roiEstimate: update.doors * 120 + update.employees * 45,
      paybackMonths: Math.max(6, 36 - (update.doors * 0.1)),
      maintenanceSavings: update.doors * 85,
      doors: update.doors,
      employees: update.employees
    })
  );

  function handleChange(e: React.ChangeEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const doors = Number(formData.get('doors') || 10);
    const employees = Number(formData.get('employees') || 50);

    startTransition(() => {
      setOptimisticState({ doors, employees });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] my-12">
      <div className="mb-8">
        <h3 className="text-[oklch(0.16_0.02_260)] text-2xl font-semibold tracking-tight">Enterprise ROI & Effizienz-Kalkulator</h3>
        <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">Berechnen Sie die potenziellen Einsparungen und den Return on Investment bei der Umstellung auf ein modernes Schließsystem.</p>
      </div>

      <form action={formAction} onChange={handleChange} className="space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <label className="flex justify-between text-sm font-medium text-[oklch(0.16_0.02_260)]">
              <span>Anzahl der Türen / Schließzylinder</span>
              <span className="text-[oklch(0.52_0.24_260)]">{optimisticState.doors}</span>
            </label>
            <input
              type="range"
              name="doors"
              min="10"
              max="500"
              defaultValue="50"
              className="w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>

          <div className="space-y-4">
            <label className="flex justify-between text-sm font-medium text-[oklch(0.16_0.02_260)]">
              <span>Mitarbeiter / Schlüsselnutzer</span>
              <span className="text-[oklch(0.52_0.24_260)]">{optimisticState.employees}</span>
            </label>
            <input
              type="range"
              name="employees"
              min="10"
              max="1000"
              defaultValue="100"
              className="w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 border-t border-[oklch(0.89_0.008_260/0.55)] pt-8">
          <div className="rounded-xl bg-[oklch(0.988_0.002_260)] p-5 border border-[oklch(0.89_0.008_260/0.2)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.52_0.015_260)]">Prognostizierte Einsparung</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.roiEstimate.toLocaleString('de-DE')} €<span className="text-sm font-normal text-[oklch(0.32_0.02_260)]"> / Jahr</span>
            </p>
          </div>

          <div className="rounded-xl bg-[oklch(0.988_0.002_260)] p-5 border border-[oklch(0.89_0.008_260/0.2)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.52_0.015_260)]">Wartungskosten-Reduktion</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.maintenanceSavings.toLocaleString('de-DE')} €<span className="text-sm font-normal text-[oklch(0.32_0.02_260)]"> / Jahr</span>
            </p>
          </div>

          <div className="rounded-xl bg-[oklch(0.988_0.002_260)] p-5 border border-[oklch(0.89_0.008_260/0.2)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.52_0.015_260)]">Amortisationszeit (ROI)</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {Math.round(optimisticState.paybackMonths)} <span className="text-lg font-semibold">Monate</span>
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto rounded-xl bg-[oklch(0.52_0.24_260)] px-8 py-4 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(oklch(0.52_0.24_260),0.3)] transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Berechne Detaillierte Analyse...' : 'Detaillierten ROI-Report anfordern'}
        </button>
      </form>
    </div>
  );
}

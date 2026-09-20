'use client';

import { useActionState, useOptimistic, startTransition, useState } from 'react';
import { calculateEnterpriseROI } from '@/lib/actions/calculate-roi';
import type { ROICalculationResult } from '@/lib/actions/calculate-roi';

const initialState: ROICalculationResult = {
  totalInvestment: 0,
  annualSavings: 0,
  roiMonths: 0,
  breakevenYear: new Date().getFullYear(),
  status: 'IDLE',
};

export function EnterpriseROICalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseROI, initialState);

  // Local state for sliders to drive optimistic updates
  const [doors, setDoors] = useState(50);
  const [users, setUsers] = useState(150);
  const [hourlyRate, setHourlyRate] = useState(45);

  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (currentState, optimisticValue: Partial<ROICalculationResult>) => ({
      ...currentState,
      ...optimisticValue,
      status: 'CALCULATED' as const,
    })
  );

  function handleCalculate(currentDoors: number, currentUsers: number, currentHourlyRate: number) {
    startTransition(() => {
      // Very rough optimistic calculation, the real one is on the server
      const totalInvestment = currentDoors * 150 + currentUsers * 15;
      const annualSavings = (currentUsers * 0.05) * 250 + (currentUsers * 0.05) * 4 * currentHourlyRate;
      const roiMonths = annualSavings > 0 ? Math.round((totalInvestment / annualSavings) * 12) : 0;

      setOptimisticState({
        totalInvestment,
        annualSavings: Math.round(annualSavings),
        roiMonths,
      });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] my-12">
      <div className="mb-8">
        <h3 className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
          Enterprise ROI Kalkulator
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[oklch(0.32_0.02_260)]">
          Berechnen Sie die Wirtschaftlichkeit und den Break-Even-Point einer strukturierten Schließanlage
          im Vergleich zu einer unstrukturierten Schlüsselverwaltung, basierend auf empirischen Verlustraten (5% p.a.).
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-[1fr_1fr]">
        <form action={formAction} className="space-y-8">
          <div>
            <div className="flex justify-between mb-2">
              <label htmlFor="doors" className="text-sm font-semibold text-[oklch(0.16_0.02_260)]">
                Anzahl der Türen (Schließstellen)
              </label>
              <span className="text-sm font-bold text-[oklch(0.52_0.24_260)]">{doors}</span>
            </div>
            <input
              type="range"
              id="doors"
              name="doors"
              min="5"
              max="500"
              step="5"
              value={doors}
              onChange={(e) => {
                const val = Number(e.target.value);
                setDoors(val);
                handleCalculate(val, users, hourlyRate);
              }}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[oklch(0.89_0.008_260)] accent-[oklch(0.52_0.24_260)]"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label htmlFor="users" className="text-sm font-semibold text-[oklch(0.16_0.02_260)]">
                Anzahl der Schlüsselnutzer
              </label>
              <span className="text-sm font-bold text-[oklch(0.52_0.24_260)]">{users}</span>
            </div>
            <input
              type="range"
              id="users"
              name="users"
              min="10"
              max="1000"
              step="10"
              value={users}
              onChange={(e) => {
                const val = Number(e.target.value);
                setUsers(val);
                handleCalculate(doors, val, hourlyRate);
              }}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[oklch(0.89_0.008_260)] accent-[oklch(0.52_0.24_260)]"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label htmlFor="hourlyRate" className="text-sm font-semibold text-[oklch(0.16_0.02_260)]">
                Interner Stundensatz (Verwaltung)
              </label>
              <span className="text-sm font-bold text-[oklch(0.52_0.24_260)]">{hourlyRate} €</span>
            </div>
            <input
              type="range"
              id="hourlyRate"
              name="hourlyRate"
              min="20"
              max="150"
              step="5"
              value={hourlyRate}
              onChange={(e) => {
                const val = Number(e.target.value);
                setHourlyRate(val);
                handleCalculate(doors, users, val);
              }}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[oklch(0.89_0.008_260)] accent-[oklch(0.52_0.24_260)]"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Kalkuliere präzise...
              </span>
            ) : 'Exakten Business Case berechnen'}
          </button>
        </form>

        <div className="flex flex-col justify-center bg-[oklch(0.988_0.002_260)] rounded-xl p-6 border border-[oklch(0.89_0.008_260/0.3)]">
          {optimisticState.status === 'IDLE' ? (
            <div className="text-center text-[oklch(0.32_0.02_260)] flex flex-col items-center justify-center h-full">
              <svg className="w-12 h-12 mb-4 text-[oklch(0.89_0.008_260)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Passen Sie die Parameter an, um die Wirtschaftlichkeitsberechnung zu starten.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[oklch(0.52_0.24_260)] mb-1">
                  Initiale Investition
                </h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                    {optimisticState.totalInvestment.toLocaleString('de-DE')} €
                  </span>
                  <span className="text-sm text-[oklch(0.32_0.02_260)]">geschätzt</span>
                </div>
              </div>

              <div className="pt-6 border-t border-[oklch(0.89_0.008_260/0.55)]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[oklch(0.52_0.24_260)] mb-1">
                  Jährliches Einsparpotenzial
                </h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                    {optimisticState.annualSavings.toLocaleString('de-DE')} €
                  </span>
                  <span className="text-sm text-[oklch(0.32_0.02_260)]">p.a.</span>
                </div>
                <p className="mt-2 text-xs text-[oklch(0.32_0.02_260)] leading-relaxed">
                  Basierend auf reduzierten Kosten für Zylindertausch und Verwaltungsaufwand bei 5% empirischem Schlüsselverlust.
                </p>
              </div>

              <div className="pt-6 border-t border-[oklch(0.89_0.008_260/0.55)] grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[oklch(0.52_0.24_260)] mb-1">
                    Amortisation
                  </h4>
                  <span className="text-xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                    {optimisticState.roiMonths} Monate
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[oklch(0.52_0.24_260)] mb-1">
                    Break-Even
                  </h4>
                  <span className="text-xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                    Jahr {optimisticState.breakevenYear}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

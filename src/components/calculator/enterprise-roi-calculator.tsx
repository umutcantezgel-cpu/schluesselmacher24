'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseROI } from '@/actions/calculate-enterprise-roi';

export interface ROICalculationResult {
  savings: number;
  investment: number;
  roiMonths: number;
  status: 'IDLE' | 'SUCCESS' | 'ERROR';
}

const initialState: ROICalculationResult = {
  savings: 0,
  investment: 0,
  roiMonths: 0,
  status: 'IDLE'
};

export function EnterpriseROICalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseROI, initialState);

  // Create an optimistic state that updates immediately when inputs change
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (currentState, optimisticValue: Partial<ROICalculationResult>) => ({
      ...currentState,
      ...optimisticValue,
    })
  );

  function handleInputChange(e: React.ChangeEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const employees = Number(formData.get('employees') || 50);
    const incidents = Number(formData.get('incidents') || 5);
    const securityLevel = formData.get('securityLevel') as string;

    let baseCostPerIncident = 2500;
    if (securityLevel === 'HIGH') baseCostPerIncident = 5000;
    if (securityLevel === 'MAXIMUM') baseCostPerIncident = 10000;

    const currentLoss = incidents * baseCostPerIncident;
    const savings = currentLoss * 0.85;
    const investment = employees * 120 + 5000;
    const roiMonths = savings > 0 ? investment / (savings / 12) : 0;

    startTransition(() => {
      setOptimisticState({
        savings: Math.round(savings),
        investment: Math.round(investment),
        roiMonths: Math.round(roiMonths * 10) / 10,
        status: 'SUCCESS'
      });
      // Removed automatic submission on every tick to avoid spamming the backend.
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Enterprise ROI- & Amortisations-Kalkulator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
        Berechnen Sie das Einsparpotenzial durch präventive Sicherheitstechnik und die voraussichtliche Amortisationszeit.
      </p>

      <form action={formAction} onChange={handleInputChange} className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)]">
              <span>Mitarbeiter / Personen im Objekt</span>
            </label>
            <input
              type="range"
              name="employees"
              min="10"
              max="500"
              defaultValue="50"
              className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
            />
            <div className="mt-1 flex justify-between text-xs text-foreground-muted">
              <span>10</span>
              <span>500+</span>
            </div>
          </div>

          <div>
            <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)]">
              <span>Sicherheitsrelevante Vorfälle (pro Jahr)</span>
            </label>
            <input
              type="range"
              name="incidents"
              min="0"
              max="50"
              defaultValue="5"
              className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
            />
            <div className="mt-1 flex justify-between text-xs text-foreground-muted">
              <span>0</span>
              <span>50</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Schutzbedarf</label>
            <select
              name="securityLevel"
              defaultValue="STANDARD"
              className="mt-2 block w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-white px-3 py-2 text-sm text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
            >
              <option value="STANDARD">Standard (Gewerbe, Büro)</option>
              <option value="HIGH">Erhöht (Produktion, Lager, IT)</option>
              <option value="MAXIMUM">Maximal (KRITIS, Forschung)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-xl bg-white p-6 shadow-sm border border-[oklch(0.89_0.008_260/0.55)]">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.52_0.015_260)]">
                Geschätzte Einsparung / Jahr
              </p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] transition-all">
                {optimisticState.savings.toLocaleString('de-DE')} €
              </p>
            </div>

            <div className="h-px w-full bg-[oklch(0.89_0.008_260/0.55)]" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-[oklch(0.32_0.02_260)]">Investitionsrahmen</p>
                <p className="mt-1 text-lg font-semibold text-[oklch(0.16_0.02_260)]">
                  ~ {optimisticState.investment.toLocaleString('de-DE')} €
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-[oklch(0.32_0.02_260)]">Amortisation (ROI)</p>
                <p className="mt-1 text-lg font-semibold text-[oklch(0.52_0.24_260)]">
                  {optimisticState.roiMonths > 0 ? `${optimisticState.roiMonths} Monate` : '-'}
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-8 w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
          >
            {isPending ? 'Berechne...' : 'Detailanalyse anfordern'}
          </button>
        </div>
      </form>
    </div>
  );
}

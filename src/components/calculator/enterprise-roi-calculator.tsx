'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseROI } from '@/lib/actions/calculate-enterprise-roi';
import type { EnterpriseROICalculationResult } from '@/lib/actions/calculate-enterprise-roi';

const initialState: EnterpriseROICalculationResult = {
  roiPercent: 0,
  amortizationMonths: 0,
  savedHoursPerYear: 0,
  totalCostEstimate: 0,
};

export function EnterpriseROICalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseROI, initialState);
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current, update: Partial<EnterpriseROICalculationResult>) => ({
      ...current,
      ...update,
    })
  );

  function handleOptimisticChange(form: HTMLFormElement) {
    const formData = new FormData(form);
    const doors = Number(formData.get('doors') || 50);
    const users = Number(formData.get('users') || 100);
    const hourlyRate = Number(formData.get('hourlyRate') || 45);

    const baseSystemCost = 2500;
    const costPerDoor = 350;
    const costPerUser = 25;
    const totalCostEstimate = baseSystemCost + doors * costPerDoor + users * costPerUser;

    const savedMinutesPerYear = users * 10 + doors * 20;
    const savedHoursPerYear = savedMinutesPerYear / 60;
    const savedCostPerYear = savedHoursPerYear * hourlyRate;
    const amortizationMonths = totalCostEstimate / (savedCostPerYear / 12);
    const roiPercent = ((savedCostPerYear - totalCostEstimate) / totalCostEstimate) * 100;

    startTransition(() => {
      setOptimisticState({
        roiPercent: Math.max(-100, Math.round(roiPercent)),
        amortizationMonths: Math.max(1, Math.round(amortizationMonths)),
        savedHoursPerYear: Math.round(savedHoursPerYear),
        totalCostEstimate: Math.round(totalCostEstimate),
      });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]" style={{ viewTransitionName: 'enterprise-roi-calc' }}>
      <h3 className="text-xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">
        Enterprise ROI- und Ladezeit-Kalkulator
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[oklch(0.32_0.02_260)]">
        Kalkulieren Sie die Amortisation und Kosten Ihrer neuen Schließanlage. Bewegen Sie die
        Schieberegler, um die Auswirkungen auf das Budget und die eingesparte Verwaltungszeit
        sofort zu sehen.
      </p>

      <form
        action={formAction}
        onChange={(e) => handleOptimisticChange(e.currentTarget)}
        className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12"
      >
        <div className="space-y-6">
          <div>
            <div className="flex justify-between">
              <label htmlFor="doors" className="text-sm font-medium text-[oklch(0.32_0.02_260)]">
                Anzahl Türen / Schließstellen
              </label>
              <span className="text-sm font-semibold text-[oklch(0.16_0.02_260)]">
                <output name="doorsOutput" id="doorsOutput">50</output>
              </span>
            </div>
            <input
              type="range"
              id="doors"
              name="doors"
              min="5"
              max="500"
              defaultValue="50"
              onInput={(e) => {
                const output = e.currentTarget.form?.elements.namedItem('doorsOutput') as HTMLOutputElement;
                if (output) output.value = e.currentTarget.value;
              }}
              className="mt-2 w-full accent-[oklch(0.52_0.24_260)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.52_0.24_260)] focus-visible:ring-offset-2"
            />
          </div>

          <div>
            <div className="flex justify-between">
              <label htmlFor="users" className="text-sm font-medium text-[oklch(0.32_0.02_260)]">
                Anzahl Nutzer / Mitarbeiter
              </label>
              <span className="text-sm font-semibold text-[oklch(0.16_0.02_260)]">
                <output name="usersOutput" id="usersOutput">100</output>
              </span>
            </div>
            <input
              type="range"
              id="users"
              name="users"
              min="10"
              max="1000"
              defaultValue="100"
              onInput={(e) => {
                const output = e.currentTarget.form?.elements.namedItem('usersOutput') as HTMLOutputElement;
                if (output) output.value = e.currentTarget.value;
              }}
              className="mt-2 w-full accent-[oklch(0.52_0.24_260)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.52_0.24_260)] focus-visible:ring-offset-2"
            />
          </div>

          <div>
            <div className="flex justify-between">
              <label htmlFor="hourlyRate" className="text-sm font-medium text-[oklch(0.32_0.02_260)]">
                Interner Stundensatz (€)
              </label>
              <span className="text-sm font-semibold text-[oklch(0.16_0.02_260)]">
                <output name="hourlyRateOutput" id="hourlyRateOutput">45</output> €
              </span>
            </div>
            <input
              type="range"
              id="hourlyRate"
              name="hourlyRate"
              min="20"
              max="150"
              defaultValue="45"
              onInput={(e) => {
                const output = e.currentTarget.form?.elements.namedItem('hourlyRateOutput') as HTMLOutputElement;
                if (output) output.value = e.currentTarget.value;
              }}
              className="mt-2 w-full accent-[oklch(0.52_0.24_260)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.52_0.24_260)] focus-visible:ring-offset-2"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.52_0.24_260)] focus-visible:ring-offset-2"
          >
            {isPending ? 'Kalkuliere exakte Werte...' : 'Kalkulation validieren'}
          </button>
        </div>

        <div className="grid grid-rows-subgrid gap-4 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
          <div className="flex flex-col">
            <span className="text-[13px] font-medium uppercase tracking-wider text-[oklch(0.52_0.015_260)]">
              Geschätzte Systemkosten
            </span>
            <span className="mt-1 text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.totalCostEstimate > 0
                ? `${optimisticState.totalCostEstimate.toLocaleString('de-DE')} €`
                : '---'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[13px] font-medium uppercase tracking-wider text-[oklch(0.52_0.015_260)]">
              Amortisationszeit
            </span>
            <span className="mt-1 text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
               {optimisticState.amortizationMonths > 0
                ? `${optimisticState.amortizationMonths} Monate`
                : '---'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[13px] font-medium uppercase tracking-wider text-[oklch(0.52_0.015_260)]">
              Verwaltungszeit-Ersparnis
            </span>
            <span className="mt-1 text-3xl font-bold tracking-tight text-[oklch(0.52_0.24_260)]">
              {optimisticState.savedHoursPerYear > 0
                ? `${optimisticState.savedHoursPerYear} h / Jahr`
                : '---'}
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}

'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseRoi } from '@/actions/calculate-roi';
import type { RoiCalculationResult } from '@/actions/calculate-roi';

const initialState: RoiCalculationResult = {
  efficiencyGain: 0,
  costSavings: 0,
  paybackPeriodMonths: 24,
  tier: 'BASIC'
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseRoi, initialState);

  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current: RoiCalculationResult, update: Partial<RoiCalculationResult>) => ({
      ...current,
      ...update
    })
  );

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const form = e.currentTarget.form;
    if (!form) return;

    const doors = Number((form.elements.namedItem('doorCount') as HTMLInputElement)?.value || 10);
    const users = Number((form.elements.namedItem('userCount') as HTMLInputElement)?.value || 25);
    const changes = Number((form.elements.namedItem('changeFrequency') as HTMLInputElement)?.value || 5);

    startTransition(() => {
      const baseEfficiency = (doors * 0.5) + (users * 0.2);
      const efficiencyGain = baseEfficiency + (changes * 1.5);
      const costSavings = Math.round(efficiencyGain * 120);

      let paybackPeriodMonths = 24;
      let tier: 'BASIC' | 'ADVANCED' | 'ENTERPRISE' = 'BASIC';

      if (doors > 50 || users > 100) {
        tier = 'ENTERPRISE';
        paybackPeriodMonths = 12;
      } else if (doors > 20 || users > 40) {
        tier = 'ADVANCED';
        paybackPeriodMonths = 18;
      }

      setOptimisticState({
        efficiencyGain: Math.round(efficiencyGain),
        costSavings,
        paybackPeriodMonths,
        tier
      });
      // Removing automatic requestSubmit on onChange for range slider to prevent request spam
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Interaktiver Enterprise ROI-Kalkulator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
        Ermitteln Sie die Effizienzsteigerung und Kosteneinsparungen durch den Wechsel auf eine moderne Schließanlage.
      </p>

      <form action={formAction} className="mt-8 space-y-8">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between">
              <label htmlFor="doorCount" className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl der Türen</label>
              <span className="text-sm font-semibold text-[oklch(0.16_0.02_260)]" id="doorCountVal">10+</span>
            </div>
            <input
              type="range"
              id="doorCount"
              name="doorCount"
              min="5"
              max="200"
              defaultValue="10"
              onChange={handleInputChange}
              onMouseUp={(e) => e.currentTarget.form?.requestSubmit()}
              onTouchEnd={(e) => e.currentTarget.form?.requestSubmit()}
              onInput={(e) => {
                const el = document.getElementById('doorCountVal');
                if (el) el.innerText = e.currentTarget.value + '+';
              }}
              className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>

          <div>
             <div className="flex justify-between">
              <label htmlFor="userCount" className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Nutzer / Mitarbeiter</label>
              <span className="text-sm font-semibold text-[oklch(0.16_0.02_260)]" id="userCountVal">25+</span>
            </div>
            <input
              type="range"
              id="userCount"
              name="userCount"
              min="5"
              max="500"
              defaultValue="25"
              onChange={handleInputChange}
              onMouseUp={(e) => e.currentTarget.form?.requestSubmit()}
              onTouchEnd={(e) => e.currentTarget.form?.requestSubmit()}
              onInput={(e) => {
                const el = document.getElementById('userCountVal');
                if (el) el.innerText = e.currentTarget.value + '+';
              }}
              className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>

           <div>
             <div className="flex justify-between">
              <label htmlFor="changeFrequency" className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Berechtigungsänderungen pro Monat</label>
              <span className="text-sm font-semibold text-[oklch(0.16_0.02_260)]" id="changeFrequencyVal">5</span>
            </div>
            <input
              type="range"
              id="changeFrequency"
              name="changeFrequency"
              min="1"
              max="50"
              defaultValue="5"
              onChange={handleInputChange}
              onMouseUp={(e) => e.currentTarget.form?.requestSubmit()}
              onTouchEnd={(e) => e.currentTarget.form?.requestSubmit()}
              onInput={(e) => {
                const el = document.getElementById('changeFrequencyVal');
                if (el) el.innerText = e.currentTarget.value;
              }}
              className="mt-2 w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>
        </div>

        <div className="grid gap-6 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.52_0.015_260)]">Geschätzte Einsparung / Jahr</span>
            <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.costSavings.toLocaleString('de-DE')} €
            </span>
          </div>

          <div className="flex flex-col gap-1 sm:border-l sm:border-[oklch(0.89_0.008_260/0.55)] sm:pl-6">
             <span className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.52_0.015_260)]">Amortisation in ca.</span>
             <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.paybackPeriodMonths} Mon.
            </span>
          </div>

           <div className="flex flex-col gap-1 pt-4 sm:col-span-2 sm:border-t sm:border-[oklch(0.89_0.008_260/0.55)]">
             <span className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.52_0.015_260)]">System-Empfehlung</span>
             <span className="text-lg font-medium text-[oklch(0.16_0.02_260)]">
              {optimisticState.tier === 'ENTERPRISE' ? 'Generalhauptschlüsselanlage (GHS)' :
               optimisticState.tier === 'ADVANCED' ? 'Hauptschlüsselanlage (HS)' : 'Zentralschlossanlage (Z)'}
            </span>
          </div>
        </div>

        {/* Hidden fallback submit button for accessibility/no-js cases if needed, though form auto-submits via JS */}
        <button type="submit" className="sr-only">Kalkulieren</button>
        {isPending && <p className="text-sm text-[oklch(0.52_0.24_260)] mt-2">Berechne...</p>}
      </form>
    </div>
  );
}

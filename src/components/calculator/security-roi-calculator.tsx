'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateSecurityROI } from '@/actions/calculate-roi';
import type { ROICalculationResult } from '@/actions/calculate-roi';

const initialState: ROICalculationResult = {
  estimatedBudget: 800,
  recommendation: 'Basisschutz (Mechanik + Melder)'
};

export function SecurityROICalculator() {
  const [state, formAction, isPending] = useActionState(calculateSecurityROI, initialState);

  const [optimisticState, setOptimisticState] = useOptimistic<ROICalculationResult, { budget: number, type: string }>(
    state,
    (current, update) => {
      let recommendation = 'Basisschutz (Mechanik + Melder)';
      if (update.budget > 5000) recommendation = 'Umfassender Schutz (inkl. Video & Alarmaufschaltung)';
      if (update.budget > 10000) recommendation = 'Vollschutz nach VdS-Klasse B/C';
      return { estimatedBudget: update.budget, recommendation };
    }
  );

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">
        Sicherheits-ROI & Budget-Kalkulator
      </h3>
      <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
        Ermitteln Sie den optimalen Investitionsrahmen für Ihr Objekt.
      </p>

      <form
        action={(formData) => {
          startTransition(() => {
            const scope = Number(formData.get('scopeValue') || 1);
            const type = formData.get('propertyType') as string || 'private';
            const baseRate = type === 'commercial' ? 2500 : 800;
            setOptimisticState({ budget: baseRate * scope, type });
          });
          formAction(formData);
        }}
        className="mt-8 space-y-8"
      >
        <div className="space-y-4">
          <label className="text-sm font-semibold text-[oklch(0.16_0.02_260)]">
            Objektart
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-4 hover:border-[oklch(0.52_0.24_260)]">
              <input type="radio" name="propertyType" value="private" defaultChecked className="accent-[oklch(0.52_0.24_260)]" onChange={(e) => {
                startTransition(() => {
                  const form = e.target.closest('form');
                  if (form) {
                    const formData = new FormData(form);
                    const scope = Number(formData.get('scopeValue') || 1);
                    const type = 'private';
                    const baseRate = 800;
                    setOptimisticState({ budget: baseRate * scope, type });
                  }
                });
              }} />
              <span className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Privat / Wohnen</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-4 hover:border-[oklch(0.52_0.24_260)]">
              <input type="radio" name="propertyType" value="commercial" className="accent-[oklch(0.52_0.24_260)]" onChange={(e) => {
                startTransition(() => {
                  const form = e.target.closest('form');
                  if (form) {
                    const formData = new FormData(form);
                    const scope = Number(formData.get('scopeValue') || 1);
                    const type = 'commercial';
                    const baseRate = 2500;
                    setOptimisticState({ budget: baseRate * scope, type });
                  }
                });
              }} />
              <span className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Gewerbe / Industrie</span>
            </label>
          </div>
        </div>

        <div>
          <label className="flex justify-between text-sm font-semibold text-[oklch(0.16_0.02_260)]">
            <span>Umfang / Gefährdungspotenzial</span>
          </label>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-xs text-[oklch(0.52_0.015_260)]">Gering</span>
            <input
              type="range"
              name="scopeValue"
              min="1"
              max="10"
              defaultValue="2"
              className="w-full accent-[oklch(0.52_0.24_260)]"
              onChange={(e) => {
                startTransition(() => {
                  const form = e.target.closest('form');
                  if (form) {
                    const formData = new FormData(form);
                    const scope = Number(formData.get('scopeValue') || 1);
                    const type = formData.get('propertyType') as string || 'private';
                    const baseRate = type === 'commercial' ? 2500 : 800;
                    setOptimisticState({ budget: baseRate * scope, type });
                  }
                });
              }}
            />
            <span className="text-xs text-[oklch(0.52_0.015_260)]">Hoch</span>
          </div>
        </div>

        <div className="rounded-xl bg-[oklch(0.988_0.002_260)] p-5 border border-[oklch(0.89_0.008_260/0.55)]">
          <div className="flex flex-col gap-1 border-b border-[oklch(0.89_0.008_260/0.55)] pb-4 mb-4">
            <span className="text-sm text-[oklch(0.52_0.015_260)]">Kalkulierter Investitionsrahmen:</span>
            <span className="text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              ab {optimisticState.estimatedBudget.toLocaleString('de-DE')} €
            </span>
          </div>
          <div className="flex flex-col gap-1">
             <span className="text-sm text-[oklch(0.52_0.015_260)]">Empfohlene Architektur:</span>
             <span className="text-sm font-semibold text-[oklch(0.32_0.02_260)]">
              {optimisticState.recommendation}
             </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Berechne...' : 'Konfiguration übernehmen & detailliert planen'}
        </button>
      </form>
    </div>
  );
}

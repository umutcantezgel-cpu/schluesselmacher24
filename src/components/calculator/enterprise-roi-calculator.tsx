'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseROI } from '@/actions/calculate-roi';
import type { ROIResult } from '@/types/roi';

const initialState: ROIResult = {
  investment: 0,
  annualSavings: 0,
  netBenefit: 0,
  paybackMonths: 0,
  tier: 'STANDARD'
};

export function EnterpriseROICalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseROI, initialState);
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (currentState, update: Partial<ROIResult>) => ({
      ...currentState,
      ...update
    })
  );

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const form = e.target.closest('form');
    if (!form) return;

    const formData = new FormData(form);
    const securityLevel = formData.get('securityLevel')?.toString() || 'STANDARD';
    const siteArea = Number(formData.get('siteArea') || 100);
    const incidentFrequency = Number(formData.get('incidentFrequency') || 1);

    let baseCost = siteArea * 15;
    const riskCost = incidentFrequency * 5000;
    let savings = 0;

    if (securityLevel === 'HIGH') {
      baseCost *= 1.5;
      savings = riskCost * 0.8;
    } else if (securityLevel === 'PREMIUM') {
      baseCost *= 2.5;
      savings = riskCost * 0.95;
    } else {
      savings = riskCost * 0.4;
    }

    startTransition(() => {
      setOptimisticState({
        investment: baseCost,
        annualSavings: savings,
        netBenefit: savings - baseCost,
        paybackMonths: baseCost / (savings / 12) || 0,
        tier: securityLevel as 'STANDARD' | 'HIGH' | 'PREMIUM'
      });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] my-12">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Sicherheits-ROI Kalkulator</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)] mb-6">
        Berechnen Sie das Renditepotenzial Ihrer Investition in moderne Sicherheitstechnik.
      </p>
      <form action={formAction} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[oklch(0.32_0.02_260)] mb-2">Sicherheits-Level</label>
            <select
              name="securityLevel"
              onChange={handleInputChange}
              className="w-full rounded-lg border border-[oklch(0.89_0.008_260)] bg-white p-3 text-sm text-[oklch(0.16_0.02_260)]"
            >
              <option value="STANDARD">Standard-Schutz (Perimeter)</option>
              <option value="HIGH">Erweiterter Schutz (Video + Alarm)</option>
              <option value="PREMIUM">Enterprise (Vollintegriert + KI)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[oklch(0.32_0.02_260)] mb-2">Geschätzte Fläche (m²)</label>
            <input
              type="number"
              name="siteArea"
              defaultValue="500"
              min="50"
              max="50000"
              onChange={handleInputChange}
              className="w-full rounded-lg border border-[oklch(0.89_0.008_260)] bg-white p-3 text-sm text-[oklch(0.16_0.02_260)]"
            />
          </div>
        </div>

        <div>
          <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)] mb-2">
            <span>Vorfallhäufigkeit pro Jahr</span>
            <span className="font-bold">{optimisticState.annualSavings > 0 ? "..." : ""}</span>
          </label>
          <input
            type="range"
            name="incidentFrequency"
            min="0"
            max="12"
            defaultValue="2"
            onChange={handleInputChange}
            className="w-full accent-[oklch(0.52_0.24_260)]"
          />
          <div className="flex justify-between text-xs text-[oklch(0.52_0.015_260)] mt-1">
            <span>Selten (0)</span>
            <span>Häufig (12)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <div className="rounded-xl bg-white p-4 border border-[oklch(0.89_0.008_260/0.2)]">
            <span className="block text-xs text-[oklch(0.52_0.015_260)] uppercase tracking-wider mb-1">Investition (ca.)</span>
            <span className="text-xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.investment.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="rounded-xl bg-white p-4 border border-[oklch(0.89_0.008_260/0.2)]">
            <span className="block text-xs text-[oklch(0.52_0.015_260)] uppercase tracking-wider mb-1">Einsparung / Jahr</span>
            <span className="text-xl font-bold tracking-tight text-[oklch(0.52_0.24_260)]">
              {optimisticState.annualSavings.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="rounded-xl bg-[oklch(0.52_0.24_260)/0.05] p-4 border border-[oklch(0.52_0.24_260)/0.2]">
            <span className="block text-xs text-[oklch(0.52_0.24_260)] uppercase tracking-wider mb-1">Amortisation</span>
            <span className="text-xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.paybackMonths > 0 ? `${Math.ceil(optimisticState.paybackMonths)} Monate` : '-'}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 mt-4"
        >
          {isPending ? 'Berechne exaktes Modell...' : 'Detaillierte Analyse anfordern'}
        </button>
      </form>
    </div>
  );
}

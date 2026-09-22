'use client';

import { useActionState, useOptimistic, startTransition, useRef } from 'react';
import { calculateEnterpriseROI } from '@/lib/actions/calculate-enterprise-roi';
import type { ROICalculationResult } from '@/lib/actions/calculate-enterprise-roi';

const initialState: ROICalculationResult = {
  estimatedSavings: 0,
  amortizationMonths: 0,
  efficiencyGainPercentage: 0,
};

export function EnterpriseROICalculator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const [state, formAction, isPending] = useActionState(calculateEnterpriseROI, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current, update: Partial<ROICalculationResult>) => ({ ...current, ...update })
  );

  function handleCalculate() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);

    // Calculate costs of mechanical key replacement
    const employees = Number(formData.get('employees')) || 100;
    const keyLossRate = Number(formData.get('keyLossRate')) || 2;

    const costPerLostKeyIncident = 450;
    const annualMechanicalLossCost = keyLossRate * costPerLostKeyIncident;
    const adminTimePerEmployeeMechanical = 0.5;
    const adminTimePerEmployeeElectronic = 0.1;
    const adminHourlyRate = 45;
    const annualAdminSavings = employees * (adminTimePerEmployeeMechanical - adminTimePerEmployeeElectronic) * adminHourlyRate;
    const totalAnnualSavings = annualMechanicalLossCost + annualAdminSavings;

    startTransition(() => {
      setOptimisticState({
        estimatedSavings: totalAnnualSavings,
      });
    });
  }

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} style={{ viewTransitionName: "roi-calculator" }} className="group relative overflow-hidden rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),oklch(0.52_0.24_260/0.05),transparent_50%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden" aria-hidden="true" />
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Enterprise ROI-Kalkulator</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)]">
        Berechnen Sie das Einsparpotenzial durch die Umstellung auf ein modernes,
        elektronisch verwaltetes Schließanlagensystem im Vergleich zu rein mechanischen Lösungen.
      </p>

      <form ref={formRef} action={formAction} className="mt-8 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
            <div>
            <label htmlFor="doors" className="block text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl Türen</label>
            <input
                type="number"
                id="doors"
                name="doors"
                defaultValue="50"
                onChange={handleCalculate}
                className="mt-2 w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-4 py-2.5 text-sm text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
            />
            </div>
            <div>
            <label htmlFor="employees" className="block text-sm font-medium text-[oklch(0.32_0.02_260)]">Anzahl Mitarbeiter</label>
            <input
                type="number"
                id="employees"
                name="employees"
                defaultValue="100"
                onChange={handleCalculate}
                className="mt-2 w-full rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-4 py-2.5 text-sm text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
            />
            </div>
             <div className="md:col-span-2">
                <label htmlFor="keyLossRate" className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)]">
                    <span>Schlüsselverluste pro Jahr</span>
                    <span>Geschätzter Aufwand bei Verlust: ~450€</span>
                </label>
                <input
                    type="range"
                    id="keyLossRate"
                    name="keyLossRate"
                    min="0"
                    max="10"
                    defaultValue="2"
                    onChange={handleCalculate}
                    className="mt-4 w-full accent-[oklch(0.52_0.24_260)]"
                />
            </div>
        </div>

        <div className="mt-8 grid gap-4 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col">
             <span className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.52_0.015_260)]">Ersparnis p.a.</span>
             <span className="mt-1 text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                {optimisticState.estimatedSavings > 0 ? `${optimisticState.estimatedSavings.toLocaleString('de-DE')} €` : '---'}
             </span>
          </div>
          <div className="flex flex-col">
             <span className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.52_0.015_260)]">Amortisation in</span>
             <span className="mt-1 text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                {optimisticState.amortizationMonths > 0 ? `${optimisticState.amortizationMonths} Mon.` : '---'}
             </span>
          </div>
           <div className="flex flex-col">
             <span className="text-xs font-semibold uppercase tracking-wider text-[oklch(0.52_0.015_260)]">Effizienzgewinn Admin</span>
             <span className="mt-1 text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                {optimisticState.efficiencyGainPercentage > 0 ? `${optimisticState.efficiencyGainPercentage}%` : '---'}
             </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Berechne ROI...' : 'Detaillierte Analyse anfordern'}
        </button>
      </form>
    </div>
  );
}

'use client';

import { useActionState, useOptimistic, startTransition, useRef } from 'react';
import { estimateCost42, type EnterpriseROICalculatorResult } from '@/lib/actions/estimate-cost-42';

const initialState: EnterpriseROICalculatorResult = {
  totalEstimate: 0,
  timeSavingsEstimate: 0,
  breakdown: [],
  tier: 'BASIC',
};

export function EnterpriseROICalculator() {
  const [state, formAction, isPending] = useActionState(estimateCost42, initialState);

  // Optimistic updates for the sliders
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (currentState, optimisticUpdate: Partial<EnterpriseROICalculatorResult>) => ({
      ...currentState,
      ...optimisticUpdate
    })
  );

  const formRef = useRef<HTMLFormElement>(null);

  // We handle local slider changes to immediately update optimistic numbers
  function handleSliderChange() {
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const doors = Number(formData.get('doors')) || 10;
    const users = Number(formData.get('users')) || 20;
    const systemType = formData.get('systemType') as string || 'HS';

    // Simple client-side mirroring of the server logic for optimistic feedback
    let costPerDoor = 0;
    let costPerUser = 0;
    switch (systemType) {
      case 'GS': costPerDoor = 65; costPerUser = 15; break;
      case 'Z': costPerDoor = 110; costPerUser = 25; break;
      case 'HS': costPerDoor = 160; costPerUser = 45; break;
      case 'GHS': costPerDoor = 220; costPerUser = 65; break;
    }

    const doorCosts = doors * costPerDoor;
    const userCosts = users * costPerUser;
    const planningBase = systemType === 'GHS' ? 350 : systemType === 'HS' ? 180 : 80;
    const totalEstimate = doorCosts + userCosts + planningBase;
    const timeSavingsEstimate = users * 1.5 + (systemType === 'GHS' ? 24 : systemType === 'HS' ? 12 : 0);

    startTransition(() => {
      setOptimisticState({
        totalEstimate,
        timeSavingsEstimate,
      });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] group transition-all duration-500 hover:shadow-[0_16px_40px_-8px_oklch(0.16_0.02_260/0.08)]">
      <h3 className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
        Interaktiver Enterprise ROI- und Ladezeit-Kalkulator
      </h3>
      <p className="mt-2 text-[15px] leading-relaxed text-[oklch(0.32_0.02_260)]">
        Ermitteln Sie mit wenigen Klicks eine erste Kostenschätzung und den administrativen Zeitgewinn durch den Einsatz moderner Schließanlagen.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <form ref={formRef} action={formAction} className="space-y-8" onChange={handleSliderChange}>
          {/* Slider 1: Türen */}
          <div>
            <div className="flex justify-between items-end mb-3">
              <label htmlFor="doors" className="text-[14px] font-semibold text-[oklch(0.16_0.02_260)]">
                Anzahl der Schließstellen (Türen)
              </label>
              <span className="text-[13px] font-medium text-[oklch(0.52_0.015_260)]" aria-hidden>5 bis 200</span>
            </div>
            <input
              id="doors"
              type="range"
              name="doors"
              min="5"
              max="200"
              defaultValue="20"
              className="w-full h-2 bg-[oklch(0.89_0.008_260)] rounded-lg appearance-none cursor-pointer accent-[oklch(0.52_0.24_260)]"
            />
          </div>

          {/* Slider 2: Nutzer */}
          <div>
            <div className="flex justify-between items-end mb-3">
              <label htmlFor="users" className="text-[14px] font-semibold text-[oklch(0.16_0.02_260)]">
                Anzahl der Nutzer (Schlüssel)
              </label>
              <span className="text-[13px] font-medium text-[oklch(0.52_0.015_260)]" aria-hidden>5 bis 500</span>
            </div>
            <input
              id="users"
              type="range"
              name="users"
              min="5"
              max="500"
              defaultValue="50"
              className="w-full h-2 bg-[oklch(0.89_0.008_260)] rounded-lg appearance-none cursor-pointer accent-[oklch(0.52_0.24_260)]"
            />
          </div>

          {/* Select: Anlagentyp */}
          <div>
            <label htmlFor="systemType" className="block text-[14px] font-semibold text-[oklch(0.16_0.02_260)] mb-3">
              Anlagentyp
            </label>
            <div className="relative">
              <select
                id="systemType"
                name="systemType"
                defaultValue="HS"
                className="w-full appearance-none rounded-xl border border-[oklch(0.89_0.008_260/0.8)] bg-white px-4 py-3 text-[15px] font-medium text-[oklch(0.16_0.02_260)] outline-none transition-colors focus:border-[oklch(0.52_0.24_260)] focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
              >
                <option value="GS">Gleichschließung (GS)</option>
                <option value="Z">Zentralschlossanlage (Z)</option>
                <option value="HS">Hauptschlüsselanlage (HS)</option>
                <option value="GHS">Generalhauptschlüsselanlage (GHS)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[oklch(0.52_0.015_260)]">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isPending ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Wird berechnet...</span>
              </>
            ) : (
              'Detaillierte Aufschlüsselung anfordern'
            )}
          </button>
        </form>

        {/* Results Bento */}
        <div className="flex flex-col gap-4">
          <div className="flex-1 rounded-xl bg-white border border-[oklch(0.89_0.008_260/0.4)] p-6 flex flex-col justify-center">
            <span className="text-[13px] font-bold uppercase tracking-wider text-[oklch(0.52_0.015_260)] mb-2 block">
              Geschätztes Budget
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[oklch(0.16_0.02_260)]">
                {optimisticState.totalEstimate > 0 ? optimisticState.totalEstimate.toLocaleString('de-DE') : '—'}
              </span>
              <span className="text-xl font-medium text-[oklch(0.52_0.015_260)]">€</span>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-[oklch(0.52_0.015_260)]">
              Unverbindlicher Richtwert inkl. Projektierung, zzgl. MwSt.
            </p>
          </div>

          <div className="flex-1 rounded-xl bg-white border border-[oklch(0.89_0.008_260/0.4)] p-6 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.98_0.01_260)] to-transparent opacity-50"></div>
            <div className="relative z-10">
              <span className="text-[13px] font-bold uppercase tracking-wider text-[oklch(0.52_0.24_260)] mb-2 block">
                Erwarteter Zeitgewinn (ROI)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-[oklch(0.16_0.02_260)]">
                  {optimisticState.timeSavingsEstimate > 0 ? Math.round(optimisticState.timeSavingsEstimate).toLocaleString('de-DE') : '—'}
                </span>
                <span className="text-[15px] font-medium text-[oklch(0.52_0.015_260)]">Std. / Jahr</span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-[oklch(0.52_0.015_260)]">
                Durch effizienteres Schlüsselmanagement und klare Berechtigungsstrukturen.
              </p>
            </div>
          </div>

          {state.breakdown.length > 0 && (
            <div className="rounded-xl bg-[oklch(0.988_0.002_260)] border border-[oklch(0.89_0.008_260/0.4)] p-5">
              <h4 className="text-[13px] font-bold uppercase tracking-wider text-[oklch(0.32_0.02_260)] mb-3">
                Kostenaufschlüsselung
              </h4>
              <ul className="space-y-2">
                {state.breakdown.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center text-[14px]">
                    <span className="text-[oklch(0.32_0.02_260)]">{item.label}</span>
                    <span className="font-semibold text-[oklch(0.16_0.02_260)]">{item.cost.toLocaleString('de-DE')} €</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

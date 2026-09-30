'use client';

import { useActionState, useOptimistic, startTransition } from 'react';

// Define our types
export type SystemType = 'MECHANICAL' | 'MECHATRONIC' | 'ELECTRONIC';

export interface RoiCalculationResult {
  investition: number;
  wartungProJahr: number;
  adminProJahr: number;
  totalCost5Jahre: number;
  roiMonate: number | null; // Null if no positive ROI compared to mechanical
  system: SystemType;
}

// In-file server action
async function calculateEnterpriseRoi(
  prevState: RoiCalculationResult,
  formData: FormData
): Promise<RoiCalculationResult> {
  // We simulate server action processing time
  await new Promise((resolve) => setTimeout(resolve, 500));

  const doors = Number(formData.get('doors')) || 50;
  const staff = Number(formData.get('staff')) || 100;
  const turnoverRate = Number(formData.get('turnoverRate')) || 15; // in % per year
  const system = (formData.get('system') as SystemType) || 'MECHANICAL';

  // Base assumptions
  // Mechanical:
  //   Invest: 150€/door
  //   Wartung: 10€/door/year
  //   Admin: turnover * (staff lost) -> new key 50€, sometimes replace cylinder 150€
  // Mechatronic:
  //   Invest: 350€/door
  //   Wartung: 20€/door/year (batteries)
  //   Admin: turnover * (staff lost) -> block transponder 0€, new transponder 5€
  // Electronic:
  //   Invest: 800€/door (wiring)
  //   Wartung: 15€/door/year
  //   Admin: 0€ for key, but some software admin

  const lostKeysPerYear = staff * (turnoverRate / 100);

  let investition = 0;
  let wartungProJahr = 0;
  let adminProJahr = 0;

  if (system === 'MECHANICAL') {
    investition = doors * 150;
    wartungProJahr = doors * 10;
    adminProJahr = lostKeysPerYear * (50 + (doors * 0.1 * 150)); // Assume 10% of doors need cylinder exchange
  } else if (system === 'MECHATRONIC') {
    investition = doors * 350;
    wartungProJahr = doors * 20;
    adminProJahr = lostKeysPerYear * 5;
  } else if (system === 'ELECTRONIC') {
    investition = doors * 800;
    wartungProJahr = doors * 15;
    adminProJahr = lostKeysPerYear * 2;
  }

  const totalCost5Jahre = investition + (wartungProJahr + adminProJahr) * 5;

  // Calculate baseline mechanical to show ROI
  const mechInvest = doors * 150;
  const mechWartung = doors * 10;
  const mechAdmin = lostKeysPerYear * (50 + (doors * 0.1 * 150));

  let roiMonate: number | null = null;
  if (system !== 'MECHANICAL') {
    const diffInvest = investition - mechInvest;
    const diffSavingPerYear = (mechWartung + mechAdmin) - (wartungProJahr + adminProJahr);

    if (diffSavingPerYear > 0) {
      roiMonate = Math.ceil((diffInvest / diffSavingPerYear) * 12);
    }
  }

  return {
    investition,
    wartungProJahr,
    adminProJahr,
    totalCost5Jahre,
    roiMonate,
    system,
  };
}

const initialState: RoiCalculationResult = {
  investition: 7500,
  wartungProJahr: 500,
  adminProJahr: 1700,
  totalCost5Jahre: 18500,
  roiMonate: null,
  system: 'MECHANICAL'
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseRoi, initialState);

  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current, update: Partial<RoiCalculationResult>) => ({ ...current, ...update })
  );

  function handleFormChange(e: React.ChangeEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const doors = Number(formData.get('doors')) || 50;
    const system = (formData.get('system') as SystemType) || 'MECHANICAL';

    // Simplistic optimistic update just to show reactivity
    startTransition(() => {
      setOptimisticState({
        system,
        investition: system === 'ELECTRONIC' ? doors * 800 : system === 'MECHATRONIC' ? doors * 350 : doors * 150
      });
      // We explicitly request submit to trigger the actual server action
      e.currentTarget.requestSubmit();
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Interaktiver TCO- & ROI-Kalkulator</h3>
        <p className="text-sm text-[oklch(0.32_0.02_260)] mt-2">
          Vergleichen Sie die 5-Jahres-Kosten (Total Cost of Ownership) verschiedener Systemarchitekturen basierend auf Ihrer Objektgröße.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <form action={formAction} onChange={handleFormChange} className="space-y-6">
            <div>
              <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)] mb-2">
                <span>Anzahl der Türen</span>
                <span className="font-semibold text-[oklch(0.16_0.02_260)]" id="doors-val">50</span>
              </label>
              <input
                type="range"
                name="doors"
                min="10"
                max="500"
                step="10"
                defaultValue="50"
                onInput={(e) => {
                  const valSpan = document.getElementById('doors-val');
                  if (valSpan) valSpan.textContent = e.currentTarget.value;
                }}
                className="w-full accent-[oklch(0.52_0.24_260)] hover:accent-[oklch(0.48_0.24_260)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.52_0.24_260)] focus-visible:ring-offset-2"
              />
            </div>

            <div>
              <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)] mb-2">
                <span>Anzahl der Mitarbeiter</span>
                <span className="font-semibold text-[oklch(0.16_0.02_260)]" id="staff-val">100</span>
              </label>
              <input
                type="range"
                name="staff"
                min="20"
                max="2000"
                step="20"
                defaultValue="100"
                onInput={(e) => {
                  const valSpan = document.getElementById('staff-val');
                  if (valSpan) valSpan.textContent = e.currentTarget.value;
                }}
                className="w-full accent-[oklch(0.52_0.24_260)] hover:accent-[oklch(0.48_0.24_260)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.52_0.24_260)] focus-visible:ring-offset-2"
              />
            </div>

            <div>
              <label className="flex justify-between text-sm font-medium text-[oklch(0.32_0.02_260)] mb-2">
                <span>Fluktuation pro Jahr</span>
                <span className="font-semibold text-[oklch(0.16_0.02_260)]" id="fluc-val">15%</span>
              </label>
              <input
                type="range"
                name="turnoverRate"
                min="5"
                max="50"
                step="5"
                defaultValue="15"
                onInput={(e) => {
                  const valSpan = document.getElementById('fluc-val');
                  if (valSpan) valSpan.textContent = e.currentTarget.value + '%';
                }}
                className="w-full accent-[oklch(0.52_0.24_260)] hover:accent-[oklch(0.48_0.24_260)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.52_0.24_260)] focus-visible:ring-offset-2"
              />
            </div>

            <div className="pt-4 border-t border-[oklch(0.89_0.008_260/0.55)]">
              <label className="block text-sm font-medium text-[oklch(0.32_0.02_260)] mb-3">Systemarchitektur</label>
              <div className="grid grid-cols-3 gap-3">
                {['MECHANICAL', 'MECHATRONIC', 'ELECTRONIC'].map((sys) => (
                  <label
                    key={sys}
                    className={`
                      cursor-pointer rounded-lg border text-center py-2 px-1 text-xs font-semibold transition-all
                      ${optimisticState.system === sys
                        ? 'border-[oklch(0.52_0.24_260)] bg-[oklch(0.52_0.24_260)/0.1] text-[oklch(0.52_0.24_260)]'
                        : 'border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] text-[oklch(0.32_0.02_260)] hover:bg-[oklch(0.968_0.004_260)]'}
                    `}
                  >
                    <input
                      type="radio"
                      name="system"
                      value={sys}
                      className="sr-only"
                      defaultChecked={optimisticState.system === sys}
                    />
                    {sys === 'MECHANICAL' ? 'Mechanisch' : sys === 'MECHATRONIC' ? 'Mechatronisch' : 'Elektronisch'}
                  </label>
                ))}
              </div>
            </div>

            {/* Hidden submit button since we rely on onChange */}
            <button type="submit" className="sr-only">Berechnen</button>
          </form>
        </div>

        <div className="lg:col-span-7">
          <div className={`grid grid-rows-[subgrid] h-full gap-4 transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
            <div className="bg-[oklch(0.988_0.002_260)] rounded-xl p-6 border border-[oklch(0.89_0.008_260/0.55)] shadow-sm">
              <span className="text-sm text-[oklch(0.52_0.015_260)] font-medium">Initiale Investition</span>
              <div className="mt-2 text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                {optimisticState.investition.toLocaleString('de-DE')} €
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[oklch(0.988_0.002_260)] rounded-xl p-6 border border-[oklch(0.89_0.008_260/0.55)] shadow-sm">
                <span className="text-sm text-[oklch(0.52_0.015_260)] font-medium">Wartung p.a.</span>
                <div className="mt-2 text-xl font-bold tracking-tight text-[oklch(0.32_0.02_260)]">
                  {Math.round(optimisticState.wartungProJahr).toLocaleString('de-DE')} €
                </div>
              </div>
              <div className="bg-[oklch(0.988_0.002_260)] rounded-xl p-6 border border-[oklch(0.89_0.008_260/0.55)] shadow-sm">
                <span className="text-sm text-[oklch(0.52_0.015_260)] font-medium">Admin & Verlust p.a.</span>
                <div className="mt-2 text-xl font-bold tracking-tight text-[oklch(0.32_0.02_260)]">
                  {Math.round(optimisticState.adminProJahr).toLocaleString('de-DE')} €
                </div>
              </div>
            </div>

            <div className="bg-[oklch(0.988_0.002_260)] rounded-xl p-6 border border-[oklch(0.52_0.24_260)/0.3] shadow-[0_4px_12px_oklch(0.52_0.24_260/0.1)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[oklch(0.52_0.24_260)]"></div>
              <span className="text-sm text-[oklch(0.52_0.015_260)] font-medium">Gesamtkosten über 5 Jahre (TCO)</span>
              <div className="mt-2 text-4xl font-extrabold tracking-tight text-[oklch(0.16_0.02_260)]">
                {Math.round(optimisticState.totalCost5Jahre).toLocaleString('de-DE')} €
              </div>

              {optimisticState.roiMonate !== null && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[oklch(0.52_0.24_260)/0.1] px-3 py-1 text-sm font-semibold text-[oklch(0.52_0.24_260)]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  ROI erreicht nach {optimisticState.roiMonate} Monaten*
                </div>
              )}
              {optimisticState.system === 'MECHANICAL' && (
                <div className="mt-4 text-xs text-[oklch(0.32_0.02_260)]">
                  *Mechanische Systeme dienen hier als Basislinie (0-Punkt) für den ROI-Vergleich.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

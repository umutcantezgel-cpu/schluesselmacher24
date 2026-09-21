'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseRoi, type RoiCalculationResult } from '@/lib/actions/calculate-roi';

const initialState: RoiCalculationResult = {
  estimatedSavings: 0,
  amortizationMonths: 0,
  tier: 'STANDARD',
  details: []
};

export function EnterpriseRoiCalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseRoi, initialState);

  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current, update: Partial<RoiCalculationResult>) => ({
      ...current,
      ...update
    })
  );

  function handleStateChange(e: React.ChangeEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const doors = Number(formData.get('doors')) || 0;
    const users = Number(formData.get('users')) || 0;
    const keyLossRate = Number(formData.get('keyLossRate')) || 0;

    // Extremely basic real-time logic matching server logic roughly
    const totalSavings = (doors * 25) + (keyLossRate * (65 * 3 + 150));

    let tier: 'STANDARD' | 'ENTERPRISE' | 'CUSTOM' = 'STANDARD';
    if (doors > 200 || users > 500) {
      tier = 'CUSTOM';
    } else if (doors > 50 || users > 100) {
      tier = 'ENTERPRISE';
    }

    startTransition(() => {
      setOptimisticState({
        estimatedSavings: totalSavings,
        tier
      });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] [view-transition-name:roi-calculator]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Enterprise ROI- & Ladezeit-Kalkulator</h3>
      <p className="mt-2 text-[14px] text-[oklch(0.32_0.02_260)] leading-relaxed">
        Berechnen Sie das Einsparpotenzial einer modernen Schließanlage. Bewegen Sie die Regler, um die Auswirkungen von Schlüsselverlusten und Verwaltungsaufwand in Echtzeit zu simulieren.
      </p>

      <form action={formAction} onChange={handleStateChange} className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] flex justify-between">
              <span>Anzahl der Schließstellen (Türen)</span>
            </label>
            <input
              type="range"
              name="doors"
              min="10"
              max="500"
              defaultValue="50"

              className="mt-3 w-full accent-[oklch(0.52_0.24_260)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[oklch(0.52_0.24_260)]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] flex justify-between">
              <span>Anzahl der Nutzer/Mitarbeiter</span>
            </label>
            <input
              type="range"
              name="users"
              min="10"
              max="1000"
              defaultValue="100"
              className="mt-3 w-full accent-[oklch(0.52_0.24_260)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[oklch(0.52_0.24_260)]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[oklch(0.32_0.02_260)] flex justify-between">
              <span>Durchschnittlicher Schlüsselverlust pro Jahr</span>
            </label>
            <input
              type="range"
              name="keyLossRate"
              min="0"
              max="50"
              defaultValue="2"
              className="mt-3 w-full accent-[oklch(0.52_0.24_260)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[oklch(0.52_0.24_260)]"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm">
          <div>
            <h4 className="text-sm font-medium text-[oklch(0.52_0.015_260)] uppercase tracking-wider">Ihre Einsparungen</h4>
            <div className="mt-2 text-4xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {optimisticState.estimatedSavings > 0
                ? `${optimisticState.estimatedSavings.toLocaleString('de-DE')} €`
                : '---'}
            </div>
            <div className="mt-1 text-sm text-[oklch(0.32_0.02_260)]">pro Jahr (geschätzt)</div>

            {optimisticState.details.length > 0 && (
              <ul className="mt-6 space-y-3">
                {optimisticState.details.map((detail, idx) => (
                  <li key={idx} className="flex gap-2 text-[13px] text-[oklch(0.32_0.02_260)] leading-relaxed">
                    <span className="text-[oklch(0.52_0.24_260)] shrink-0">✓</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            )}

            {optimisticState.tier !== 'STANDARD' && optimisticState.estimatedSavings > 0 && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[oklch(0.96_0.02_260)] px-3 py-1 text-xs font-semibold text-[oklch(0.16_0.02_260)] border border-[oklch(0.89_0.008_260/0.55)]">
                <span className="flex h-2 w-2 rounded-full bg-[oklch(0.52_0.24_260)]" />
                {optimisticState.tier} Empfehlung
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-8 w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[oklch(0.52_0.24_260)]"
          >
            {isPending ? 'Berechne Detaillierung...' : 'Exakte Kalkulation anfordern'}
          </button>
        </div>
      </form>
    </div>
  );
}

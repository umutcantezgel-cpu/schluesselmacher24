'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateCarKeyCost } from '@/actions/calculate-car-key';
import type { CarKeyCalculationResult } from '@/types/car-key';

const initialState: CarKeyCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'STANDARD'
};

export function AutoKeyConfigurator() {
  const [state, formAction, isPending] = useActionState(calculateCarKeyCost, initialState);

  // Wir nutzen useOptimistic um sofortiges Feedback bei Eingabe zu geben.
  const [optimisticTotal, setOptimisticTotal] = useOptimistic(
    state.totalEstimate,
    (current, update: number) => update
  );

  function handleSelectionChange(e: React.ChangeEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const serviceType = formData.get('serviceType') as string;
    const keyType = formData.get('keyType') as string;
    const brandGroup = formData.get('brandGroup') as string;

    // Einfache client-side Vorberechnung für optimistisches Update
    let est = 0;
    if (serviceType === 'copy') est = 80;
    if (serviceType === 'programming') est = 120;
    if (serviceType === 'repair') est = 50;

    if (keyType === 'remote') est += 40;
    if (keyType === 'smart') est += 100;

    if (brandGroup === 'premium') est *= 1.3;
    if (brandGroup === 'luxury') est *= 1.6;

    startTransition(() => {
      setOptimisticTotal(Math.round(est));
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold tracking-tight text-[oklch(0.16_0.02_260)]">
        Interaktiver Preiskalkulator Autoschlüssel
      </h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
        Wählen Sie Ihre gewünschte Leistung, die Art Ihres Schlüssels und die Fahrzeugklasse,
        um sofort eine fundierte Kostenschätzung zu erhalten.
      </p>

      <form action={formAction} onChange={handleSelectionChange} className="mt-8 space-y-6">

        {/* Leistungsart */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-[oklch(0.16_0.02_260)]">
            Welche Leistung benötigen Sie?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-3 hover:border-[oklch(0.52_0.24_260)] focus-within:ring-1 focus-within:ring-[oklch(0.52_0.24_260)]">
              <input type="radio" name="serviceType" value="copy" defaultChecked className="accent-[oklch(0.52_0.24_260)]" />
              <span className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Schlüsselkopie</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-3 hover:border-[oklch(0.52_0.24_260)] focus-within:ring-1 focus-within:ring-[oklch(0.52_0.24_260)]">
              <input type="radio" name="serviceType" value="programming" className="accent-[oklch(0.52_0.24_260)]" />
              <span className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Programmierung</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-3 hover:border-[oklch(0.52_0.24_260)] focus-within:ring-1 focus-within:ring-[oklch(0.52_0.24_260)]">
              <input type="radio" name="serviceType" value="repair" className="accent-[oklch(0.52_0.24_260)]" />
              <span className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Reparatur</span>
            </label>
          </div>
        </div>

        {/* Schlüsselart */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-[oklch(0.16_0.02_260)]">
            Welche Art von Schlüssel haben Sie?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-3 hover:border-[oklch(0.52_0.24_260)] focus-within:ring-1 focus-within:ring-[oklch(0.52_0.24_260)]">
              <input type="radio" name="keyType" value="mechanical" defaultChecked className="accent-[oklch(0.52_0.24_260)]" />
              <span className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Mechanisch (ohne Funk)</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-3 hover:border-[oklch(0.52_0.24_260)] focus-within:ring-1 focus-within:ring-[oklch(0.52_0.24_260)]">
              <input type="radio" name="keyType" value="remote" className="accent-[oklch(0.52_0.24_260)]" />
              <span className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Funkschlüssel</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-3 hover:border-[oklch(0.52_0.24_260)] focus-within:ring-1 focus-within:ring-[oklch(0.52_0.24_260)]">
              <input type="radio" name="keyType" value="smart" className="accent-[oklch(0.52_0.24_260)]" />
              <span className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Smart Key (Keyless)</span>
            </label>
          </div>
        </div>

        {/* Fahrzeugklasse */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-[oklch(0.16_0.02_260)]">
            Fahrzeugklasse / Marke
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-3 hover:border-[oklch(0.52_0.24_260)] focus-within:ring-1 focus-within:ring-[oklch(0.52_0.24_260)]">
              <input type="radio" name="brandGroup" value="standard" defaultChecked className="accent-[oklch(0.52_0.24_260)]" />
              <span className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Standard (VW, Ford, Opel...)</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-3 hover:border-[oklch(0.52_0.24_260)] focus-within:ring-1 focus-within:ring-[oklch(0.52_0.24_260)]">
              <input type="radio" name="brandGroup" value="premium" className="accent-[oklch(0.52_0.24_260)]" />
              <span className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Premium (Audi, BMW, MB...)</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-3 hover:border-[oklch(0.52_0.24_260)] focus-within:ring-1 focus-within:ring-[oklch(0.52_0.24_260)]">
              <input type="radio" name="brandGroup" value="luxury" className="accent-[oklch(0.52_0.24_260)]" />
              <span className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Luxus / Sport (Porsche...)</span>
            </label>
          </div>
        </div>

        {/* Ergebnis */}
        <div className="flex items-baseline justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[oklch(0.52_0.24_260)]">Schätzung:</span>
            {state.tier && state.totalEstimate > 0 && (
              <span className="mt-1 text-xs font-bold uppercase tracking-widest text-[oklch(0.32_0.02_260)]">
                Tier: {state.tier}
              </span>
            )}
          </div>
          <span className="text-4xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] transition-all">
            ~ {optimisticTotal.toLocaleString('de-DE')} €
          </span>
        </div>

        {state.breakdown && state.breakdown.length > 0 && state.totalEstimate === optimisticTotal && (
          <div className="mt-4 rounded-xl bg-[oklch(0.988_0.002_260)] p-4 text-sm text-[oklch(0.32_0.02_260)] motion-reduce:transition-none">
            <p className="font-semibold mb-2">Aufschlüsselung:</p>
            <ul className="space-y-1">
              {state.breakdown.map((item, i) => (
                <li key={i} className="flex justify-between">
                  <span>{item.label}</span>
                  <span>{item.cost} €</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.46_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Wird berechnet...' : 'Genaue Kostenaufstellung (Server) anfordern'}
        </button>
      </form>
    </div>
  );
}

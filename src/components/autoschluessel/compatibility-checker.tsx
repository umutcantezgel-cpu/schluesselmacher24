'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { checkCompatibility, type CompatibilityCheckResult } from '@/actions/check-compatibility';
import type { VehicleMake, KeyKind } from '@/lib/types';

const KEY_KIND_LABELS: Record<KeyKind, string> = {
  'mechanisch': 'Mechanischer Schlüssel',
  'funk': 'Funkschlüssel',
  'klappschluessel': 'Klappschlüssel',
  'smart-key': 'Smart-Key',
  'keyless': 'Keyless-Go Schlüssel'
};

const initialState: CompatibilityCheckResult = {
  makeSlug: '',
  modelSlug: '',
  year: new Date().getFullYear(),
  compatibleKeyKinds: [],
  requiresVehicleOnSite: null,
  found: false,
};

interface Props {
  makes: VehicleMake[];
}

export function CarKeyCompatibilityChecker({ makes }: Props) {
  const [state, formAction, isPending] = useActionState(checkCompatibility, initialState);

  // Optimistic UI state for better feedback
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (currentState, optimisticUpdate: Partial<CompatibilityCheckResult>) => ({
      ...currentState,
      ...optimisticUpdate,
    })
  );

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] group hover:shadow-[0_12px_32px_-4px_oklch(0.16_0.02_260/0.08)] transition-shadow duration-500 ease-out">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Fahrzeug-Kompatibilität prüfen</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
        Wählen Sie Ihre Marke, das Modell und das Baujahr, um die unterstützten Schlüsselarten zu sehen.
      </p>

      <form action={(formData) => {
        startTransition(() => {
           setOptimisticState({
             makeSlug: formData.get('makeSlug') as string,
             modelSlug: formData.get('modelSlug') as string,
             year: parseInt(formData.get('year') as string, 10) || new Date().getFullYear()
           });
        });
        formAction(formData);
      }} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="makeSlug" className="block text-sm font-medium text-[oklch(0.32_0.02_260)]">Marke</label>
            <select
              name="makeSlug"
              id="makeSlug"
              className="mt-1 block w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] bg-white py-2 px-3 shadow-sm focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)] text-sm text-[oklch(0.16_0.02_260)]"
              defaultValue={optimisticState.makeSlug}
            >
              <option value="">Bitte wählen...</option>
              {makes.map(make => (
                <option key={make.slug} value={make.slug}>{make.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="modelSlug" className="block text-sm font-medium text-[oklch(0.32_0.02_260)]">Modell (Slug manuell)</label>
            <input
              type="text"
              name="modelSlug"
              id="modelSlug"
              placeholder="z.b. golf"
              className="mt-1 block w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] bg-white py-2 px-3 shadow-sm focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)] text-sm text-[oklch(0.16_0.02_260)]"
              defaultValue={optimisticState.modelSlug}
            />
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-[oklch(0.32_0.02_260)]">Baujahr</label>
            <input
              type="number"
              name="year"
              id="year"
              min="1980"
              max={new Date().getFullYear() + 1}
              className="mt-1 block w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] bg-white py-2 px-3 shadow-sm focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)] text-sm text-[oklch(0.16_0.02_260)]"
              defaultValue={optimisticState.year}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Prüfe...' : 'Kompatibilität prüfen'}
        </button>
      </form>

      {optimisticState.found && !isPending && (
        <div className="mt-8 border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
          <h4 className="text-sm font-semibold text-[oklch(0.16_0.02_260)]">Ergebnis für Baujahr {optimisticState.year}:</h4>
          {optimisticState.compatibleKeyKinds.length > 0 ? (
            <div className="mt-4 space-y-4">
               <div>
                  <span className="block text-xs uppercase tracking-wider text-[oklch(0.32_0.02_260)]">Mögliche Schlüssel</span>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {optimisticState.compatibleKeyKinds.map(kind => (
                      <li key={kind} className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-[oklch(0.16_0.02_260)] border border-[oklch(0.89_0.008_260/0.55)]">
                        {KEY_KIND_LABELS[kind] || kind}
                      </li>
                    ))}
                  </ul>
               </div>
               {optimisticState.requiresVehicleOnSite !== null && (
                 <div>
                    <span className="block text-xs uppercase tracking-wider text-[oklch(0.32_0.02_260)]">Fahrzeug vor Ort?</span>
                    <p className="mt-1 text-sm text-[oklch(0.16_0.02_260)] font-medium">
                      {optimisticState.requiresVehicleOnSite ? 'Ja, das Fahrzeug muss zwingend vor Ort sein.' : 'Nein, kann ohne Fahrzeug bearbeitet werden.'}
                    </p>
                 </div>
               )}
            </div>
          ) : (
            <p className="mt-4 text-sm text-[oklch(0.32_0.02_260)]">Für dieses Modell und Baujahr liegen keine spezifischen Schlüsselinformationen vor.</p>
          )}
        </div>
      )}
    </div>
  );
}

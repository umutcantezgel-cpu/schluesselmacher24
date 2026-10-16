'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateSchliessanlagenAction } from '@/actions/calculate-schliessanlagen';
import { Layers, Users, Key, Building2 } from 'lucide-react';

interface CalculationState {
  doors: number;
  users: number;
  systemType: 'gleichschliessend' | 'zentral' | 'hauptschluessel' | 'generalhauptschluessel';
  estimatedCost: number;
  securityLevel: 'standard' | 'hoch' | 'maximal';
}

const initialState: CalculationState = {
  doors: 5,
  users: 3,
  systemType: 'hauptschluessel',
  estimatedCost: 1250,
  securityLevel: 'hoch',
};



export function SchliessanlagenConfigurator() {
  const [state, formAction, isPending] = useActionState(calculateSchliessanlagenAction, initialState);

  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (currentState, optimisticValue: Partial<CalculationState>) => ({
      ...currentState,
      ...optimisticValue,
    })
  );

  function handleInputChange(name: string, value: string | number) {
     startTransition(() => {
        const nextState = { ...optimisticState, [name]: value };

        let basePrice = 0;
        if (nextState.systemType === 'gleichschliessend') basePrice = 80;
        else if (nextState.systemType === 'zentral') basePrice = 150;
        else if (nextState.systemType === 'hauptschluessel') basePrice = 200;
        else if (nextState.systemType === 'generalhauptschluessel') basePrice = 350;

        let securityMultiplier = 1;
        if(nextState.securityLevel === 'hoch') securityMultiplier = 1.3;
        if(nextState.securityLevel === 'maximal') securityMultiplier = 1.8;

        nextState.estimatedCost = Math.round((nextState.doors * basePrice * securityMultiplier) + (nextState.users * 25 * securityMultiplier));

        setOptimisticState(nextState);
     });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.52_0.24_260/0.1)] text-[oklch(0.52_0.24_260)]">
          <Key className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Interaktive Kostenschätzung</h3>
          <p className="text-sm text-[oklch(0.32_0.02_260)] mt-1">Berechnen Sie einen Richtwert für Ihre geplante Schließanlage.</p>
        </div>
      </div>

      <form action={formAction} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-[oklch(0.16_0.02_260)] flex items-center gap-2 mb-3">
                 <Building2 className="h-4 w-4" />
                 Anzahl der Türen (Schließstellen)
              </label>
              <input
                type="range"
                name="doors"
                min="1"
                max="100"
                value={optimisticState.doors}
                onChange={(e) => handleInputChange('doors', Number(e.target.value))}
                className="w-full accent-[oklch(0.52_0.24_260)]"
              />
              <div className="flex justify-between text-xs text-[oklch(0.32_0.02_260)] mt-2 font-medium">
                <span>1 Tür</span>
                <span className="text-[oklch(0.52_0.24_260)] font-bold">{optimisticState.doors} Türen</span>
                <span>100 Türen</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-[oklch(0.16_0.02_260)] flex items-center gap-2 mb-3">
                 <Users className="h-4 w-4" />
                 Anzahl der Nutzer (Schlüssel)
              </label>
              <input
                type="range"
                name="users"
                min="1"
                max="200"
                value={optimisticState.users}
                onChange={(e) => handleInputChange('users', Number(e.target.value))}
                className="w-full accent-[oklch(0.52_0.24_260)]"
              />
              <div className="flex justify-between text-xs text-[oklch(0.32_0.02_260)] mt-2 font-medium">
                <span>1 Nutzer</span>
                <span className="text-[oklch(0.52_0.24_260)] font-bold">{optimisticState.users} Nutzer</span>
                <span>200 Nutzer</span>
              </div>
            </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 pt-4 border-t border-[oklch(0.89_0.008_260/0.55)]">
            <div>
                <label className="text-sm font-semibold text-[oklch(0.16_0.02_260)] flex items-center gap-2 mb-3">
                    <Layers className="h-4 w-4" />
                    Anlagentyp
                </label>
                <select
                    name="systemType"
                    value={optimisticState.systemType}
                    onChange={(e) => handleInputChange('systemType', e.target.value)}
                    className="w-full rounded-xl border border-[oklch(0.89_0.008_260)] bg-[oklch(0.988_0.002_260)] px-4 py-2.5 text-sm text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"
                >
                    <option value="gleichschliessend">Gleichschließung</option>
                    <option value="zentral">Zentralschlossanlage</option>
                    <option value="hauptschluessel">Hauptschlüsselanlage (HS)</option>
                    <option value="generalhauptschluessel">Generalhauptschlüsselanlage (GHS)</option>
                </select>
            </div>
             <div>
                <label className="text-sm font-semibold text-[oklch(0.16_0.02_260)] flex items-center gap-2 mb-3">
                    Sicherheitsstufe
                </label>
                <div className="flex gap-3">
                    {['standard', 'hoch', 'maximal'].map((level) => (
                        <label key={level} className="flex-1 cursor-pointer">
                            <input
                                type="radio"
                                name="securityLevel"
                                value={level}
                                checked={optimisticState.securityLevel === level}
                                onChange={(e) => handleInputChange('securityLevel', e.target.value)}
                                className="sr-only"
                            />
                            <div className={`text-center rounded-xl border py-2 text-sm transition-all ${
                                optimisticState.securityLevel === level
                                ? 'border-[oklch(0.52_0.24_260)] bg-[oklch(0.52_0.24_260/0.05)] text-[oklch(0.52_0.24_260)] font-semibold'
                                : 'border-[oklch(0.89_0.008_260)] text-[oklch(0.32_0.02_260)] hover:border-[oklch(0.52_0.24_260/0.5)]'
                            }`}>
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between border-t border-[oklch(0.89_0.008_260/0.55)] pt-6 gap-6">
          <div className="w-full md:w-auto text-center md:text-left">
            <span className="block text-sm font-medium text-[oklch(0.32_0.02_260)] mb-1">Geschätzter Richtwert (netto):</span>
            <span className="text-4xl font-bold tracking-tight text-[oklch(0.16_0.02_260)] tabular-nums">
              {optimisticState.estimatedCost.toLocaleString('de-DE')} €
            </span>
            <p className="text-xs text-[oklch(0.32_0.02_260)] mt-2 max-w-[280px]">
                *Unverbindliche Schätzung. Der finale Preis hängt von Zylinderlängen, exakten Systemen und Optionen ab.
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full md:w-auto rounded-xl bg-[oklch(0.52_0.24_260)] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[200px]"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Berechne...
              </span>
            ) : 'Exaktes Angebot anfragen'}
          </button>
        </div>
      </form>
    </div>
  );
}

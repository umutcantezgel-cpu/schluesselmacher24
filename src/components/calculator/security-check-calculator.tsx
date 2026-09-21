'use client';

import { useActionState, useOptimistic } from 'react';
import { calculateDoorSecurity, type SecurityCheckResult } from '@/actions/calculate-door-security';
import { Lock, ShieldCheck, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';

const initialState: SecurityCheckResult = {
  totalEstimate: 230,
  breakdown: [
    { label: 'Wohnungseingangstür (Grundabsicherung)', value: 150 },
    { label: 'Einsteckschloss & Standard-Zylinder', value: 80 }
  ],
  tier: 'BASIC',
  message: '',
};

export function SecurityCheckCalculator() {
  const [state, formAction, isPending] = useActionState(calculateDoorSecurity, initialState);

  // Optimistic update for immediate feedback on sliders/radios if needed
  const [optimisticState] = useOptimistic(
    state,
    (currentState, optimisticValue: Partial<SecurityCheckResult>) => ({
      ...currentState,
      ...optimisticValue,
    })
  );

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] @container">
      <div className="flex items-center gap-3 border-b border-[oklch(0.89_0.008_260/0.55)] pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.52_0.24_260/0.1)] text-[oklch(0.52_0.24_260)]">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Sicherheits- & Budgetkalkulator</h3>
          <p className="text-sm text-[oklch(0.32_0.02_260)] mt-1">Ermitteln Sie die optimale Absicherung für Ihre Tür</p>
        </div>
      </div>

      <form action={formAction} className="mt-8 space-y-8">

        {/* Türart */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold tracking-tight text-[oklch(0.16_0.02_260)] mb-4">1. Art der Tür</legend>
          <div className="grid grid-cols-1 gap-3 @sm:grid-cols-3">
            {[
              { id: 'WOHNUNG', label: 'Wohnungstür' },
              { id: 'HAUSTUER', label: 'Haustür' },
              { id: 'GEWERBE', label: 'Gewerbe' },
            ].map((option) => (
              <label key={option.id} className="relative flex cursor-pointer rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-4 shadow-sm hover:border-[oklch(0.52_0.24_260/0.5)] transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none focus-within:ring-2 focus-within:ring-[oklch(0.52_0.24_260/0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.52_0.24_260)]">
                <input type="radio" name="doorType" value={option.id} defaultChecked={option.id === 'WOHNUNG'} className="sr-only peer" />
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm font-medium text-[oklch(0.32_0.02_260)] peer-checked:text-[oklch(0.52_0.24_260)]">{option.label}</span>
                  <div className="h-4 w-4 rounded-full border border-[oklch(0.89_0.008_260)] peer-checked:border-4 peer-checked:border-[oklch(0.52_0.24_260)]" />
                </div>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Schlossart */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold tracking-tight text-[oklch(0.16_0.02_260)] mb-4">2. Gewünschte Schließtechnik</legend>
          <div className="grid grid-cols-1 gap-3 @sm:grid-cols-3">
            {[
              { id: 'EINFACH', label: 'Standard' },
              { id: 'MEHRFACH', label: 'Mehrfach' },
              { id: 'ELEKTRONISCH', label: 'Smart/Elektronisch' },
            ].map((option) => (
              <label key={option.id} className="relative flex cursor-pointer rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-4 shadow-sm hover:border-[oklch(0.52_0.24_260/0.5)] transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none focus-within:ring-2 focus-within:ring-[oklch(0.52_0.24_260/0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.52_0.24_260)]">
                <input type="radio" name="lockType" value={option.id} defaultChecked={option.id === 'EINFACH'} className="sr-only peer" />
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm font-medium text-[oklch(0.32_0.02_260)] peer-checked:text-[oklch(0.52_0.24_260)]">{option.label}</span>
                  <div className="h-4 w-4 rounded-full border border-[oklch(0.89_0.008_260)] peer-checked:border-4 peer-checked:border-[oklch(0.52_0.24_260)]" />
                </div>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Dringlichkeit */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold tracking-tight text-[oklch(0.16_0.02_260)] mb-4">3. Priorität</legend>
          <div className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
             {[
              { id: 'STANDARD', label: 'Standard Vorlauf' },
              { id: 'HOCH', label: 'Express (+20%)' },
            ].map((option) => (
              <label key={option.id} className="relative flex cursor-pointer rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-4 shadow-sm hover:border-[oklch(0.52_0.24_260/0.5)] transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none focus-within:ring-2 focus-within:ring-[oklch(0.52_0.24_260/0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.52_0.24_260)]">
                <input type="radio" name="urgency" value={option.id} defaultChecked={option.id === 'STANDARD'} className="sr-only peer" />
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm font-medium text-[oklch(0.32_0.02_260)] peer-checked:text-[oklch(0.52_0.24_260)]">{option.label}</span>
                  <div className="h-4 w-4 rounded-full border border-[oklch(0.89_0.008_260)] peer-checked:border-4 peer-checked:border-[oklch(0.52_0.24_260)]" />
                </div>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Ergebnisse */}
        <div className="mt-8 rounded-xl bg-[oklch(0.988_0.002_260)] p-6 border border-[oklch(0.89_0.008_260/0.55)] shadow-inner">
          <div className="flex flex-col gap-6 @md:flex-row @md:items-end @md:justify-between">
            <div className="space-y-3 flex-1">
              <h4 className="text-sm font-semibold text-[oklch(0.16_0.02_260)] uppercase tracking-wider">Kalkulation</h4>
              <ul className="space-y-2 text-sm text-[oklch(0.32_0.02_260)]">
                {optimisticState.breakdown.map((item, idx) => (
                  <li key={idx} className="flex justify-between border-b border-[oklch(0.89_0.008_260/0.2)] pb-2 last:border-0 last:pb-0">
                    <span>{item.label}</span>
                    <span className="font-medium">{item.value.toLocaleString('de-DE')} €</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-end gap-2 border-t border-[oklch(0.89_0.008_260/0.55)] @md:border-t-0 @md:border-l @md:pl-6 pt-4 @md:pt-0 shrink-0">
              <span className="text-xs font-semibold text-[oklch(0.52_0.015_260)] uppercase tracking-wider">Richtwert ab</span>
              <span className="text-4xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                {optimisticState.totalEstimate.toLocaleString('de-DE')} €
              </span>
              <div className={clsx(
                "mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                optimisticState.tier === 'PREMIUM' && "bg-[oklch(0.52_0.24_260/0.1)] text-[oklch(0.52_0.24_260)]",
                optimisticState.tier === 'RECOMMENDED' && "bg-green-100 text-green-800",
                optimisticState.tier === 'BASIC' && "bg-gray-100 text-gray-800"
              )}>
                {optimisticState.tier === 'PREMIUM' && <ShieldCheck size={14} />}
                {optimisticState.tier === 'RECOMMENDED' && <Lock size={14} />}
                {optimisticState.tier === 'BASIC' && <ShieldAlert size={14} />}
                {optimisticState.tier === 'PREMIUM' ? 'Maximale Sicherheit' : optimisticState.tier === 'RECOMMENDED' ? 'VdS Empfehlung' : 'Grundschutz'}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-4 text-[15px] font-semibold text-white shadow-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Kalkuliere...
            </>
          ) : (
            'Berechnung aktualisieren'
          )}
        </button>
      </form>
    </div>
  );
}

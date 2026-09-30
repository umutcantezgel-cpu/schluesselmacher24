'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateProjectTriage, type TriageResult } from '@/actions/action-35';

const initialState: TriageResult = {
  estimatedDays: 2,
  complexityLevel: 'STANDARD',
  recommendation: 'Standard-Service ausreichend. Kurzfristige Umsetzung möglich.',
};

export function InteractiveModule() {
  const [state, formAction, isPending] = useActionState(calculateProjectTriage, initialState);

  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current, update: Partial<TriageResult>) => ({ ...current, ...update })
  );

  function handleScopeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);
    const form = e.currentTarget.form;
    startTransition(() => {
      // Very basic optimistic estimate update just for UI feedback
      setOptimisticState({ estimatedDays: Math.max(2, Math.ceil(value * 0.4)) });
    });
    // Request full recalculation from server
    if (form) {
        form.requestSubmit();
    }
  }

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
     const form = e.currentTarget.form;
     startTransition(() => {
         // Cannot easily calculate complex state client side without duplicating logic,
         // so we rely on the fast server action, but we trigger it immediately on change.
     });
     if (form) {
         form.requestSubmit();
     }
  }

  return (
    <div className="motion-reduce:transition-none rounded-2xl border border-[oklch(0.890_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 md:p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] hover:shadow-[0_12px_32px_-4px_oklch(0.16_0.02_260/0.08)] transition-all duration-500 ease-out relative overflow-hidden group">

      {/* Kinetic Hover Glow Effect */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-500 group-hover:opacity-100 mix-blend-overlay">
         <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.52_0.24_260/0.1)] to-transparent" />
      </div>

      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] mb-2 relative z-10">
        Triage-Kalkulator
      </h3>
      <p className="text-sm text-[oklch(0.32_0.02_260)] mb-6 relative z-10">
        Schätzen Sie Komplexität und Planungsaufwand Ihres Vorhabens vorab ein.
      </p>

      <form action={formAction} className="space-y-6 relative z-10">
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <label htmlFor="scopeDays" className="text-sm font-medium text-[oklch(0.32_0.02_260)]">
              Geschätzter Projektumfang (Tage)
            </label>
            <span className="text-xs text-[oklch(0.52_0.015_260)]">Optional</span>
          </div>
          <input
            type="range"
            id="scopeDays"
            name="scopeDays"
            min="1"
            max="30"
            defaultValue="5"
            onChange={handleScopeChange}
            className="w-full accent-[oklch(0.52_0.24_260)] cursor-pointer"
          />
          <div className="flex justify-between text-xs text-[oklch(0.52_0.015_260)] mt-1">
            <span>1 Tag</span>
            <span>30 Tage</span>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-[oklch(0.890_0.008_260/0.55)]">
           <label className="flex items-center gap-3 cursor-pointer group/cb">
             <div className="relative flex items-center justify-center">
                 <input
                     type="checkbox"
                     name="isNetworked"
                     value="true"
                     onChange={handleCheckboxChange}
                     className="peer sr-only"
                 />
                 <div className="w-5 h-5 rounded border border-[oklch(0.890_0.008_260/0.55)] bg-white peer-checked:bg-[oklch(0.52_0.24_260)] peer-checked:border-[oklch(0.52_0.24_260)] transition-colors"></div>
                 <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                 </svg>
             </div>
             <span className="text-sm text-[oklch(0.32_0.02_260)] group-hover/cb:text-[oklch(0.16_0.02_260)] transition-colors">
                 Vernetzte IT-Infrastruktur / API nötig
             </span>
           </label>

           <label className="flex items-center gap-3 cursor-pointer group/cb">
             <div className="relative flex items-center justify-center">
                 <input
                     type="checkbox"
                     name="hasCompliance"
                     value="true"
                     onChange={handleCheckboxChange}
                     className="peer sr-only"
                 />
                 <div className="w-5 h-5 rounded border border-[oklch(0.890_0.008_260/0.55)] bg-white peer-checked:bg-[oklch(0.52_0.24_260)] peer-checked:border-[oklch(0.52_0.24_260)] transition-colors"></div>
                 <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                 </svg>
             </div>
             <span className="text-sm text-[oklch(0.32_0.02_260)] group-hover/cb:text-[oklch(0.16_0.02_260)] transition-colors">
                 Zertifizierung (z.B. VdS, ISO) erforderlich
             </span>
           </label>
        </div>

        <div className="rounded-xl bg-white p-4 border border-[oklch(0.890_0.008_260/0.55)] mt-6 transition-opacity duration-300">
           <div className="flex justify-between items-center mb-2">
               <span className="text-xs font-semibold text-[oklch(0.52_0.015_260)] uppercase tracking-wider">Komplexitätsgrad</span>
               <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                   optimisticState.complexityLevel === 'KOMPLEX' ? 'bg-red-100 text-red-800' :
                   optimisticState.complexityLevel === 'ERWEITERT' ? 'bg-yellow-100 text-yellow-800' :
                   'bg-green-100 text-green-800'
               }`}>
                   {optimisticState.complexityLevel}
               </span>
           </div>

           <div className="flex justify-between items-baseline pt-2">
               <span className="text-sm text-[oklch(0.32_0.02_260)]">Mindestvorlaufzeit:</span>
               <span className="text-xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                 {optimisticState.estimatedDays} {optimisticState.estimatedDays === 1 ? 'Tag' : 'Tage'}
               </span>
           </div>
        </div>

        <div className={`text-sm text-[oklch(0.32_0.02_260)] transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
            <strong>Empfehlung:</strong> {optimisticState.recommendation}
        </div>

        {/* Hidden submit to allow standard form submission if js is disabled or for progressive enhancement fallback */}
        <button type="submit" className="sr-only">Berechnen</button>
      </form>
    </div>
  );
}

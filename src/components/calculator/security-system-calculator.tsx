'use client';

import { useActionState, useOptimistic, startTransition, useRef } from 'react';
import { calculateSecuritySystem } from '@/actions/calculate-security';
import type { SecurityCalculationResult } from '@/types/security';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

const initialState: SecurityCalculationResult = {
  totalEstimate: 0,
  breakdown: [],
  tier: 'BASIC'
};

export function SecuritySystemCalculator() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(calculateSecuritySystem, initialState);
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (currentState, optimisticUpdate: Partial<SecurityCalculationResult>) => ({
      ...currentState,
      ...optimisticUpdate,
    })
  );

  function handleOptimisticUpdate() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);

    const doors = Number(formData.get('doors') || 1);
    const windows = Number(formData.get('windows') || 0);
    const includeVideo = formData.get('includeVideo') === 'on';
    const includeAlarm = formData.get('includeAlarm') === 'on';

    let estimatedTotal = doors * 250 + windows * 150;
    if (includeAlarm) estimatedTotal += 850 + (doors + windows) * 80;
    if (includeVideo) estimatedTotal += 1200 + (doors > 2 ? 600 : 0);

    startTransition(() => {
      setOptimisticState({ totalEstimate: estimatedTotal });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 md:p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] view-transition-name-calculator">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[oklch(0.988_0.002_260)] border border-[oklch(0.89_0.008_260/0.55)] shadow-sm">
          <ShieldCheck className="h-5 w-5 text-[oklch(0.52_0.24_260)]" />
        </div>
        <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Interaktiver Sicherheits-Kalkulator</h3>
      </div>

      <p className="text-sm text-[oklch(0.32_0.02_260)] mb-8 leading-relaxed">
        Erhalten Sie in Echtzeit eine erste, unverbindliche Kostenschätzung für die Absicherung Ihres Objekts. Basierend auf Ihren Angaben berechnen wir einen realistischen Richtwert für Mechanik und Elektronik.
      </p>

      <form ref={formRef} action={formAction} onChange={handleOptimisticUpdate} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <label htmlFor="doors" className="block text-sm font-semibold text-[oklch(0.16_0.02_260)]">
              Anzahl zu sichernder Außentüren
            </label>
            <div className="flex items-center gap-4">
              <input
                id="doors"
                type="range"
                name="doors"
                min="1"
                max="10"
                defaultValue="1"
                className="w-full accent-[oklch(0.52_0.24_260)] cursor-pointer"
              />
              <span className="w-12 text-center text-sm font-medium text-[oklch(0.32_0.02_260)] bg-[oklch(0.988_0.002_260)] py-1 rounded-md border border-[oklch(0.89_0.008_260/0.55)]">
                {optimisticState.totalEstimate > 0 ? (document.getElementById("doors") as HTMLInputElement)?.value : 1}
              </span>
            </div>
            <p className="text-[12px] text-[oklch(0.52_0.015_260)]">Inkl. Haus-, Neben- und Kellereingänge</p>
          </div>

          <div className="space-y-3">
            <label htmlFor="windows" className="block text-sm font-semibold text-[oklch(0.16_0.02_260)]">
              Gefährdete Fenster (Erdgeschoss/Balkon)
            </label>
            <div className="flex items-center gap-4">
              <input
                id="windows"
                type="range"
                name="windows"
                min="0"
                max="20"
                defaultValue="0"
                className="w-full accent-[oklch(0.52_0.24_260)] cursor-pointer"
              />
              <span className="w-12 text-center text-sm font-medium text-[oklch(0.32_0.02_260)] bg-[oklch(0.988_0.002_260)] py-1 rounded-md border border-[oklch(0.89_0.008_260/0.55)]">
                {optimisticState.totalEstimate > 0 ? (document.getElementById("windows") as HTMLInputElement)?.value : 0}
              </span>
            </div>
            <p className="text-[12px] text-[oklch(0.52_0.015_260)]">Mechanische Zusatzsicherungen</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 pt-4 border-t border-[oklch(0.89_0.008_260/0.55)]">
          <label className="relative flex cursor-pointer rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-4 shadow-sm hover:border-[oklch(0.52_0.24_260/0.5)] transition-colors focus-within:ring-2 focus-within:ring-[oklch(0.52_0.24_260)] focus-within:ring-offset-2">
            <div className="flex flex-1 items-center justify-between">
              <div className="flex flex-col">
                <span className="block text-sm font-semibold text-[oklch(0.16_0.02_260)]">Alarmtechnik ergänzen</span>
                <span className="mt-1 flex items-center text-[13px] text-[oklch(0.52_0.015_260)]">Professionelle Gefahrenwarnanlage</span>
              </div>
              <input type="checkbox" name="includeAlarm" className="h-5 w-5 rounded border-gray-300 text-[oklch(0.52_0.24_260)] focus:ring-[oklch(0.52_0.24_260)]" />
            </div>
          </label>

          <label className="relative flex cursor-pointer rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-4 shadow-sm hover:border-[oklch(0.52_0.24_260/0.5)] transition-colors focus-within:ring-2 focus-within:ring-[oklch(0.52_0.24_260)] focus-within:ring-offset-2">
            <div className="flex flex-1 items-center justify-between">
              <div className="flex flex-col">
                <span className="block text-sm font-semibold text-[oklch(0.16_0.02_260)]">Videoüberwachung</span>
                <span className="mt-1 flex items-center text-[13px] text-[oklch(0.52_0.015_260)]">Kamerasystem inkl. Aufzeichnung</span>
              </div>
              <input type="checkbox" name="includeVideo" className="h-5 w-5 rounded border-gray-300 text-[oklch(0.52_0.24_260)] focus:ring-[oklch(0.52_0.24_260)]" />
            </div>
          </label>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-t border-[oklch(0.89_0.008_260/0.55)] pt-6 mt-8">
          <div>
            <span className="block text-sm font-medium text-[oklch(0.52_0.015_260)] mb-1">Geschätzter Investitionsrahmen (Netto):</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                {optimisticState.totalEstimate > 0 ? `~ ${optimisticState.totalEstimate.toLocaleString('de-DE')} €` : '0 €'}
              </span>
            </div>
          </div>
          <button
            type="submit"
            disabled={isPending || optimisticState.totalEstimate === 0}
            className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-[oklch(0.52_0.24_260)] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.46_0.24_260)] active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Berechne Details...</span>
              </>
            ) : (
              <>
                <span>Detaillierte Aufstellung anfordern</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>

        {state.breakdown.length > 0 && !isPending && (
          <div className="mt-8 rounded-xl bg-[oklch(0.988_0.002_260)] border border-[oklch(0.89_0.008_260/0.55)] p-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h4 className="text-sm font-semibold text-[oklch(0.16_0.02_260)] mb-4 pb-2 border-b border-[oklch(0.89_0.008_260/0.55)]">Kalkulationsdetails</h4>
            <ul className="space-y-3">
              {state.breakdown.map((item, idx) => (
                <li key={idx} className="flex justify-between text-sm">
                  <span className="text-[oklch(0.32_0.02_260)]">{item.item}</span>
                  <span className="font-medium text-[oklch(0.16_0.02_260)]">{item.cost.toLocaleString('de-DE')} €</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-4 border-t border-[oklch(0.89_0.008_260/0.55)] flex justify-between items-center">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[oklch(0.968_0.004_260)] border border-[oklch(0.89_0.008_260/0.55)] text-[oklch(0.52_0.015_260)]">
                Kategorie: {state.tier}
              </span>
              <p className="text-[11px] text-[oklch(0.52_0.015_260)] text-right">
                *Dies ist eine unverbindliche Kostenschätzung. Ein exaktes Angebot erfordert eine Vor-Ort-Besichtigung.
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

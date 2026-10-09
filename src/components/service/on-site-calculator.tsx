'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateOnSite } from '@/actions/calculate-on-site';
import type { OnSiteCalculationResult } from '@/types/on-site';
import { Calculator } from 'lucide-react';

const initialState: OnSiteCalculationResult = {
  estimatedTimeMinutes: 0,
  estimatedCostTotal: 0,
  breakdown: [],
};

export function OnSiteCalculator() {
  const [state, formAction, isPending] = useActionState(calculateOnSite, initialState);
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current, update: Partial<OnSiteCalculationResult>) => ({ ...current, ...update })
  );

  function handleQuickEstimate(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    const form = e.target.form;
    if (!form) return;

    const serviceType = (form.elements.namedItem('serviceType') as HTMLSelectElement).value;
    const objectSize = Number((form.elements.namedItem('objectSize') as HTMLInputElement).value);

    let quickTime = 0;
    let quickCost = 0;

    if (serviceType === 'AUTOSCHLUESSEL') { quickTime = 45; quickCost = 89; }
    else if (serviceType === 'ZYLINDERTAUSCH') { quickTime = 30 + objectSize * 15; quickCost = 120 + objectSize * 125; }
    else if (serviceType === 'SCHLIESSANLAGE') { quickTime = 120 + objectSize * 25; quickCost = 250 + objectSize * 215; }
    else if (serviceType === 'ZUTRITTSLOESUNG') { quickTime = 180 + objectSize * 45; quickCost = 350 + objectSize * 520; }
    else if (serviceType === 'SICHERHEITSTECHNIK') { quickTime = 240 + objectSize * 60; quickCost = 450 + objectSize * 400; }

    startTransition(() => {
      setOptimisticState({
        estimatedTimeMinutes: quickTime,
        estimatedCostTotal: quickCost
      });
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-6 md:p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] group transition-all duration-300 hover:shadow-[0_12px_32px_-4px_oklch(0.16_0.02_260/0.08)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[oklch(0.988_0.002_260)] shadow-sm border border-[oklch(0.89_0.008_260/0.55)] group-hover:scale-105 transition-transform duration-300">
          <Calculator className="h-5 w-5 text-[oklch(0.52_0.24_260)]" />
        </div>
        <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Einsatz-Kalkulator</h3>
      </div>

      <p className="text-[14px] text-[oklch(0.32_0.02_260)] leading-relaxed mb-6">
        Nutzen Sie unseren Kalkulator für eine sofortige, unverbindliche Ersteinschätzung von Zeitaufwand und Kosten für Ihren Vor-Ort-Termin.
      </p>

      <form action={formAction} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-[13px] font-bold uppercase tracking-wider text-[oklch(0.32_0.02_260)] block mb-2">Service-Kategorie</label>
            <select
              name="serviceType"
              onChange={handleQuickEstimate}
              className="w-full rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] px-4 py-3 text-[15px] text-[oklch(0.16_0.02_260)] focus:border-[oklch(0.52_0.24_260)] focus:ring-1 focus:ring-[oklch(0.52_0.24_260)] outline-none transition-all"
            >
              <option value="">Bitte wählen...</option>
              <option value="AUTOSCHLUESSEL">Autoschlüssel anlernen</option>
              <option value="ZYLINDERTAUSCH">Zylinder & Schlösser tauschen</option>
              <option value="SCHLIESSANLAGE">Schließanlage montieren</option>
              <option value="ZUTRITTSLOESUNG">Elektronik & Zutritt</option>
              <option value="SICHERHEITSTECHNIK">Sicherheitstechnik (Alarm/Kamera)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[13px] font-bold uppercase tracking-wider text-[oklch(0.32_0.02_260)]">Größenordnung (Türen/Zylinder/Melder)</label>
              <span className="text-[13px] text-[oklch(0.52_0.24_260)] font-semibold">1-50</span>
            </div>
            <input
              type="range"
              name="objectSize"
              min="1"
              max="50"
              defaultValue="5"
              onChange={handleQuickEstimate}
              className="w-full accent-[oklch(0.52_0.24_260)]"
            />
          </div>
        </div>

        <div className="rounded-xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-5 mt-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.52_0.24_260/0.03)] to-transparent pointer-events-none" />
          <div className="relative">
            <div className="grid grid-cols-2 gap-4 divide-x divide-[oklch(0.89_0.008_260/0.55)]">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[oklch(0.32_0.02_260)] mb-1">Dauer (ca.)</p>
                <div className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                  {optimisticState.estimatedTimeMinutes > 0 ? (
                    optimisticState.estimatedTimeMinutes > 120
                      ? `${Math.round(optimisticState.estimatedTimeMinutes / 60 * 10) / 10} h`
                      : `${optimisticState.estimatedTimeMinutes} min`
                  ) : '-'}
                </div>
              </div>
              <div className="pl-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[oklch(0.32_0.02_260)] mb-1">Kosten ab</p>
                <div className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                  {optimisticState.estimatedCostTotal > 0 ? `${optimisticState.estimatedCostTotal.toLocaleString('de-DE')} €` : '-'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {state.breakdown && state.breakdown.length > 0 && (
          <div className="text-[13px] text-[oklch(0.32_0.02_260)] space-y-2 pt-2 animate-in fade-in slide-in-from-top-2">
            <p className="font-semibold text-[oklch(0.16_0.02_260)]">Grobe Zusammensetzung:</p>
            <ul className="space-y-1">
              {state.breakdown.map((item, i) => (
                <li key={i} className="flex justify-between border-b border-[oklch(0.89_0.008_260/0.55)] border-dashed pb-1">
                  <span>{item.label}</span>
                  <span className="font-medium">{item.value.toLocaleString('de-DE')} €</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.46_0.24_260)] hover:shadow-md active:scale-[0.99] disabled:opacity-50 disabled:active:scale-100"
        >
          {isPending ? 'Kalkuliere exakte Richtwerte...' : 'Detaillierte Aufschlüsselung berechnen'}
        </button>
        <p className="text-center text-[11px] text-[oklch(0.32_0.02_260)] mt-3">
          Alle Angaben sind unverbindliche Richtwerte inkl. MwSt. Ein verbindliches Angebot erfordert eine Vor-Ort-Besichtigung oder exakte Planung.
        </p>
      </form>
    </div>
  );
}

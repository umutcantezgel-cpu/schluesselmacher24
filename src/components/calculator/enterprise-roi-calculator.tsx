'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { calculateEnterpriseROI } from '@/lib/actions/calculate-roi';
import type { EnterpriseROICalculationResult } from '@/lib/actions/calculate-roi';
import { Settings, Clock, TrendingUp, PiggyBank } from 'lucide-react';

const initialState: EnterpriseROICalculationResult = {
  roiPercent: 125,
  paybackMonths: 14,
  annualSavings: 9450,
  timeSavedHours: 195,
  totalInvestment: 26250,
};

export function EnterpriseROICalculator() {
  const [state, formAction, isPending] = useActionState(calculateEnterpriseROI, initialState);

  // Create an optimistic state for a highly responsive UI
  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (currentState, optimisticValue: Partial<EnterpriseROICalculationResult>) => ({
      ...currentState,
      ...optimisticValue,
    })
  );

  function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const form = e.target.form;
    if (!form) return;

    // Quick, rough estimation for optimistic update on the client
    const doors = Number(form.doors.value);
    const users = Number(form.users.value);
    const turnover = Number(form.turnoverPercent.value);

    const estInvestment = (doors * 450) + (users * 15) + 2500;
    const estSavings = (Math.ceil(users * (turnover/100) * 0.5) * 1500) + (users * 1.3 * 45);
    const payback = estSavings > 0 ? (estInvestment / estSavings) * 12 : 999;

    startTransition(() => {
      setOptimisticState({
        totalInvestment: estInvestment,
        annualSavings: estSavings,
        paybackMonths: payback,
        roiPercent: estSavings > 0 ? (estSavings / estInvestment) * 100 : 0,
        timeSavedHours: users * 1.3
      });
    });
  }

  return (
    <div className="rounded-3xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 md:p-10 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] view-transition-enterprise-roi">
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-[oklch(0.16_0.02_260)] tracking-tight">Enterprise ROI- & Effizienz-Kalkulator</h3>
        <p className="mt-2 text-[oklch(0.32_0.02_260)] leading-relaxed">
          Berechnen Sie das konkrete Einsparpotenzial eines Wechsels auf eine elektronische oder hybride Schließanlage für Ihr Unternehmen.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <form action={formAction} className="space-y-8 flex flex-col justify-between" id="roi-form">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label htmlFor="doors" className="text-[14px] font-semibold text-[oklch(0.16_0.02_260)]">
                  Anzahl der Türen (Schließstellen)
                </label>
                <span className="text-[14px] font-bold text-[oklch(0.52_0.24_260)]" id="doors-output">50</span>
              </div>
              <input
                type="range"
                id="doors"
                name="doors"
                min="10"
                max="500"
                defaultValue="50"
                step="10"
                onChange={(e) => {
                  document.getElementById('doors-output')!.innerText = e.target.value;
                  handleSliderChange(e);
                }}
                className="w-full h-2 rounded-full appearance-none bg-[oklch(0.89_0.008_260)] accent-[oklch(0.52_0.24_260)] cursor-pointer"
              />
              <p className="mt-1.5 text-[12px] text-[oklch(0.52_0.015_260)]">Inkl. Außentüren, Büros, Lager, Serverräume</p>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label htmlFor="users" className="text-[14px] font-semibold text-[oklch(0.16_0.02_260)]">
                  Anzahl der Nutzer (Mitarbeiter)
                </label>
                <span className="text-[14px] font-bold text-[oklch(0.52_0.24_260)]" id="users-output">150</span>
              </div>
              <input
                type="range"
                id="users"
                name="users"
                min="20"
                max="2000"
                defaultValue="150"
                step="10"
                onChange={(e) => {
                  document.getElementById('users-output')!.innerText = e.target.value;
                  handleSliderChange(e);
                }}
                className="w-full h-2 rounded-full appearance-none bg-[oklch(0.89_0.008_260)] accent-[oklch(0.52_0.24_260)] cursor-pointer"
              />
              <p className="mt-1.5 text-[12px] text-[oklch(0.52_0.015_260)]">Alle Personen, die einen Schlüssel oder Transponder benötigen</p>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label htmlFor="turnoverPercent" className="text-[14px] font-semibold text-[oklch(0.16_0.02_260)]">
                  Jährliche Fluktuation (%)
                </label>
                <span className="text-[14px] font-bold text-[oklch(0.52_0.24_260)]" id="turnover-output">10%</span>
              </div>
              <input
                type="range"
                id="turnoverPercent"
                name="turnoverPercent"
                min="0"
                max="50"
                defaultValue="10"
                step="1"
                onChange={(e) => {
                  document.getElementById('turnover-output')!.innerText = e.target.value + '%';
                  handleSliderChange(e);
                }}
                className="w-full h-2 rounded-full appearance-none bg-[oklch(0.89_0.008_260)] accent-[oklch(0.52_0.24_260)] cursor-pointer"
              />
              <p className="mt-1.5 text-[12px] text-[oklch(0.52_0.015_260)]">Wirkt sich direkt auf das Risiko von Schlüsselverlusten aus</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3.5 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50 flex justify-center items-center gap-2 mt-auto"
          >
            {isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Präzise berechnen...
              </>
            ) : 'Präzise Berechnung anfordern'}
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 grid-rows-[subgrid] gap-4">
          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm transition-all hover:border-[oklch(0.80_0.01_260)] flex flex-col">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.96_0.02_260)] text-[oklch(0.52_0.24_260)] mb-4">
              <PiggyBank size={24} strokeWidth={2} />
            </div>
            <p className="text-[13px] font-medium text-[oklch(0.52_0.015_260)] uppercase tracking-wider">Ersparnis pro Jahr</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {Math.round(optimisticState.annualSavings).toLocaleString('de-DE')} €
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-[oklch(0.4_0.02_260)] mt-auto pt-4">
              Durch Vermeidung von Zylindertausch bei Schlüsselverlust & reduzierten Verwaltungsaufwand.
            </p>
          </div>

          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm transition-all hover:border-[oklch(0.80_0.01_260)] flex flex-col">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.96_0.02_260)] text-[oklch(0.52_0.24_260)] mb-4">
              <Clock size={24} strokeWidth={2} />
            </div>
            <p className="text-[13px] font-medium text-[oklch(0.52_0.015_260)] uppercase tracking-wider">Zeitersparnis Admin</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {Math.round(optimisticState.timeSavedHours)} Std.
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-[oklch(0.4_0.02_260)] mt-auto pt-4">
              Freigesetzte Arbeitszeit pro Jahr durch zentrale Software-Verwaltung statt physischer Schlüsselausgabe.
            </p>
          </div>

          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-6 shadow-sm transition-all hover:border-[oklch(0.80_0.01_260)] flex flex-col">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.96_0.02_260)] text-[oklch(0.52_0.24_260)] mb-4">
              <TrendingUp size={24} strokeWidth={2} />
            </div>
            <p className="text-[13px] font-medium text-[oklch(0.52_0.015_260)] uppercase tracking-wider">ROI-Quote</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
              {Math.round(optimisticState.roiPercent)} %
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-[oklch(0.4_0.02_260)] mt-auto pt-4">
              Return on Investment im ersten Jahr. Je höher Fluktuation und Nutzerzahl, desto schneller rechnet sich das System.
            </p>
          </div>

          <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.52_0.24_260)] p-6 shadow-md transition-all hover:bg-[oklch(0.48_0.24_260)] flex flex-col text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 mb-4">
              <Settings size={24} strokeWidth={2} />
            </div>
            <p className="text-[13px] font-medium text-white/80 uppercase tracking-wider">Amortisationszeit</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white">
              {Math.ceil(optimisticState.paybackMonths)} Mon.
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-white/90 mt-auto pt-4">
              Ab diesem Zeitpunkt generiert das neue elektronische System monatliche Einsparungen gegenüber Mechanik.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
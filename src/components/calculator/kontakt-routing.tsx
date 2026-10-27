
'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import type { RouteSuggestion } from '@/actions/kontakt-routing';

const initialState: RouteSuggestion = {
  suggestedPath: null,
  reasoning: null,
  urgencyLevel: 'NORMAL'
};

export function KontaktRoutingAgent() {
  const [state, formAction] = useActionState(async (prevState: RouteSuggestion, formData: FormData) => {
     const intent = formData.get('intent') as string;

     if (intent === 'notfall') {
       return { suggestedPath: 'tel', reasoning: 'Bei akuten Notfällen ist der telefonische Kontakt der schnellste Weg.', urgencyLevel: 'CRITICAL' } as RouteSuggestion;
     } else if (intent === 'auto') {
       return { suggestedPath: '/autoschluessel/anfrage', reasoning: 'Für Autoschlüssel haben wir einen spezialisierten Ablauf.', urgencyLevel: 'NORMAL' } as RouteSuggestion;
     } else if (intent === 'schliessanlage') {
       return { suggestedPath: '/schliessanlagen/konfigurator', reasoning: 'Nutzen Sie unseren Konfigurator für eine präzise Planung.', urgencyLevel: 'NORMAL' } as RouteSuggestion;
     } else {
       return { suggestedPath: '/service-und-termin/anfrage', reasoning: 'Unsere allgemeine Service-Anfrage ist der beste Weg.', urgencyLevel: 'NORMAL' } as RouteSuggestion;
     }
  }, initialState);

  const [optimisticState, setOptimisticState] = useOptimistic(
    state,
    (current: RouteSuggestion, update: RouteSuggestion) => update
  );

  function handleIntentChange(intent: string) {
    startTransition(() => {
      if (intent === 'notfall') {
        setOptimisticState({ suggestedPath: 'tel', reasoning: 'Bei akuten Notfällen ist der telefonische Kontakt der schnellste Weg.', urgencyLevel: 'CRITICAL' });
      } else if (intent === 'auto') {
        setOptimisticState({ suggestedPath: '/autoschluessel/anfrage', reasoning: 'Für Autoschlüssel haben wir einen spezialisierten Ablauf.', urgencyLevel: 'NORMAL' });
      } else if (intent === 'schliessanlage') {
        setOptimisticState({ suggestedPath: '/schliessanlagen/konfigurator', reasoning: 'Nutzen Sie unseren Konfigurator für eine präzise Planung.', urgencyLevel: 'NORMAL' });
      } else {
        setOptimisticState({ suggestedPath: '/service-und-termin/anfrage', reasoning: 'Unsere allgemeine Service-Anfrage ist der beste Weg.', urgencyLevel: 'NORMAL' });
      }
    });
  }

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)]">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Interaktiver Kontakt-Assistent</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">Wählen Sie Ihr Anliegen, um den schnellsten Weg zu finden:</p>

      <form action={formAction} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-4 hover:border-[oklch(0.52_0.24_260)] transition-colors">
             <input type="radio" name="intent" value="notfall" onChange={() => handleIntentChange('notfall')} className="accent-[oklch(0.52_0.24_260)]" />
             <span className="text-sm font-medium text-[oklch(0.16_0.02_260)]">Akuter Notfall / Türöffnung</span>
           </label>
           <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-4 hover:border-[oklch(0.52_0.24_260)] transition-colors">
             <input type="radio" name="intent" value="auto" onChange={() => handleIntentChange('auto')} className="accent-[oklch(0.52_0.24_260)]" />
             <span className="text-sm font-medium text-[oklch(0.16_0.02_260)]">Autoschlüssel</span>
           </label>
           <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-4 hover:border-[oklch(0.52_0.24_260)] transition-colors">
             <input type="radio" name="intent" value="schliessanlage" onChange={() => handleIntentChange('schliessanlage')} className="accent-[oklch(0.52_0.24_260)]" />
             <span className="text-sm font-medium text-[oklch(0.16_0.02_260)]">Schließanlage planen</span>
           </label>
           <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[oklch(0.89_0.008_260/0.55)] p-4 hover:border-[oklch(0.52_0.24_260)] transition-colors">
             <input type="radio" name="intent" value="allgemein" defaultChecked onChange={() => handleIntentChange('allgemein')} className="accent-[oklch(0.52_0.24_260)]" />
             <span className="text-sm font-medium text-[oklch(0.16_0.02_260)]">Allgemeine Anfrage</span>
           </label>
        </div>

        {optimisticState.suggestedPath && (
           <div className={`mt-6 rounded-xl p-4 border ${optimisticState.urgencyLevel === 'CRITICAL' ? 'border-red-200 bg-red-50 text-red-900' : 'border-[oklch(0.89_0.008_260/0.55)] bg-white text-[oklch(0.32_0.02_260)]'}`}>
              <p className="text-sm font-medium">{optimisticState.reasoning}</p>
              <div className="mt-3">
                 {optimisticState.suggestedPath === 'tel' ? (
                   <span className="inline-block rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white">Bitte rufen Sie uns direkt an</span>
                 ) : (
                   <a href={optimisticState.suggestedPath} className="inline-block rounded-xl bg-[oklch(0.52_0.24_260)] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[oklch(0.48_0.24_260)]">
                     Zum empfohlenen Ablauf
                   </a>
                 )}
              </div>
           </div>
        )}
      </form>
    </div>
  );
}

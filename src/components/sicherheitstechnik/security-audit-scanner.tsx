'use client';
import { useActionState } from 'react';

// Wir verwenden Dummy-Typen und eine einfache Fake-Aktion für das Modul

export type SecurityAuditResult = {
  score: number;
  level: string;
  recommendations: string[];
};

const initialState: SecurityAuditResult = {
  score: 0,
  level: 'Unbekannt',
  recommendations: []
};

// Fake Server Action
async function calculateSecurityScore(prevState: SecurityAuditResult, formData: FormData): Promise<SecurityAuditResult> {
  // Simuliere Server-Latenz
  await new Promise(r => setTimeout(r, 1000));

  const type = formData.get('buildingType') as string;
  const locks = parseInt(formData.get('lockAge') as string || '0', 10);
  const alarm = formData.get('hasAlarm') === 'yes';

  let score = 50;
  if (type === 'commercial') score += 10;
  if (locks < 5) score += 20;
  if (alarm) score += 20;

  const level = score > 80 ? 'Hoch' : score > 50 ? 'Mittel' : 'Niedrig';
  const recommendations = [];
  if (locks >= 5) recommendations.push('Mechanische Schließzylinder erneuern (älter als 5 Jahre).');
  if (!alarm) recommendations.push('Integration einer Alarmanlage evaluieren.');

  return { score, level, recommendations };
}

export function SecurityAuditScanner() {
  const [state, formAction, isPending] = useActionState(calculateSecurityScore, initialState);

  return (
    <div className="rounded-2xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.968_0.004_260)] p-8 shadow-[0_8px_24px_-4px_oklch(0.16_0.02_260/0.04)] my-8">
      <h3 className="text-xl font-semibold text-[oklch(0.16_0.02_260)]">Interaktiver Sicherheits-Scanner</h3>
      <p className="mt-2 text-sm text-[oklch(0.32_0.02_260)]">
        Analysieren Sie Ihr Objekt auf mögliche Sicherheitslücken und erhalten Sie erste Empfehlungen.
      </p>

      <form action={formAction} className="mt-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Objekttyp</label>
          <select name="buildingType" className="mt-1 block w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] bg-white px-3 py-2 text-sm focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]">
            <option value="residential">Privathaushalt</option>
            <option value="commercial">Gewerbeobjekt</option>
          </select>
        </div>

        <div>
           <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Alter der Schließanlage (Jahre)</label>
           <input type="number" name="lockAge" defaultValue="10" className="mt-1 block w-full rounded-md border border-[oklch(0.89_0.008_260/0.55)] bg-white px-3 py-2 text-sm focus:border-[oklch(0.52_0.24_260)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.52_0.24_260)]"/>
        </div>

        <div>
          <label className="text-sm font-medium text-[oklch(0.32_0.02_260)]">Alarmanlage vorhanden?</label>
          <div className="mt-2 space-x-4">
             <label className="inline-flex items-center">
               <input type="radio" name="hasAlarm" value="yes" className="accent-[oklch(0.52_0.24_260)]" />
               <span className="ml-2 text-sm text-[oklch(0.32_0.02_260)]">Ja</span>
             </label>
             <label className="inline-flex items-center">
               <input type="radio" name="hasAlarm" value="no" defaultChecked className="accent-[oklch(0.52_0.24_260)]" />
               <span className="ml-2 text-sm text-[oklch(0.32_0.02_260)]">Nein</span>
             </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-[oklch(0.52_0.24_260)] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[oklch(0.48_0.24_260)] active:scale-[0.99] disabled:opacity-50"
        >
          {isPending ? 'Scanne...' : 'Sicherheitslevel ermitteln'}
        </button>
      </form>

      {state.score > 0 && (
         <div className="mt-8 border-t border-[oklch(0.89_0.008_260/0.55)] pt-6">
           <div className="flex items-baseline justify-between">
               <span className="text-sm text-[oklch(0.52_0.015_260)]">Errechnetes Sicherheitslevel:</span>
               <span className="text-2xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">
                 {state.level} ({state.score}/100)
               </span>
           </div>
           {state.recommendations.length > 0 && (
             <div className="mt-4">
               <span className="text-sm font-semibold text-[oklch(0.32_0.02_260)]">Empfehlungen:</span>
               <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-[oklch(0.32_0.02_260)]">
                 {state.recommendations.map((rec, i) => (
                   <li key={i}>{rec}</li>
                 ))}
               </ul>
             </div>
           )}
         </div>
      )}
    </div>
  );
}

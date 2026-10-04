'use client';

import { useActionState, useOptimistic, startTransition } from 'react';
import { loadFeatures, type FeatureData } from '@/lib/actions/load-features';
import { ArrowRight, Wrench, ShieldCheck, CalendarClock, ScanLine, KeyRound } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Wrench,
  ShieldCheck,
  CalendarClock,
  ScanLine,
  KeyRound,
};

const initialState: FeatureData[] = [
  { id: '1', title: 'Präzisionsfertigung', description: 'Modernste CNC-Fräsen für exakte Schlüsselkopien nach Herstellervorgaben.', icon: 'Wrench' },
  { id: '2', title: 'Sichere Codierung', description: 'Programmierung von Transpondern und Fernbedienungen für 95% aller Fahrzeugmarken.', icon: 'ShieldCheck' },
  { id: '3', title: 'Schneller Service', description: 'Viele Schlüsselmodelle sind sofort auf Lager und können umgehend angefertigt werden.', icon: 'CalendarClock' },
  { id: '4', title: 'Transparenz', description: 'Vorherige Prüfung und feste Preisrahmen vor Auftragserteilung. Keine Überraschungen.', icon: 'ScanLine' },
];

export function FeatureGrid() {
  const [state, formAction, isPending] = useActionState(async (currentState: FeatureData[], formData: FormData) => {
    const category = formData.get('category') as string;
    return await loadFeatures(category);
  }, initialState);

  const [optimisticFeatures] = useOptimistic(
    state,
    (current, update: FeatureData[]) => update
  );

  function handleCategoryChange() {
    startTransition(() => {
      // Basic optimistic update: just keep current and show loading state via isPending
    });
  }

  return (
    <div className="w-full rounded-3xl border border-[oklch(0.89_0.008_260/0.55)] bg-[oklch(0.988_0.002_260)] p-8 md:p-12 shadow-[0_8px_32px_-8px_oklch(0.16_0.02_260/0.06)] relative overflow-hidden group/bento">
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.968_0.004_260)] to-transparent opacity-0 transition-opacity duration-700 group-hover/bento:opacity-100 mix-blend-overlay pointer-events-none" />
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-[oklch(0.16_0.02_260)]">Unsere Expertise</h3>
          <p className="mt-3 text-[15px] md:text-base leading-relaxed text-[oklch(0.32_0.02_260)] max-w-2xl">
            Technologische Präzision trifft auf handwerkliches Know-how. Wir investieren kontinuierlich in modernste Codierungs- und Frästechnik.
          </p>
        </div>
        <form action={formAction} className="flex gap-3">
          <button
            type="submit"
            name="category"
            value="basic"
            onClick={() => handleCategoryChange()}
            disabled={isPending}
            className="rounded-full px-5 py-2.5 text-sm font-medium border border-[oklch(0.89_0.008_260/0.55)] bg-white text-[oklch(0.32_0.02_260)] hover:bg-[oklch(0.968_0.004_260)] transition-all disabled:opacity-50"
          >
            Kernleistungen
          </button>
          <button
            type="submit"
            name="category"
            value="advanced"
            onClick={() => handleCategoryChange()}
            disabled={isPending}
            className="rounded-full px-5 py-2.5 text-sm font-medium bg-[oklch(0.52_0.24_260)] text-white hover:bg-[oklch(0.46_0.24_260)] transition-all disabled:opacity-50 shadow-sm"
          >
            {isPending ? 'Lade...' : 'Alle Features'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {optimisticFeatures.map((feature) => {
          const Icon = iconMap[feature.icon] || KeyRound;
          return (
            <div
              key={feature.id}
              className="group flex flex-col rounded-2xl border border-[oklch(0.89_0.008_260/0.3)] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_-8px_oklch(0.16_0.02_260/0.08)] hover:border-[oklch(0.52_0.24_260/0.4)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <ArrowRight size={16} className="text-[oklch(0.52_0.24_260)] -rotate-45" />
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.968_0.004_260)] text-[oklch(0.52_0.24_260)] transition-colors duration-300 group-hover:bg-[oklch(0.52_0.24_260)] group-hover:text-white mb-6">
                <Icon size={24} strokeWidth={1.5} />
              </div>
              <h4 className="text-[17px] font-bold text-[oklch(0.16_0.02_260)]">{feature.title}</h4>
              <p className="mt-3 text-[14px] leading-relaxed text-[oklch(0.32_0.02_260)] flex-1">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

# Red-Team Audit Report (JC-PHILOSOPHER-REDTEAM-v1)

## 1. Silent Logic Death & Interaktions-Fallen
- **Formulare ohne State:** Die Formulare unter `src/components/forms/` sowie der Service-Budget-Rechner (`src/components/calculator/service-budget-calculator.tsx`) verlassen sich noch auf traditionelle `useState`-Verkettungen, statt die neuen Next.js 16 Server Actions (z.B. `useActionState`, `useOptimistic`) vollständig zu adaptieren. Dies führt potenziell zu UI-Freezes bei langsamen Netzwerken ("Silent Logic Death").
- **Tote Links & Button-Zustände:** Einige Buttons im `src/components/layout/mobile-action-bar.tsx` deuten Aktionen an, reagieren aber nicht durchgehend mit mikro-haptischem Feedback (z.B. Lade-Spinner oder skalierenden Schatten bei Klick).

## 2. Hydration Mismatches & SSR-Konflikte
- **Datums- und ID-Generierung:** Es besteht ein Risiko für Hydration-Fehler, wenn clientseitige Skripte (wie in den Rechner-Komponenten) dynamische DOM-Elemente generieren, bevor die Hydratisierung durch React 19.2+ abgeschlossen ist.
- **Client-Komponenten Boundaries:** Komponenten wie `src/components/ui/accordion.tsx` nutzen State, müssen aber strikt darauf geprüft werden, ob sie unnötigerweise auf Server-Seiten eingebunden sind, was die initialen Ladezeiten verzögert.

## 3. TypeScript & Data Structure (Typescript 5.5+)
- **JSON-LD Schema.org:** Die Implementierung in `src/components/seo/json-ld.tsx` nutzt zwar `satisfies Graph`, jedoch muss streng überwacht werden, ob Enums vermieden werden. Typescript 5.5+ schreibt die Nutzung von `as const` und Template-Literal-Typen vor.
- **Any / Unknown Casts:** In tiefen Formular-Hierarchien müssen explizite Type-Guards anstelle von `as HTMLInputElement` Casts eingesetzt werden, um maskierte Typfehler zu eliminieren.
- **Promise-Params:** In Routen wie `src/app/schluessel-nach-code/[slug]/page.tsx` müssen `params` zwingend als Promises behandelt und via `await` aufgelöst werden, um den Next.js 16+ Architekturrichtlinien zu entsprechen.

## 4. Design & Kinetik (Swiss Light Doctrine & CSS v4)
- **Chromatische Reinheit:** Die OKLCH-Farbräume sind in `tailwind.config.ts` definiert. Wir müssen jedoch rigoros prüfen, ob "schmutzige" HEX/RGB-Werte oder unautorisierte "Dark Mode"-Klassen (z.B. `dark:bg-gray-800`) im Codebase existieren. Die Swiss Light Doctrine erlaubt ausschließlich transparente Schatten und 1px Haarlinien.
- **Kinetische Disziplin:** Die Startseite (`src/app/page.tsx`) weist Potenzial für ein "Spatial Bento Grid" auf. Derzeit kämpfen mehrere Blöcke um Aufmerksamkeit, ohne eine kohärente, physikalisch gedämpfte Feder-Animation (Spring Physics) zu nutzen.
- **CSS Subgrid & Container Queries:** Um die Kartenkonsistenz (`src/components/forms/option-card.tsx`) zu garantieren, müssen Grid-Layouts zwingend auf `grid-rows-subgrid` migriert werden.

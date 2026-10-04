# RED-TEAM AUDIT
## Befunde:
1. **Silent Logic Death**: `src/components/calculator/service-einsatz-rechner.tsx` verfügt über keinen sichtbaren Ladezustand während asynchroner Formularübermittlungen.
2. **Hydration Mismatches**: Maskierte Client-Aufrufe ohne `useEffect` Guards in UI-Komponenten möglich.
3. **Typescript-Schwächen**: Ungenutzte `searchParams` in `src/app/(site)/page.tsx` können Linting-Fehler auslösen.
4. **Core Web Vitals**: `src/components/ui/image-placeholder.tsx` fehlen explizite Aspect-Ratio Deklarationen.

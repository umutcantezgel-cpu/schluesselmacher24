# RED-TEAM AUDIT: SCHLÜSSELMACHER24
Date: $(date -Iseconds)
Agent: JC-PHILOSOPHER-REDTEAM-v1

## 1. Silent Logic Death & Interaction Traps
- **Empty Handlers**: Analyzed standard forms. Potential risks in custom hooks wrapping Next.js Server Actions if `useTransition` bounds are not strictly handling error states.
- **Loading States**: Flow components (e.g., autoschlüssel anfrage) rely on client-side state. Network latencies during step progression without immediate skeleton loaders might break the illusion of an instant local app.
- **Data Edge Cases**: Discovered potential layout shifts in `src/app/page.tsx` if `guides` or `TRUST_POINTS` arrays are modified to be empty, leading to visual collapse of sections.

## 2. Hydration Mismatches & SSR Conflicts
- **Window/Local Storage**: `useFlow` relies on localStorage for saving multi-step configurations. Strict `useEffect` hydration guards are necessary to avoid mismatch between server HTML and client initial render.
- **Time Rendering**: Lead time calculations (`leadTimeDays`) might create subtle hydration issues if relative time formatting (e.g., "in 7 days") is calculated on the server vs client.

## 3. TypeScript & Data Structure Weaknesses
- **Schema.org Vulnerabilities**: `JsonLd` implementations in layout and page use basic JSON.stringify with generic interfaces. Needs rigorous `satisfies Graph` checking against `schema-dts` to prevent structural SEO failures.
- **Route Typing**: Navigation maps (`NAV_AREAS`, `QUICK_ENTRIES`) require strict template literal typing for routes to prevent broken links during refactoring.

## 4. Core Web Vitals & Layout Shifts
- **Image Aspect Ratios**: `<ImagePlaceholder>` usage is robust, but relies on CSS aspect-ratio. For real images, failing to provide explicit `width` and `height` alongside Next.js `<Image>` will cause severe CLS.
- **Grid Alignment**: Card grids (e.g., 'Schnelleinstieg' and 'Projekte') lack `grid-template-rows: subgrid`, causing misaligned footers/buttons if title or text lengths vary significantly across cards in the same row.

## 5. Swiss Light Mode Adherence
- **Chromatic Purity**: Current usage of `border-border` and `bg-surface` is solid, but absolute visual perfection requires strict verification that all grayscale values derive purely from OKLCH lightness variations, not hard HEX codes.
- **Kinetic Discipline**: Existing hover effects (e.g., `group-hover:translate-x-0.5`) are subtle. Care must be taken not to introduce overlapping, competing animations in future iterations.

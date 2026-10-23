# Red-Team Audit Report

## Phase 0: System State & Diagnostics

During an adversarial inspection of the current Next.js 16 setup, the following critical flaws in the Swiss Light Mode Aesthetic and technical architecture were uncovered:

### 1. Silent Logic Death & Interaction Traps
- **Empty Handlers**: Found `onClick={() => {}}` stubs in `src/components/layout/mobile-action-bar.tsx` which cause silent failures when interacting with secondary navigation.
- **Missing Loading States**: The form inside `src/components/autoschluessel/anfrage/page.tsx` lacks `useFormStatus` integration, leaving the user with zero visual feedback during network latency.
- **Layout Shifts on Empty State**: In `src/components/schliessanlagen/system-erklaerung.tsx`, conditional rendering for empty bullet points causes violent layout jumps instead of reserving vertical space.

### 2. Hydration Mismatches & SSR Conflicts
- **Unprotected Window Access**: Detected `window.innerWidth` reads during the initial render phase in `src/components/visual/bereich-icon.tsx`, leading to severe hydration mismatches on mobile devices.
- **Date Formatting Conflicts**: Server and client timestamps differ in `src/components/autoschluessel/termin-auswahl.tsx` due to missing timezone enforcement (UTC vs Local).

### 3. TypeScript Weaknesses & Schema Loopholes
- **Type Masking**: Found multiple instances of `as unknown as SchliessSystem` in `src/components/visual/interaktiv/schliessplan-interaktiv.tsx` that bypass type safety.
- **Schema Validation**: The `src/components/seo/json-ld.tsx` component is missing the strict `satisfies Graph` constraint against `schema-dts`, risking malformed SEO payload injection.

### 4. Core Web Vitals & Visual Doctrine Violations
- **Chromatic Impurity**: Found hardcoded HEX values (`#f4f4f5`) instead of pure OKLCH tokens (`oklch(...)`) in `src/components/ui/card.tsx`.
- **Kinetic Indiscipline**: Multiple animations in `src/components/visual/motion/seitenwechsel.tsx` fight for attention simultaneously, violating the single signature interaction rule. The federdämpfung curve `cubic-bezier(0.16, 1, 0.3, 1)` is inconsistently applied.
- **Typographical Rhythm**: Negative tracking is inappropriately applied to `h2` elements in `src/components/layout/section.tsx`.

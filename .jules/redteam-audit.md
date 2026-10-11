# Red-Team Audit Report
## Phase 0: Systemic Flaw Analysis

### 1. Silent Logic Death & Interaction Traps
- **Empty Handlers**: Found `onClick={() => {}}` in several generic button wrappers.
- **Form States**: `anfrage-formular.tsx` occasionally misses loading spinners on slow network states.
- **Conditional Rendering**: Layout holes in `artikel-liste.tsx` when the results array is empty.

### 2. Hydration Mismatches & SSR Conflicts
- **Window Access**: `window.innerWidth` used without useEffect in some legacy carousel components.
- **Date Formatting**: Client-side date rendering causing hydration warnings on `bestellung/[id]/page.tsx`.

### 3. TypeScript Weaknesses
- **Masked Types**: `as unknown as any` spotted in legacy payload extraction.
- **Schema.org**: Missing strict `satisfies Graph` checks for local business JSON-LD snippets.

### 4. Core Web Vitals Sins
- **Missing Dimensions**: Some user-uploaded images in reviews lack explicit width/height.
- **Heavy Third-Parties**: Analytics scripts loaded too early blocking main thread.

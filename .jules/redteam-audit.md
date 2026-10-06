# Red-Team Audit Report
## Phase 0: Discovery & Initial Scan

### 1. Silent Logic Death & Interaction Traps
- **Form Error Handling:** Several custom forms lack explicit loading states (`pending` via `useFormStatus`), leading to silent failures during slow network requests.
- **Empty Array Handling:** The cart summary list (`components/layout/summary-list.tsx`) can render layout holes if the basket array is empty rather than explicitly yielding an empty state placeholder.
- **Dangling Handlers:** A few `onClick` events in older layout components are wired to `console.log` placeholders rather than executing real logic or yielding gracefully.

### 2. Hydration Mismatches & SSR Conflicts
- **Date Formatting:** In the article and blog section (`app/(site)/artikel/page.tsx`), some timestamps are rendered without standardizing the timezone, causing potential hydration mismatch warnings on the server vs. client.
- **Unprotected Global Access:** Potential unsafe `window` property access found in third-party tracking scripts which are not wrapped in `useEffect` mounting guards.

### 3. TypeScript Weaknesses
- **Schema.org Graph Completeness:** The JSON-LD schema objects are mostly functional, but some lack the strict `satisfies Graph` constraint against `schema-dts`, masking deep type mismatches in SEO metadata.
- **Event Typings:** Some generic components rely on `as any` or loose typings when casting form data from Native FormData objects.

### 4. Core Web Vitals Sins
- **Aspect Ratio Jumps:** Hero images in `components/layout/page-header.tsx` could cause layout shifts (CLS) if explicit aspect-ratios are not strictly enforced during initial paint.
- **Heavy Client Bundles:** Some icon registries are loading unnecessarily large SVG libraries on the client side instead of using extracted server-side SVG sprites.

### 5. Swiss Light Mode Adherence
- **Chromatic Purity:** Found a few scattered hardcoded hex values (`#f4f4f4`) in older components that need to be transitioned to the centralized OKLCH color token system (e.g., `oklch(0.988 0.002 260)`).
- **Kinetic Overload:** The homepage contains a few competing CSS transitions on hover that should be simplified to a single dominant signature interaction per section.

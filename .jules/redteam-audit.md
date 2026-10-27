# Red-Team Audit Report
## Silent Logic Death
- `onClick` handlers that don't do anything or just log to console.
- Forms missing loading states or silent on network errors.
- Conditional rendering causing layout shifts on empty arrays.

## Hydration Mismatches & SSR Conflicts
- Direct access to `window`, `document`, `localStorage` without `useEffect` or mounting guards.
- Date formatting or random numbers causing mismatches between server and client.

## TypeScript Weaknesses
- Masked types using `as unknown as Type`.
- Incomplete interfaces.
- `schema-dts` graphs not using `satisfies Graph`.

## Core Web Vitals Sins
- Images missing dimensions.
- Heavy third-party libraries in Client components.

## Swiss Light Design Doctrine
- Ensure OKLCH color spaces.
- Typographic rhythm: no widows/orphans, no negative tracking on headlines.
- Kinetic discipline: strictly one signature interaction per route.

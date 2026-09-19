1. Use `replace_with_git_merge_diff` to update `src/components/seo/json-ld.tsx`.
   - Update imports: `import type { Graph, Thing, DayOfWeek, WithContext } from 'schema-dts';`.
   - Update `JsonLd` props: `data: Graph | Thing | WithContext<Thing>`.
   - Update `localBusinessSchema`: return `{ '@context': 'https://schema.org', '@graph': [ { '@type': 'Organization', ... }, { '@type': 'WebSite', ... }, { '@type': 'WebPage', ... }, { '@type': 'Locksmith', ... } ] } satisfies Graph;`. Connect the nodes via `@id`. Use `'@type': 'OpeningHoursSpecification' as const` for opening hours and correctly type `dayOfWeek`.
   - Update `productSchema`: wrap the returned object in a `{ '@context': 'https://schema.org', '@graph': [ ... ] } satisfies Graph` structure, and use `'@type': 'Product' as const`, `'@type': 'Offer' as const` etc.
   - Update `articleSchema`: wrap the returned object in a `@graph` array satisfying `Graph`, and use `as const` for literals.
   - Update `faqSchema`: wrap the returned object in a `@graph` array satisfying `Graph`, and use `as const` for literals.
   - Update `serviceAreaSchema`: wrap the returned object in a `@graph` array satisfying `Graph`, and use `as const` for literals.
   - Update `breadcrumbSchema`: wrap the returned object in a `@graph` array satisfying `Graph`, and use `as const` for literals.
2. Run `npx tsc --noEmit`, `npm run lint`, `npm test`, and `npm run build` using `run_in_bash_session` to verify the types compile and build passes.
3. Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.

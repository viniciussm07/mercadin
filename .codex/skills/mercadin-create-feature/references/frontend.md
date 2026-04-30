# Mercadin Frontend Feature Patterns

Use these patterns for Expo/React Native work in `client`.

## Primary Exemplars

- Page shell: `client/src/pages/search-items/index.tsx`
- Page hook: `client/src/pages/search-items/hooks.ts`
- Page components: `client/src/pages/search-items/components/*/index.tsx`
- Service contract: `client/src/services/products/index.ts`
- Endpoint registry: `client/src/services/endpoints.ts`

## Structure

- Pages live under `client/src/pages/<page-name>/`.
- Complex page children live under `components/<component-name>/index.tsx`.
- Component folder names are `kebab-case`; do not create `PascalCase.tsx` component files.
- Put page-local query/state orchestration in `hooks.ts` beside the page.
- Put exported page-local types in `types.ts` only when they need to be shared.
- Services live in `client/src/services/<domain>/index.ts`.
- Shared UI primitives come from `@components/*`; prefer existing primitives before creating new ones.

## Page Composition

Follow `SearchItemsPage`:

- Keep the page component mostly declarative.
- Compute derived data with `useMemo` only when it stabilizes object/array values or avoids repeated work.
- Use explicit loading, error, empty, and success branches.
- Keep fixed layout constants outside the component, such as heights and static content container styles.
- Handle platform differences through existing utilities such as `env.isWeb` and React Native safe area hooks.
- Use bounded content widths on web where existing pages do, e.g. `max-w-4xl self-center`.

## Data Fetching

- Use `@tanstack/react-query` for server state.
- Keep query keys stable and structured. Define constants with `as const`, then append variable inputs.
- Pass `signal` from React Query into service calls when the service supports cancellation.
- Use `enabled` for minimum input requirements instead of firing invalid requests.
- Do not put server state in Zustand. Zustand is acceptable for UI/global state such as selected filters or debounced input.

Example pattern:

```ts
const FEATURE_QUERY_KEY = ["domain", "action"] as const;

const result = useQuery({
  queryKey: [...FEATURE_QUERY_KEY, variable],
  queryFn: ({ signal }) => domainService.action({ variable, signal }),
  enabled: hasRequiredInput,
});
```

## HTTP Services

Follow `client/src/services/products/index.ts`:

- Use `apiClient` from `@services/http`; do not use native `fetch` or axios.
- Register URL fragments in `@services/endpoints`.
- Export response and entity interfaces from the service when consumers need them.
- Keep services thin: encode params, call HTTP, parse JSON type. Do not put UI decisions or business rules here.
- Include `AbortSignal` in params for query-backed requests.
- Encode query params. For repeated params, map each value explicitly, as products search does with `market=<slug>`.

## UI And Styling

- Use NativeWind `className`; avoid `StyleSheet.create`.
- Prefer existing `Text`, `Button`, `Card`, `Icon`, `Input`, `ToggleGroup`, and skeleton primitives.
- Use lucide icon names through the existing `Icon` component.
- Keep text resilient: use `numberOfLines`, `min-w-0`, wrapping, and stable sizes where dynamic content can overflow.
- Keep cards for repeated entities or framed controls, not for every page section.
- Preserve typography conventions already present, such as `font-questrial` for small supporting labels.

## Forms

- Use `@tanstack/react-form` with `zod` and `@tanstack/zod-form-adapter` when adding forms.
- Keep validation schemas close to the form unless shared elsewhere.

## Before Editing

Inspect nearby routes, services, stores, and components for the target feature. If adding a new page or navigation path, inspect `client/src/routes` and existing page registration before deciding placement.

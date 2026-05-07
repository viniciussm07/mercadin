---
name: mercadin-create-feature
description: Create or modify frontend and backend features in the Mercadin monorepo. Use when Codex is asked to implement a Mercadin feature, API endpoint, service, screen, component, hook, repository, DTO, React Query integration, NativeWind UI, or any cross-client/server behavior that must follow Mercadin repository patterns.
---

# Mercadin Create Feature

Use this skill to implement features in `/Users/leoldev/Repos/mercadin` while preserving the codebase's existing architecture. Default to implementation, but do not invent new architecture, dependencies, naming patterns, or product behavior when the repository does not make the answer clear.

## Core Workflow

1. Read local instructions first: `AGENTS.md` if present, then the relevant `package.json` scripts.
2. Classify the request as frontend, backend, or cross-stack. If unclear, inspect both sides before editing.
3. Inspect the closest existing feature before designing the change. Prefer nearby modules, components, hooks, services, DTOs, repositories, and utilities over general framework habits.
4. Load only the needed reference:
   - Frontend screens, components, services, hooks, stores, routing: read `references/frontend.md`.
   - Backend modules, controllers, services, repositories, DTOs, Prisma flows: read `references/backend.md`.
   - Cross-stack work: read both references and keep API contracts aligned.
5. Interview the user before implementation if the expected behavior, API contract, data model, dependency choice, or placement is not supported by existing code.
6. Make focused edits that match the current folder structure and file names.
7. Validate with the narrowest meaningful commands, then broaden when the change crosses package boundaries.

## Non-Negotiables

- Use `pnpm`; never use `npm` or `yarn`.
- Keep TypeScript strict. Do not use `any`, `@ts-ignore`, or untyped escape hatches unless the user explicitly authorizes it.
- Do not add dependencies unless the user asks or the existing codebase already establishes the package as the right tool.
- Do not create files with ad hoc names when the project has a pattern. Components use folders in `kebab-case` with `index.tsx`; colocated logic uses `hooks.ts`; exported shared types use `types.ts`.
- Keep files at 150 lines or less. If a file would exceed that, split it into focused subcomponents, hooks, or helpers before continuing.
- Do not put logic in component bodies. Prefer moving state derivation, handlers, effects, and data orchestration into custom hooks.
- Do not place business logic in frontend services or backend controllers.
- Do not access Prisma outside backend repositories.
- Use NativeWind classes for React Native styling. Avoid `StyleSheet.create` except for a documented platform limitation.
- Use `ky` via `apiClient` for frontend HTTP and TanStack Query for server state.

## When To Interview

Ask concise implementation questions before editing when any of these is true:

- The prompt requires new product behavior and existing code does not define the rule.
- A new database field, relation, migration, endpoint contract, route, or navigation path is needed but not specified.
- More than one repository pattern could fit and choosing one would affect future architecture.
- The feature appears to require a new package, background job, cache policy, authentication rule, or authorization model.
- The requested UI has unclear states, empty/error/loading behavior, or platform differences that cannot be inferred from nearby screens.

If the ambiguity is small and local, state the assumption and proceed only when the assumption follows an existing pattern.

## Validation

Prefer package scripts over root aliases when there is divergence.

- General: `pnpm lint`, `pnpm build:tsc`, `pnpm format` when formatting is needed.
- Frontend: `pnpm --filter @mercadin/client build:tsc`; use `pnpm --filter @mercadin/client web|ios|android` only when runtime verification is needed.
- Backend: `pnpm --filter @mercadin/server build:tsc`, `pnpm --filter @mercadin/server build`.
- Local backend database: `docker compose -f server/docker-compose.yml up -d`, then `pnpm --filter @mercadin/server prisma:generate` and `prisma:migrate` or `prisma:push` based on the task.
- Do not assume a backend test command exists; inspect `server/package.json` first.

## Reference Map

- `references/frontend.md`: Patterns based on `client/src/pages/search-items/index.tsx`, its hooks/components, and `client/src/services/products/index.ts`.
- `references/backend.md`: Patterns based on `server/src/modules/products` and the product search API shape consumed by `client/src/services/products/index.ts`.

# Mercadin Backend Feature Patterns

Use these patterns for NestJS work in `server`.

## Primary Exemplars

- Module: `server/src/modules/products/products.module.ts`
- Controller: `server/src/modules/products/controllers/products.controller.ts`
- Service: `server/src/modules/products/services/products.service.ts`
- Repository: `server/src/modules/products/repositories/products.repository.ts`
- DTO: `server/src/modules/products/dtos/search-products.dto.ts`
- Utility: `server/src/modules/products/utils/rank-results.ts`
- Frontend API consumer for products: `client/src/services/products/index.ts`

## Module Structure

Each domain belongs under `server/src/modules/<domain>/`:

- `<domain>.module.ts`
- `controllers/*.controller.ts`
- `services/*.service.ts`
- `repositories/*.repository.ts`
- `dtos/*.dto.ts`
- `utils/*.ts` only for pure domain helpers

Register controllers, providers, imports, and exports in the module. Import other modules when using their services instead of reaching across internals.

## Layer Responsibilities

Controllers:

- Receive HTTP requests and return service results.
- Use decorators, params, query/body DTOs, and pipes.
- Stay thin. Do not orchestrate business logic or database access.
- Use existing auth decorators such as `@Public()` when the route intentionally bypasses auth.

Services:

- Own business flow, validation that is not just DTO shape, orchestration, grouping, ranking, cache policy, and calls to other services.
- Depend on repositories and other services.
- Do not inject `PrismaService`.
- Keep reusable pure logic in `utils` when it has no Nest dependency.

Repositories:

- Are the only layer that injects `PrismaService`.
- Own Prisma queries, includes, ordering, pagination limits, upserts, and transaction details.
- Return data shapes the service can consume without leaking controller concerns.

DTOs:

- Use `class-validator` and `class-transformer` patterns already present.
- Use explicit decorators such as `@IsString`, `@MinLength`, `@IsOptional`, and `@IsEnum`.
- Represent request input only. Response types can live near services when they are inferred from repository return types.

## Product Module Lessons

The products module demonstrates the expected split:

- `ProductsController.search` receives `SearchProductsDto` and a parsed `market` query, then calls `ProductsService.search`.
- `ProductsService.search` trims and normalizes input, applies minimum length rules, decides cache vs scrape behavior, calls ingestion/orchestration, and groups/ranks results.
- `ProductsRepository.findByQuery`, `isQueryFresh`, and `touchQueryCache` contain all Prisma access.
- `rankResults` is a pure utility, kept outside the service because it is domain logic without Nest dependencies.

Follow this split when adding feature behavior. For example, a new filtered search option should usually touch:

- DTO for request validation.
- Controller only to receive the new input or pipe.
- Service for behavior and orchestration.
- Repository for query changes.
- Frontend service/types if the API contract changes.

## API Contracts

When backend output is consumed by the client:

- Update `client/src/services/<domain>/index.ts` interfaces in the same feature change.
- Keep endpoint paths in `client/src/services/endpoints.ts` aligned with controller routes.
- Preserve response shape unless the user explicitly accepts a breaking change.
- Avoid returning raw Prisma details that the UI does not need.

## Validation And Data Rules

- Use DTO validation for syntactic request constraints.
- Use service-level guards for business constraints that depend on normalized values or multiple inputs.
- Normalize user input in one place before cache keys, comparisons, and repository calls.
- Deduplicate repeated query inputs before running downstream work when the products pattern applies.

## Prisma And Database Changes

- Inspect `server/prisma/schema.prisma` before adding fields or relations.
- Ask the user before creating a migration if the data model change is not explicit.
- After schema edits, run `pnpm --filter @mercadin/server prisma:generate`.
- Use `prisma:migrate` for intended migrations and `prisma:push` only for local schema synchronization when that is the explicit intent.

## Before Editing

Inspect the target module and one neighboring mature module before creating new files. If no pattern exists for the behavior, interview the user rather than inventing a structure.

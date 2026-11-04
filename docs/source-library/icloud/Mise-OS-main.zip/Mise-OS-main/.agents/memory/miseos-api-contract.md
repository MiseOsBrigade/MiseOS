---
name: MiseOS API contract
description: How to add/change an API resource end-to-end in this pnpm monorepo (spec → codegen → routes → typed hooks).
---

# Adding an API resource (end-to-end)

The OpenAPI spec is the single source of truth. Order of operations:

1. Edit `lib/api-spec/openapi.yaml` — add a tag, paths (with `operationId`s), and component schemas.
2. Run `pnpm --filter @workspace/api-spec run codegen`. This one command regenerates **both** client libs (`@workspace/api-client-react` orval hooks + `@workspace/api-zod`) **and** runs `pnpm -w run typecheck:libs`. Always run it after spec edits.
3. Implement the Express route in `artifacts/api-server/src/routes/<name>.ts` and register it in `artifacts/api-server/src/routes/index.ts` (`router.use(...)`). Routes are mounted under `/api`.
4. Consume generated hooks from `@workspace/api-client-react`: `useGetX` / `useListX` / `useUpdateX`, query-key helpers `getListXQueryKey()`, and model types (re-exported from the package barrel via `api.schemas`).

**Why:** the typed contract is only correct if route JSON field names exactly match the spec schema. A computed/derived field (e.g. claim `isSupported`/`isVerifiable`) must be added to the schema AND produced by the route serializer, or types and runtime diverge silently.

## Mutations + cache
- Mutation hooks take `{ id, data }` (path param + body), mirroring existing `useResolveApproval`.
- After a mutation, invalidate with the no-arg query-key helper to prefix-match parameterized queries, e.g. `queryClient.invalidateQueries({ queryKey: getListGridClaimsQueryKey() })`, plus any summary key.

## Server-side invariants
- Keep server validation in lockstep with client-exposed booleans. Example: the Grid "a claim needs a source AND a non-unknown confidence to be verifiable" rule is exposed as `isVerifiable` to the client (disables the Verify button) AND enforced on PATCH (400). When a claim leaves the `verified` state, clear `lastVerified`/`verifiedBy` so the UI never shows a stale stamp.

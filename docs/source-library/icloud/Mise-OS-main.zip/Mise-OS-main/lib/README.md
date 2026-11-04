<div align="center">

<img src="../attached_assets/miseos_agents/06_platform_infra/Database.png" width="160" alt="Database — Database Steward" />

# 📦 The Pantry — `lib/`

**Patron brigade · Platform & Infrastructure** &nbsp;`#26B6A6`
_Compute · Storage · Observe_

</div>

> _"Stock it once. Every station shares it."_ — **Database**, Database Steward

The **pantry** holds the shared ingredients — the libraries every artifact depends
on. Define a contract here once, and the whole brigade cooks from the same recipe.

## What lives here

| Package | Role |
| --- | --- |
| [`api-spec`](./api-spec) | The OpenAPI contract — the single source of truth. Edit the spec, run codegen. |
| [`api-client-react`](./api-client-react) | Generated React Query hooks for consuming the API. |
| [`api-zod`](./api-zod) | Generated Zod schemas for runtime validation. |
| [`db`](./db) | Database client and schema (Drizzle). |

> **Contract first:** change [`api-spec`](./api-spec), run the one codegen command,
> then update routes + clients to match the spec field names.

## Brand

This station wears **Broth Teal** `#26B6A6`. See the [Design Board](../docs/DESIGN-SYSTEM.md).

<div align="center"><sub><b>MiseOS</b> · Cook. Orchestrate. Deploy.</sub></div>

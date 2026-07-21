# ADR-0002: Keep the core provider-neutral

- Status: Accepted
- Date: 2026-07-21

## Context

Wallet SDKs, CAIP session APIs, RPC providers, and explorer APIs evolve independently.

## Decision

Core packages depend only on internal interfaces and domain types. MetaMask and other vendors are implemented as adapters.

## Consequences

The codebase gains migration flexibility and testability at the cost of additional interface design.

# ADR-0001: Human-approved execution boundary

- Status: Accepted
- Date: 2026-07-21

## Context

MiseOS agents need to assist with blockchain workflows without silently controlling end-user wallets.

## Decision

Models may propose versioned typed intents. Trusted code validates, deterministically encodes, simulates, evaluates policy, and renders a review. The user's wallet remains the final signing authority for user-controlled transactions.

## Consequences

This reduces autonomous execution risk and improves auditability, but introduces approval latency and requires high-quality previews.

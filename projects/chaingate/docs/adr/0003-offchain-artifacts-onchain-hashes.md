# ADR-0003: Store artifacts off-chain and anchor compact hashes

- Status: Accepted
- Date: 2026-07-21

## Context

Research files, media, and software bundles are too large, private, and mutable for direct blockchain storage.

## Decision

Store binaries in object storage. Put canonical artifact and metadata hashes, issuer, timestamp, and URI reference in provenance records and the minimal registry contract.

## Consequences

This reduces cost and privacy exposure while preserving tamper evidence. Availability and retention of off-chain objects become operational responsibilities.

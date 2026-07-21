# Testing and validation

## Test pyramid

### Unit tests

Cover schema validation, policy reason codes, nonce lifecycle, canonical hashing, account/scope parsing, receipt normalization, and entitlement decisions.

### Contract tests

Use Foundry for:

- successful registration
- duplicate artifact rejection
- empty metadata rejection
- event correctness
- fuzzed artifact hashes and URIs
- invariants: an artifact hash maps to at most one immutable proof

### Integration tests

Mock wallet providers, RPC, Blockscout, Stripe, Spaces, OpenAI, and Airbyte. Exercise timeouts, malformed responses, retries, chain changes, account changes, user rejection, stale simulations, reverted transactions, and delayed indexing.

### End-to-end tests

On Base Sepolia:

1. connect a test wallet
2. authenticate with a one-time challenge
3. upload and hash a test artifact
4. prepare and simulate registration
5. approve and broadcast
6. verify receipt independently
7. confirm stored provenance and audit events

## Required CI gates

- formatting
- TypeScript lint/typecheck
- unit tests
- package builds
- documentation-link check
- dependency review
- CodeQL
- secret scanning through repository settings
- Solidity compile/tests when Foundry is available

## Acceptance criteria

A state-changing operation is accepted only when its intent, deterministic transaction, simulation, policy decision, human approval, wallet account, chain, receipt, and stored evidence all refer to the same immutable identifiers.

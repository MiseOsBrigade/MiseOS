# MiseOS Agent Trust Model v1

## Status

- Architecture: FROZEN
- Security posture: candidate, not production identity infrastructure
- Release target: `v1.0.0-security`
- Trust anchor: external trusted key registry required
- Verification result: structured decision, never Boolean validity

## Core doctrine

```text
Identity != Authority != Action Evidence
```

A valid cryptographic signature proves possession of the private key corresponding to a public key. It does not, by itself, prove identity, delegated authority, authorization, execution attestation, provenance truth, or semantic correctness.

The complete trust chain is:

```text
trusted identity binding
  -> trusted key resolution
  -> delegation
  -> authorization
  -> signed action envelope
  -> execution attestation
  -> provenance evidence
```

## Verification semantics

```text
allow         every required trust domain passed
 deny         at least one required domain definitively failed
indeterminate  no definitive failure, but a required check could not complete
```

`indeterminate` is never a soft allow.

Examples:

- unavailable revocation registry -> `indeterminate`
- unavailable required OIDC issuer -> `indeterminate`
- invalid signature -> `deny`
- revoked trusted key -> `deny`
- artifact-supplied public key with no trusted binding -> `deny`

## Signed envelope

The signing object must be versioned and detached from key trust:

```ts
interface SignedEnvelopeV1 {
  schema: "miseos.signed-envelope/v1";
  algorithm: "Ed25519";
  keyId: string;
  payloadDigest: {
    algorithm: "sha256";
    value: string;
  };
  issuedAt: string;
  expiresAt?: string;
  nonce: string;
  audience: string;
  actionId: string;
  authorizationId: string;
  delegationId?: string;
}
```

The signature is over RFC 8785 JCS of the envelope. The verifier resolves `keyId` from an external trust registry. A public key supplied by the artifact is informational, never its own trust anchor.

## Delegation and authorization

Delegation is separately signed and scoped by capability, resource pattern, audience, validity interval, revocation identifier, and maximum delegation depth.

Authorization independently evaluates operation, resource, subject, audience, time, delegation, state, and revocation. System state is not permission by itself.

## Evidence provenance

Every provenance claim should identify its source and verification state. Recommended sources include:

- `signed-by-key`
- `github-oidc`
- `git-object`
- `artifact-digest`
- `external-attestation`
- `self-asserted`

Self-asserted claims must never be silently upgraded to independently verified claims.

## Required failure taxonomy

```text
SCHEMA_INVALID
IDENTITY_BINDING_UNVERIFIED
KEY_NOT_TRUSTED
KEY_REVOKED
KEY_SUSPENDED
SIGNATURE_INVALID
DIGEST_MISMATCH
DELEGATION_MISSING
DELEGATION_INVALID
DELEGATION_EXPIRED
DELEGATION_DEPTH_EXCEEDED
AUTHORIZATION_DENIED
TEMPORAL_INVALID
REVOCATION_UNKNOWN
REPLAY_DETECTED
AUDIENCE_MISMATCH
ATTESTATION_UNVERIFIED
PROVENANCE_MISMATCH
```

## Verification order

1. Parse without coercion.
2. Validate the wire schema.
3. Canonicalize the signed envelope with JCS.
4. Resolve `keyId` externally.
5. Verify key status and identity binding.
6. Verify the Ed25519 signature.
7. Verify the payload digest.
8. Verify issuer and audience.
9. Verify GitHub/OIDC attestation when claimed or required.
10. Verify delegation chain and depth.
11. Verify operation and resource scope.
12. Verify temporal policy and clock skew.
13. Verify revocation.
14. Verify replay protection.
15. Verify provenance and artifact hashes.
16. Return `allow`, `deny`, or `indeterminate` with machine-readable failures.

## Release gates

Promotion beyond candidate status requires conformance tests for JCS, cryptographic vectors, key substitution, identity binding, authorization, revocation, replay, OIDC attestation, key rotation, audit-chain integrity, and adversarial confused-deputy/cross-repository/delegation-escalation cases.

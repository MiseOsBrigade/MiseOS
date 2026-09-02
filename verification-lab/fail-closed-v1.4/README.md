# Fail-Closed Governance v1.4 — CI Verification Harness

This branch executes only the deterministic governance shell for `lattice-entropy-gcr-freeze-v1`.

It does **not** reopen or promote any scientific claim about lattice Nodes 5/6, entropy reversal, or catastrophic-risk probabilities.

## Scoped checks

1. **TLC 1.7.4** — finite exploration of nine frozen claim seeds with one nondeterministically selected active lineage, `MaxVer = 3`; invariant `Inv` includes `AllowImpliesPass`, `IndeterminateNeverAllow`, `LineageOK`, and `TypeOK`.
2. **Apalache 0.62.2** — three inductiveness obligations: `Init => Inv` (length 0), `Inv /\ Next => Inv'` (length 1), and `Inv => AllowImpliesPass` (length 0), with deadlock checking disabled for the proof obligations.
3. **Lean 4.33.0** — typechecks `allow_requires_pass`, `indeterminate_never_allows`, and `preservation_not_authorization`.
4. **Cedar Policy CLI 4.12.0** — parses the promotion policy; checks ALLOW for `pass + requirements=true`, DENY for `indeterminate`, and exercises Cedar skip-on-error so the application-level wrapper can require `ALLOW && diagnostics.errors.isEmpty()`.

All external tool artifacts are version-pinned and checksum-checked in CI. GitHub Action dependencies are pinned to commit SHAs.

## Receipt rule

A green job is not stored as `FORMALLY_VERIFIED = TRUE`. After execution, each tool receives a separate receipt containing its tool/version, mode, exact scope, result, workflow run/job identifiers, commit SHA, and relevant artifact digests.

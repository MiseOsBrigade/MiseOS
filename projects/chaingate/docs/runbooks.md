# Operational runbooks

## Wallet-session incident

1. Disable new state-changing requests.
2. Invalidate affected application sessions.
3. Preserve audit events and normalized errors.
4. Confirm no private-key material entered application systems.
5. Restore only after adapter and session validation.

## RPC disagreement

1. Mark state indeterminate.
2. Stop entitlement and provenance finalization.
3. Query an independent RPC and explorer.
4. Compare block, status, logs, and finality.
5. Record reconciliation; never choose the most favorable result automatically.

## Blockscout indexing delay

Keep the transaction pending, query RPC directly, retry with bounded exponential backoff, and alert when lag exceeds threshold. Explorer delay alone is not transaction failure.

## Stripe webhook failure

Verify raw-body preservation, timestamp tolerance, and endpoint secret. Process idempotently by event ID. Grant entitlement only from verified settlement evidence.

## Suspected replay

Deny, verify nonce consumption, search for duplicate intent IDs/digests, invalidate related sessions, and rotate credentials when compromise is plausible.

## Compromised API credential

Revoke immediately, disable the integration if rotation is delayed, review access logs, determine data impact, and follow `SECURITY.md`.

## Failed registration

Preserve intent, simulation, policy decision, request, and receipt. Decode the revert, confirm chain/address, check for duplicate hash, and build a new intent rather than mutating an expired one.

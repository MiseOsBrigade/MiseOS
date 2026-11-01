# Security Model

This profile treats delegated execution as a high-risk capability. The safest default is to reject unless every required boundary is clear to the user.

## Required wallet behavior

1. Display the DApp origin, target account, chain, permission type, rule set, expiry, value exposure, and revocation path.
2. Reject malformed requests.
3. Reject unsupported chains.
4. Reject expired or missing-expiry requests unless the user explicitly approves a no-expiry profile.
5. Apply a conservative matrix risk score.
6. Require explicit approval when the risk band is high or critical.
7. Store granted permissions in encrypted wallet storage.
8. Provide revocation by permission context.
9. Emit local audit records for grant, adjustment, use, expiration, and revoke.

## Phishing controls

- Screen the requesting domain before displaying approval.
- Treat unknown or suspicious domains as higher risk.
- Never hide the `to` session account or target contract.
- Never allow a DApp to define its own display-only name without also showing the verified origin.

## Replay controls

- Permission contexts should be unique.
- Wallets should bind contexts to chain ID, target account, DApp origin, expiry, and permission payload.
- DApps should not reuse contexts across users or chains.

## Matrix metric

The C++ metric is intentionally simple:

```text
risk = W · [
  permission_breadth,
  value_exposure,
  time_exposure,
  1 - target_trust,
  1 - domain_reputation,
  1 - user_familiarity
]
```

The score is only a signal. The wallet remains the enforcement authority.

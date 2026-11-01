# Security Policy

## Reporting

Open a private security advisory or contact the repository maintainer. Do not publish exploit details publicly before a fix is available.

## Baseline controls

- No committed secrets.
- No hidden execution in media assets.
- No workflow action outside allowlisted handlers.
- Signed manifests or checksums for externally triggered behavior.
- Least-privilege GitHub Actions permissions.

## Agent rules

Repository agents may inspect, test, document, and open pull requests. They must not rotate credentials, rewrite history, disable tests, or modify deployment/billing settings without explicit approval.

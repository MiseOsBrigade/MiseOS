# Security Policy

Mise-en-Preplist handles compressed payloads, so safety matters.

## Supported Security Scope

Please report issues related to:

- zip path traversal
- unsafe extraction behavior
- workflow permission misuse
- accidental secret exposure in payloads
- automation that commits unexpected files

## Safe Payload Rules

Payload archives should not contain:

```text
../outside-file
/absolute/path
folder/../../escape
.env
*.pem
*.key
```

The safe unzip script rejects unsafe paths before extraction. Operators should still inspect `bootstrap/payload-manifest.txt` before running the workflow.

## Reporting

Open a private security advisory if the repository is public and the issue could expose secrets or allow unsafe file writes. For non-sensitive issues, open a normal bug report.

# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within mise-brigade-de-repo, please follow our responsible disclosure process:

1. **Do NOT** create a public GitHub issue
2. Send a detailed description to the repository maintainer
3. Include the following in your report:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested mitigation (if any)

We aim to respond within 48 hours and will work with you to:
- Confirm the vulnerability
- Determine severity
- Develop and release a fix
- Credit you (if desired) in the release notes

## Security Best Practices

When using mise-brigade:
- Review all permissions requested by workflows
- Use least privilege principles for automation
- Keep action versions pinned
- Monitor workflow runs for unusual activity
- Validate automation outputs before applying

## Dependencies

This project depends on external GitHub Actions. We regularly update dependencies and monitor for known vulnerabilities via Dependabot.
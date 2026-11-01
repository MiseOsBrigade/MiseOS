# MiseOS GitHub Account Setup

## 1. Personal Account

Use the personal account as the founder identity and credibility surface.

Checklist:

- Enable 2FA.
- Verify email.
- Add SSH key.
- Add founder profile image.
- Create profile README.
- Pin `Mise-OS`, `miseos-agent-sdk`, `miseos-registry`, `miseos-card-gallery`, `miseos-marketplace-action`, and `goodshyt-systems`.
- Add founder bio: `Creator of MiseOS — a Git-native operating system for coordinated development, repo stewardship, automation, and ethical AI workflows.`

## 2. Organization Account

Use the organization as the official product home.

Recommended organization: `Mise-OS`

Teams:

- owners
- security
- maintainers
- pipeline
- platform
- reliability
- integrations
- docs
- community
- commercial

Starter repositories:

- `Mise-OS`
- `miseos-agent-sdk`
- `miseos-registry`
- `miseos-cli`
- `miseos-card-gallery`
- `miseos-marketplace-action`
- `miseos-docs`
- `miseos-nft-metadata`

## 3. Enterprise Account

Use enterprise only after traction or when centralized governance is needed.

Enterprise structure:

```text
GoodShyt Group Enterprise
├── Mise-OS
├── GoodShyt-Systems
├── MiseOS-Marketplace
├── MiseOS-Labs
└── Customer-Deployments
```

Enterprise policies:

- Require 2FA.
- Require pull requests.
- Block direct pushes to `main`.
- Require CodeQL.
- Require dependency review.
- Require secret scanning.
- Require signed releases.
- Require license checks for paid packages.

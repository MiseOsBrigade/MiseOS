# MiseOS Registry Catalog

> **Product infrastructure only. These 23 manifests are not character cards.**

## Official Ecosystem Model

- Character agents: **112**
- Registry manifests: **23**
- Total ecosystem items: **135**

`112 character agents + 23 registry manifests = 135 MiseOS ecosystem items.`

Character records belong in the character roster and collectible-card metadata. Registry records belong in product, package, marketplace, workflow, policy, schema, and infrastructure metadata.

## Catalog

| # | Registry ID | Name | Type | Record kind |
|---:|---|---|---|---|
| 1 | `miseos.agent-sdk` | MiseOS Agent SDK | SDK | `registry_manifest` |
| 2 | `miseos.analytics-engine` | MiseOS Analytics Engine | Analytics | `registry_manifest` |
| 3 | `miseos.attestation-gate` | MiseOS Attestation Gate | Policy | `registry_manifest` |
| 4 | `miseos.cli` | MiseOS CLI | Package | `registry_manifest` |
| 5 | `miseos.docs-builder` | MiseOS Docs Builder | Container | `registry_manifest` |
| 6 | `miseos.docs-hub-template` | MiseOS Docs Hub Template | Template | `registry_manifest` |
| 7 | `miseos.gradle-plugin` | MiseOS Gradle Plugin | Package | `registry_manifest` |
| 8 | `miseos.maven-policy-adapter` | MiseOS Maven Policy Adapter | Package | `registry_manifest` |
| 9 | `miseos.nuget-client` | MiseOS NuGet Client | SDK | `registry_manifest` |
| 10 | `miseos.policy-checker` | MiseOS Policy Checker | Container | `registry_manifest` |
| 11 | `miseos.policy-engine` | MiseOS Policy Engine | Policy | `registry_manifest` |
| 12 | `miseos.registry-schema` | MiseOS Registry Schema | Schema | `registry_manifest` |
| 13 | `miseos.release-sentinel` | MiseOS Release Sentinel | Agent | `registry_manifest` |
| 14 | `miseos.repo-steward` | MiseOS Repo Steward | Agent | `registry_manifest` |
| 15 | `miseos.ruby-steward` | MiseOS Ruby Steward | Package | `registry_manifest` |
| 16 | `miseos.runner` | MiseOS Runner | Container | `registry_manifest` |
| 17 | `miseos.sbom-indexer` | MiseOS SBOM Indexer | Agent | `registry_manifest` |
| 18 | `miseos.trust-graph` | MiseOS Trust Graph | Analytics | `registry_manifest` |
| 19 | `miseos.workflow-linter` | MiseOS Workflow Linter | Agent | `registry_manifest` |
| 20 | `miseos.workflow-pack` | MiseOS Workflow Pack | Workflow | `registry_manifest` |
| 21 | `miseos.repo-pet` | MiseOS Repo Pet | Agent | `registry_manifest` |
| 22 | `miseos.repo-reliability-kit` | MiseOS Repo Reliability Kit | Workflow | `registry_manifest` |
| 23 | `miseos.orchestra-theme` | Mise Orchestra Theme | Theme | `registry_manifest` |

## Metadata Boundary

- Character metadata may contain role, department, rarity, lore, stats, abilities, edition, image, animation, and collectible traits.
- Registry metadata may contain package type, version, distribution channel, runtime, permissions, compatibility, pricing tier, and marketplace information.
- A registry item may have a visual badge, but it is not a character, mascot, brigade operator, or collectible agent.

## Required Language

Use: **112 character agents + 23 registry manifests = 135 MiseOS ecosystem items.**

Do not describe the ecosystem as **135 characters**.

## Canonical Source

The machine-readable source of truth is [`registry/registry-catalog.manifest.json`](../../registry/registry-catalog.manifest.json).

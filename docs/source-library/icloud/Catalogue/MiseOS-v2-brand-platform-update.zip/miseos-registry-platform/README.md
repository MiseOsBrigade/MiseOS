# MiseOS

**MiseOS is an autonomous development platform, agent orchestration OS, and developer operating system.**

> MiseOS coordinates AI agents, repositories, tools, workflows, infrastructure, and approvals into a single operational system.

## Product hierarchy

```text
MiseOS (company + operating system)
├── Core
├── Brigade (agent workforce)
├── Kitchen
├── Orchestra
├── Vault
└── Observatory
```

**Brigade** is the autonomous workforce powering MiseOS. **Kurogami** is the lead mascot and brand guide—not the product itself.

## Launch story

> Build Software Like A World-Class Kitchen  
> 75 Specialized Agents. One Operating System.  
> Cook. Orchestrate. Deploy. Observe.

Preview the new brand site:

```bash
pnpm preview:brand
# http://localhost:4173
```

## Registry control plane

This repository also contains the runnable control plane for 23 product-infrastructure registry manifests. Registry manifests are packages, policies, schemas, containers, and workflow tools—not character cards.

```bash
corepack enable
pnpm install
pnpm verify
pnpm dev
```

API: `http://localhost:8787`

```bash
curl http://localhost:8787/health
curl http://localhost:8787/v1/catalog
pnpm miseos catalog validate
pnpm miseos doctor
```

## Canonical source files

- [`data/product-architecture.json`](data/product-architecture.json)
- [`data/executive-chefs.json`](data/executive-chefs.json)
- [`docs/BRAND-ARCHITECTURE.md`](docs/BRAND-ARCHITECTURE.md)
- [`docs/LAUNCH-ROADMAP.md`](docs/LAUNCH-ROADMAP.md)
- [`website/`](website/)
- [`registry/`](registry/)

## Collectibles boundary

DevNFTs are a post-launch participation and provenance layer. The existing 112-character collectible metadata supply remains separate from the curated 75-agent commercial launch roster. Registry manifests remain excluded from collectible token IDs.

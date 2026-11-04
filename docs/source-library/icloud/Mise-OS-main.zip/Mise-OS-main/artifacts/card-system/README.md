# MiseOS Collectible Workflow Card System

MiseOS cards are original collectible workflow profiles for the 75-agent brigade. They are not a clone of any existing card game. The system uses its own visual language: culinary orchestration, chef operators, deployment loops, infrastructure symbols, and readable development actions.

## Purpose

Each character card answers five development questions:

1. Who is this operator?
2. What development workflow does this operator own?
3. What single-player action can I run with this card?
4. What tool or deployment move does it represent?
5. How should the card look as original MiseOS collectible art?

## Customer catalog

The dashboard now includes a customer-facing card browser:

```text
/cards
```

The catalog shows every brigade operator as a card with:

- Mascot art
- Card ID
- Rarity label
- Level
- Brigade
- Role
- Workflow focus
- Primary tool
- Lore
- Active ability
- Ultimate move
- Six workflow stats
- Single-player command
- Media slots for image, video, 3D model, audio, and AR extensions

## Core design rules

- Use the MiseOS palette and brigade accents.
- Keep all characters, abilities, card frames, and symbols original.
- Avoid third-party franchise names, trade dress, move names, or near-copy visual language.
- Treat NFT/provenance usage as optional ownership/audit metadata only.
- Do not use investment, resale, rarity-value, or financial-return claims.

## Card anatomy

| Zone | Purpose |
|---|---|
| Header | Card ID, rarity, agent name, brigade, and workflow element. |
| Portrait | Mascot art or generated original character art. |
| Role strip | Role, archetype, temperament, and primary tool. |
| Abilities | Passive, active, and ultimate deployment move. |
| Stats | Orchestration, build, runtime, security, insight, and stamina. |
| Command | Single-player CLI-style deployment action. |
| Media slots | Optional image, animation, 3D model, audio, and AR asset references. |
| Provenance note | Optional metadata for collectible identity and asset lineage. |

## Rarity language

Rarity describes narrative and system importance, not market value.

| Rarity | Meaning |
|---|---|
| Core | Everyday workflow operator. |
| Rare | Specialized workflow card. |
| Epic | High-leverage station operator. |
| Legendary | Foundational orchestration, authority, or sentinel card. |

## Single-player deployment loop

```text
Select card → Read action → Run solo command → Validate artifact → Emit report → Commit or handoff
```

Example:

```bash
mise card run kurogami --mode strategic-control --solo --emit report
```

## Data sources

- `artifacts/dashboard/src/lib/brigade-data.ts` remains the canonical visual roster.
- `artifacts/dashboard/src/lib/brigade-card-system.ts` extends every agent into a full collectible workflow profile.
- `artifacts/dashboard/src/lib/brigade-card-metadata.ts` converts every profile into customer-facing collectible metadata.
- `artifacts/dashboard/src/pages/cards.tsx` renders the customer-facing card catalog.
- `artifacts/card-system/miseos-card-template.svg` provides the original card-frame graphic.

## Graphics implementation

The included SVG card template is intentionally original:

```text
artifacts/card-system/miseos-card-template.svg
```

Use it as a frame for generated mascot art, profile pages, or GitHub Pages gallery cards.

## Optional collectible/provenance metadata

If these cards become tokenized collectibles, keep the metadata focused on authorship, asset identity, and version lineage.

Recommended fields:

```json
{
  "name": "MiseOS Card - Kurogami",
  "collection": "MiseOS Brigade Cards",
  "card_id": "MO-002",
  "role": "Master Strategist",
  "workflow_focus": "Strategic Control",
  "asset_version": "v1",
  "media": {
    "image": "ipfs://miseos-brigade-cards/images/kurogami.png",
    "animation": "ipfs://miseos-brigade-cards/animations/kurogami.mp4",
    "model3d": "ipfs://miseos-brigade-cards/models/kurogami.glb",
    "audio": "ipfs://miseos-brigade-cards/audio/kurogami.mp3",
    "ar": "ipfs://miseos-brigade-cards/ar/kurogami.usdz"
  },
  "license_note": "Original MiseOS character and card frame. No third-party franchise assets."
}
```

Do not include price, appreciation, investment, guaranteed scarcity, or resale language.

## Card generation prompt pattern

```text
Original MiseOS collectible workflow card for {name}, {role}, {brigade} brigade,
chef-inspired operator outfit, {workflowFocus} symbols, premium black cream gold
card frame, no third-party franchise styling, no copyrighted character references.
```

## Files

```text
artifacts/dashboard/src/lib/brigade-card-system.ts
artifacts/dashboard/src/lib/brigade-card-metadata.ts
artifacts/dashboard/src/pages/cards.tsx
artifacts/card-system/README.md
artifacts/card-system/miseos-card-template.svg
```

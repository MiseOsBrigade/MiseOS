# MiseOS 3D Character Collectible Carousel

> A GitHub-compatible showcase for approved MiseOS 3D collectible cards.
>
> **Proof rule:** image, model, and metadata links remain marked `pending` until the corresponding repository asset exists and passes validation.

## Visual system

Every card in this collection follows the supplied MiseOS card references:

- dimensional chibi or mascot-style character render;
- black, gold, celestial, and house-specific accent palette;
- embossed metallic frame and readable title plate;
- MiseOS or Mise Orchestra branding integrated into the card face;
- rarity, type, stats, role, and proof-oriented iconography;
- canonical image, GLB, card, and metadata paths.

## Asset contract

```text
media/images/3d/<group>/<slug>/hero.webp
media/models/3d/<group>/<slug>/<slug>.glb
cards/3d/<group>/<slug>.md
metadata/3d/<group>/<slug>.json
```

## Character agents

<table>
<tr>
<td width="33%" valign="top" align="center">
<img src="../media/images/3d/agents/shift-sentinel/hero.webp" width="240" alt="Shift Sentinel 3D collectible"><br>
<strong>Shift Sentinel</strong><br>
<sub>We watch. We protect. We prepare. We pass it on.</sub><br>
<code>media/models/3d/agents/shift-sentinel/shift-sentinel.glb</code><br>
<em>Asset status: pending repository upload</em>
</td>
<td width="33%" valign="top" align="center">
<img src="../media/images/3d/agents/release-sentinel/hero.webp" width="240" alt="MiseOS Release Sentinel 3D collectible"><br>
<strong>MiseOS Release Sentinel</strong><br>
<sub>I verify. I protect. I launch with purpose.</sub><br>
<code>media/models/3d/agents/release-sentinel/release-sentinel.glb</code><br>
<em>Asset status: pending repository upload</em>
</td>
<td width="33%" valign="top" align="center">
<img src="../media/images/3d/agents/repo-steward/hero.webp" width="240" alt="MiseOS Repo Steward 3D collectible"><br>
<strong>MiseOS Repo Steward</strong><br>
<sub>Keeper of history. Guardian of integrity. Steward of every commit.</sub><br>
<code>media/models/3d/agents/repo-steward/repo-steward.glb</code><br>
<em>Asset status: pending repository upload</em>
</td>
</tr>
</table>

## Registry and foundational cards

> These are product, schema, package, or theme collectibles. They do **not** increase the canonical character-agent count.

<table>
<tr>
<td width="33%" valign="top" align="center">
<img src="../media/images/3d/registry/maven-policy-adapter/hero.webp" width="240" alt="MiseOS Maven Policy Adapter 3D collectible"><br>
<strong>MiseOS Maven Policy Adapter</strong><br>
<sub>I adapt policies. I unify intent.</sub><br>
<code>media/models/3d/registry/maven-policy-adapter/maven-policy-adapter.glb</code><br>
<em>Type: Package · Asset status: pending</em>
</td>
<td width="33%" valign="top" align="center">
<img src="../media/images/3d/registry/registry-schema/hero.webp" width="240" alt="MiseOS Registry Schema 3D collectible"><br>
<strong>MiseOS Registry Schema</strong><br>
<sub>Defines all that exists. Connects all that relates.</sub><br>
<code>media/models/3d/registry/registry-schema/registry-schema.glb</code><br>
<em>Type: Schema · Asset status: pending</em>
</td>
<td width="33%" valign="top" align="center">
<img src="../media/images/3d/registry/orchestra-theme/hero.webp" width="240" alt="Mise Orchestra Theme 3D collectible"><br>
<strong>Mise Orchestra Theme</strong><br>
<sub>One theme. One language. One orchestra.</sub><br>
<code>media/models/3d/registry/orchestra-theme/orchestra-theme.glb</code><br>
<em>Type: Theme · Asset status: pending</em>
</td>
</tr>
</table>

## Companion collectibles

<table>
<tr>
<td width="33%" valign="top" align="center">
<img src="../media/images/3d/companions/repo-pet/hero.webp" width="240" alt="MiseOS Repo Pet 3D collectible"><br>
<strong>MiseOS Repo Pet</strong><br>
<sub>I guard the code. I nurture the source. I am always here.</sub><br>
<code>media/models/3d/companions/repo-pet/repo-pet.glb</code><br>
<em>Type: Repository Familiar · Asset status: pending</em>
</td>
</tr>
</table>

## Culinary brigade

<table>
<tr>
<td width="33%" valign="top" align="center">
<img src="../media/images/3d/culinary/sear-samurai/hero.webp" width="240" alt="Sear Samurai 3D collectible"><br>
<strong>Sear Samurai</strong><br>
<sub>Sear. Strike. Savor. Repeat.</sub><br>
<code>media/models/3d/culinary/sear-samurai/sear-samurai.glb</code><br>
<em>Class: Grillardin · Asset status: pending</em>
</td>
<td width="33%" valign="top" align="center">
<img src="../media/images/3d/culinary/scale-oni/hero.webp" width="240" alt="Scale Oni 3D collectible"><br>
<strong>Scale Oni</strong><br>
<sub>Maximum yield. Maximum glory.</sub><br>
<code>media/models/3d/culinary/scale-oni/scale-oni.glb</code><br>
<em>Class: Rotisseur · Asset status: pending</em>
</td>
<td width="33%" valign="top" align="center">
<img src="../media/images/3d/culinary/garnish-ghost/hero.webp" width="240" alt="Garnish Ghost 3D collectible"><br>
<strong>Garnish Ghost</strong><br>
<sub>The final touch turns preparation into presentation.</sub><br>
<code>media/models/3d/culinary/garnish-ghost/garnish-ghost.glb</code><br>
<em>Class: Finisher · Asset status: pending</em>
</td>
</tr>
</table>

## Canonical expansion target

The repository currently exposes 75 named demonstration characters in `characters.html`, while the canonical model calls for 112 character cards and 23 separate registry manifests.

The full carousel should expand only from validated roster data. Do not invent the remaining 37 identities, duplicate registry products as characters, or advertise placeholder media as live.

## Required validation

Before a card is marked complete:

1. The name and slug are unique.
2. The group matches the canonical ecosystem type.
3. The hero image exists and carries MiseOS/Mise Orchestra branding.
4. The GLB exists and opens successfully.
5. The metadata points to the exact versioned assets.
6. Rights and license notes are present.
7. Placeholder paths are not minted, sold, or described as deployed.

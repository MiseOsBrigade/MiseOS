<div align="center">

<img src="../attached_assets/IMG_4464_1782387273468.png" width="640" alt="Mise Orchestra logo — Cook. Orchestrate. Deploy." />

# 🎨 MiseOS Design Board
### The visual identity, in one place

_This is the **design board** — palette, type, motion, logo, and the full mascot brigade. Reference it; don't reinvent it._

</div>

---

## 1 · Palette

The MiseOS world is **Umami Black** by night, **Broth Cream** by day, lit by a **Gold Ladle**.

| Swatch | Name | Hex | Role |
| :---: | --- | --- | --- |
| ![](https://img.shields.io/badge/-0E0F10?style=flat-square&color=0E0F10) | **Umami Black** | `#0E0F10` | Primary surface / ink |
| ![](https://img.shields.io/badge/-D4AF37?style=flat-square&color=D4AF37) | **Gold Ladle** | `#D4AF37` | Primary accent / brand |
| ![](https://img.shields.io/badge/-F6F1E7?style=flat-square&color=F6F1E7) | **Broth Cream** | `#F6F1E7` | Light surface / paper |
| ![](https://img.shields.io/badge/-E97B22?style=flat-square&color=E97B22) | **Flame Orange** | `#E97B22` | Energy / heat / CTAs |
| ![](https://img.shields.io/badge/-182A41?style=flat-square&color=182A41) | **Ink Blue** | `#182A41` | Depth / secondary |
| ![](https://img.shields.io/badge/-2E8B4E?style=flat-square&color=2E8B4E) | **Matcha Green** | `#2E8B4E` | Success / flow |

### Brigade accents

Each of the seven brigades owns one accent. Use it for that brigade's folder, mascots, and UI.

| ![](https://img.shields.io/badge/-D4AF37?style=flat-square&color=D4AF37) `#D4AF37` | ![](https://img.shields.io/badge/-E97B22?style=flat-square&color=E97B22) `#E97B22` | ![](https://img.shields.io/badge/-2E8B4E?style=flat-square&color=2E8B4E) `#2E8B4E` | ![](https://img.shields.io/badge/-5B8DEF?style=flat-square&color=5B8DEF) `#5B8DEF` | ![](https://img.shields.io/badge/-E5564B?style=flat-square&color=E5564B) `#E5564B` | ![](https://img.shields.io/badge/-26B6A6?style=flat-square&color=26B6A6) `#26B6A6` | ![](https://img.shields.io/badge/-A98BE0?style=flat-square&color=A98BE0) `#A98BE0` |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Executive | Kitchen Ops | Service | Engineering | Security | Platform | Ecosystem |

## 2 · Typography

| Role | Typeface | Notes |
| --- | --- | --- |
| **Display / headings** | **Syne** | Geometric, characterful. The kitchen's voice. |
| **Body / UI** | **Inter** | Neutral, legible, hard-working. |
| **Code / data** | **Space Mono** | Monospace for grids, configs, and the terminal. |

```
Syne        →  75 specialized agents.
Inter       →  Everything in its place, before the fire is lit.
Space Mono  →  $ shemi . --max-depth=6 --tick=650
```

## 3 · Logo & lockup

- Primary lockup: the **Mise Orchestra** wordmark with the gold-ladle chef rising from the broth (above).
- Crest: a single **cherry-blossom** in Gold Ladle on Umami Black.
- Seal: **調和の技** — _the craft of harmony_.
- Tagline lockup: **Cook. Orchestrate. Deploy.**

## 4 · Motion & 3D

MiseOS is a moving brand. The launch film and the 75-variant orchestra are built
with **React Three Fiber + Framer Motion + GSAP** (see `artifacts/launch-film` and
`artifacts/mise-orchestra`).

- **Easing:** confident, never bouncy. Steam rises; it doesn't spring.
- **Hero motion:** broth swirl + gold filaments + the ladle pour.
- **3D:** depth via subtle parallax and volumetric light, not gratuitous spin.

## 5 · The brigade — 75 mascots, 7 stations

> Mascot art is git-tracked at `attached_assets/miseos_agents/<folder>/<Name>.png` (transparent PNGs).

### 01 · Executive Chefs &nbsp;`#D4AF37` — _Leadership & Orchestration_

<p>
<img src="../attached_assets/miseos_agents/01_executive_chefs/Orchestra-Core.png" width="96" alt="Orchestra Core" />
<img src="../attached_assets/miseos_agents/01_executive_chefs/Kurogami.png" width="96" alt="Kurogami" />
<img src="../attached_assets/miseos_agents/01_executive_chefs/Conductor.png" width="96" alt="Conductor" />
<img src="../attached_assets/miseos_agents/01_executive_chefs/Seira.png" width="96" alt="Seira" />
<img src="../attached_assets/miseos_agents/01_executive_chefs/Root-Chef.png" width="96" alt="Root Chef" />
</p>

### 02 · Kitchen Operations &nbsp;`#E97B22` — _Build · Schedule · Dispatch_

<p>
<img src="../attached_assets/miseos_agents/02_kitchen_operations/Build-Kun.png" width="96" alt="Build Kun" />
<img src="../attached_assets/miseos_agents/02_kitchen_operations/PrepBot.png" width="96" alt="PrepBot" />
<img src="../attached_assets/miseos_agents/02_kitchen_operations/Scale-Oni.png" width="96" alt="Scale Oni" />
<img src="../attached_assets/miseos_agents/02_kitchen_operations/Kaji.png" width="96" alt="Kaji" />
<img src="../attached_assets/miseos_agents/02_kitchen_operations/Scheduler.png" width="96" alt="Scheduler" />
</p>

### 03 · Service Layer &nbsp;`#2E8B4E` — _Runtime · Cache · Delivery_

<p>
<img src="../attached_assets/miseos_agents/03_service_layer/Umami-Code.png" width="96" alt="Umami Code" />
<img src="../attached_assets/miseos_agents/03_service_layer/Cache-Cat.png" width="96" alt="Cache Cat" />
<img src="../attached_assets/miseos_agents/03_service_layer/Flash-Riku.png" width="96" alt="Flash Riku" />
<img src="../attached_assets/miseos_agents/03_service_layer/Relay-Fox.png" width="96" alt="Relay Fox" />
<img src="../attached_assets/miseos_agents/03_service_layer/Streama.png" width="96" alt="Streama" />
</p>

### 04 · Engineering & Development &nbsp;`#5B8DEF` — _Code · Test · Review_

<p>
<img src="../attached_assets/miseos_agents/04_engineering/Architect.png" width="96" alt="Architect" />
<img src="../attached_assets/miseos_agents/04_engineering/Coder.png" width="96" alt="Coder" />
<img src="../attached_assets/miseos_agents/04_engineering/Reviewer.png" width="96" alt="Reviewer" />
<img src="../attached_assets/miseos_agents/04_engineering/UX-Chef.png" width="96" alt="UX Chef" />
<img src="../attached_assets/miseos_agents/04_engineering/Doc-Writer.png" width="96" alt="Doc Writer" />
</p>

### 05 · Security & Quality &nbsp;`#E5564B` — _Guard · Audit · Comply_

<p>
<img src="../attached_assets/miseos_agents/05_security/Firewall.png" width="96" alt="Firewall" />
<img src="../attached_assets/miseos_agents/05_security/Encryptor.png" width="96" alt="Encryptor" />
<img src="../attached_assets/miseos_agents/05_security/Security-Auditor.png" width="96" alt="Security Auditor" />
<img src="../attached_assets/miseos_agents/05_security/Vault-Link.png" width="96" alt="Vault Link" />
<img src="../attached_assets/miseos_agents/05_security/Scanner.png" width="96" alt="Scanner" />
</p>

### 06 · Platform & Infrastructure &nbsp;`#26B6A6` — _Compute · Storage · Observe_

<p>
<img src="../attached_assets/miseos_agents/06_platform_infra/Cloud-Chef.png" width="96" alt="Cloud Chef" />
<img src="../attached_assets/miseos_agents/06_platform_infra/Database.png" width="96" alt="Database" />
<img src="../attached_assets/miseos_agents/06_platform_infra/Storage.png" width="96" alt="Storage" />
<img src="../attached_assets/miseos_agents/06_platform_infra/Observatory.png" width="96" alt="Observatory" />
<img src="../attached_assets/miseos_agents/06_platform_infra/Pipeline.png" width="96" alt="Pipeline" />
</p>

### 07 · Integrations & Ecosystem &nbsp;`#A98BE0` — _Connect · Deploy · Extend_

<p>
<img src="../attached_assets/miseos_agents/07_ecosystem/GitHub-Chef.png" width="96" alt="GitHub Chef" />
<img src="../attached_assets/miseos_agents/07_ecosystem/Docker.png" width="96" alt="Docker" />
<img src="../attached_assets/miseos_agents/07_ecosystem/Kubernetes.png" width="96" alt="Kubernetes" />
<img src="../attached_assets/miseos_agents/07_ecosystem/Terraformer.png" width="96" alt="Terraformer" />
<img src="../attached_assets/miseos_agents/07_ecosystem/Community-Rep.png" width="96" alt="Community Rep" />
</p>

> The canonical machine-readable roster (all 75, with roles) lives in
> [`artifacts/dashboard/src/lib/brigade-data.ts`](../artifacts/dashboard/src/lib/brigade-data.ts).

<div align="center">

---

<sub><b>MiseOS Design Board</b> · Cook. Orchestrate. Deploy.</sub>

</div>

# Mise Orchestra Visual Asset Pack

Mise Orchestra is the visual identity layer for the Mise OS profile and future GitHub Pages launchers. The system combines culinary craft, orchestration language, anime-style chef operators, and operational infrastructure metaphors.

## Asset intent

| Asset group | Purpose | Recommended use |
|---|---|---|
| Hero lockups | Establish the Mise Orchestra identity quickly. | README hero, GitHub Pages landing sections, presentation covers. |
| Mascot / chef operator art | Give the system a memorable character layer. | Agent cards, repo roamer docs, department pages. |
| Department boards | Show the orchestration model as teams and stations. | Architecture docs, onboarding, social previews. |
| Brand boards | Preserve logo, palette, icon, and usage rules. | Design handoff, future repo templates, README brand references. |

## Working visual language

- **Core metaphor:** a kitchen orchestra where every role contributes to one coordinated system.
- **Operating loop:** Prepare → Cook → Orchestrate → Deploy → Scale.
- **Primary palette:** Umami Black `#0E0F10`, Broth Cream `#F6F1E7`, Gold Ladle `#D4AF37`.
- **Secondary palette:** Flame Orange `#E97822`, Ink Blue `#1B2A41`, Matcha Green `#2E6B4E`.
- **Typography direction:** Sora Bold for headings, Nunito Sans Regular for readable UI/body text.
- **Style tags:** premium culinary, orchestral systems, anime operator cards, GitHub-ready docs hub.

## Uploaded asset map

| Source upload | Suggested repo filename | Description |
|---|---|---|
| `A8D7F1E5-AA1E-4081-A726-0F33BCC88B4A.jpeg` | `kurogami-senpai-chibi.jpg` | Chibi chef operator holding the gold ladle baton. |
| `0B8B9BE1-645F-4F34-8EA1-5F9504D793C9.jpeg` | `mise-orchestra-hero-square.jpg` | Square hero composition with conductor silhouette and service icons. |
| `BDA8316D-57DF-49DC-8278-FE486B68154C.jpeg` | `mise-orchestra-logo-square.jpg` | Clean logo lockup with ladle baton and musical staff. |
| `B194B277-7672-4710-86EF-EF464E886A59.jpeg` | `kurogami-senpai-signature.jpg` | Chibi chef operator with MiseOS signature mark. |
| `E6EF165D-E1BB-41AF-B218-9C661D8AE4D1.jpeg` | `security-infrastructure-departments.jpg` | Security and infrastructure department operator cards. |
| `4507D579-2D15-402E-961B-FA6986856507.jpeg` | `department-grid-core.jpg` | Pipeline, operations, platform, reliability, and insight departments. |
| `D5DCE6B6-572E-41BC-85CC-987F8530073C.jpeg` | `pipeline-character-sheet.jpg` | Pipeline department character lineup and role notes. |
| `88D42411-377D-431D-884C-B690B1E13888.png` | `mise-orchestra-brand-board.png` | Logo, typography, color palette, and pictogram board. |
| `3C9EB5BD-F044-44C8-8249-8306FAF972F8.jpeg` | `mise-orchestra-hero-wide.jpg` | Wide hero banner for profile and landing pages. |
| `1E102A56-1210-48CB-93CC-E7B965AA8DD3.jpeg` | `mise-orchestra-brand-guidelines.jpg` | Full usage board with lockups, color, clear space, and examples. |

## Implementation pattern

When binary asset upload is available, place optimized web assets here:

```text
profile/assets/mise-orchestra/
├── kurogami-senpai-chibi.jpg
├── mise-orchestra-hero-square.jpg
├── mise-orchestra-logo-square.jpg
├── kurogami-senpai-signature.jpg
├── security-infrastructure-departments.jpg
├── department-grid-core.jpg
├── pipeline-character-sheet.jpg
├── mise-orchestra-brand-board.png
├── mise-orchestra-hero-wide.jpg
└── mise-orchestra-brand-guidelines.jpg
```

Then reference the hero from the organization profile README:

```md
<p align="center">
  <img src="./assets/mise-orchestra/mise-orchestra-hero-wide.jpg" alt="Mise Orchestra hero banner" width="100%" />
</p>
```

## Fork-friendly rules

1. Keep the README lightweight and launcher-focused.
2. Store the live/animated experience in GitHub Pages HTML.
3. Keep visual assets optimized for web delivery.
4. Use original characters, symbols, and names.
5. Document each asset so downstream forks understand how to customize it.

## Next build target

Create a GitHub Pages visual gallery at:

```text
profile/templates/mise-orchestra/index.html
```

The gallery should include the hero banner, brand board, department boards, and an implementation guide for forks.

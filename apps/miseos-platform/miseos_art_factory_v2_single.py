#!/usr/bin/env python3
"""Build and verify the separated MiseOS ecosystem catalogs.

The character roster and registry product catalog are intentionally different
domains:

- 112 character agents: collectible/mascot/operator cards.
- 23 registry manifests: SDKs, packages, containers, schemas, policies,
  workflow packs, analytics tools, system agents, templates, and themes.

Never concatenate the two sources.
"""
from __future__ import annotations

import argparse
import csv
import json
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List

ROOT = Path(__file__).resolve().parent
INPUT_DIR = ROOT / "input"
OUTPUT_DIR = ROOT / "output"
MANIFESTS_DIR = OUTPUT_DIR / "manifests"
REGISTRY_DIR = ROOT / "registry"

CHARACTERS_JSON = INPUT_DIR / "characters.generated.json"
CARDS_CSV_PATH = INPUT_DIR / "mise_orchestra_cards.csv"
REGISTRY_SOURCE = REGISTRY_DIR / "registry-catalog.manifest.json"

ROSTER_OUT = OUTPUT_DIR / "merged_roster.json"
REGISTRY_OUT = MANIFESTS_DIR / "registry_catalog_manifest.json"
REGISTRY_MD = MANIFESTS_DIR / "REGISTRY_CATALOG.md"

OFFICIAL_CHARACTER_CARD_COUNT = 112
OFFICIAL_REGISTRY_MANIFEST_COUNT = 23
OFFICIAL_ECOSYSTEM_ITEM_COUNT = 135
OFFICIAL_LANGUAGE = (
    "112 character agents + 23 registry manifests = "
    "135 MiseOS ecosystem items."
)


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def ensure_dirs() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    MANIFESTS_DIR.mkdir(parents=True, exist_ok=True)
    REGISTRY_DIR.mkdir(parents=True, exist_ok=True)
    (ROOT / ".github" / "profile").mkdir(parents=True, exist_ok=True)


def clean(value: Any) -> str:
    return str(value or "").strip()


def read_json(path: Path, default: Any) -> Any:
    if not path.exists():
        return default
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(value, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def csv_rows(path: Path) -> List[Dict[str, str]]:
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        return [dict(row) for row in csv.DictReader(handle)]


def dedupe(items: Iterable[Dict[str, Any]], key: str) -> List[Dict[str, Any]]:
    seen: set[str] = set()
    result: List[Dict[str, Any]] = []
    for item in items:
        value = clean(item.get(key)).casefold()
        if not value or value in seen:
            continue
        seen.add(value)
        result.append(item)
    return result


def load_roster() -> List[Dict[str, Any]]:
    """Load character-card records only.

    Registry metadata is never read by this function.
    """
    roster: List[Dict[str, Any]] = []

    source = read_json(CHARACTERS_JSON, [])
    if isinstance(source, dict):
        source = (
            source.get("characters")
            or source.get("agents")
            or source.get("cards")
            or source.get("items")
            or []
        )
    if isinstance(source, list):
        roster.extend(item for item in source if isinstance(item, dict))

    for row in csv_rows(CARDS_CSV_PATH):
        name = clean(row.get("name") or row.get("Name"))
        if not name:
            continue
        roster.append(
            {
                "id": clean(row.get("id") or row.get("ID"))
                or name.lower().replace(" ", "-"),
                "name": name,
                "role": clean(row.get("role") or row.get("Role")),
                "department": clean(
                    row.get("department") or row.get("Department")
                ),
                "rarity": clean(row.get("rarity") or row.get("Rarity"))
                or "Common",
                "source": CARDS_CSV_PATH.name,
            }
        )

    normalized: List[Dict[str, Any]] = []
    for item in roster:
        name = clean(item.get("name") or item.get("display_name"))
        if not name:
            continue
        normalized.append(
            {
                **item,
                "name": name,
                "record_kind": "character_card",
            }
        )
    return dedupe(normalized, "name")


# Backward-compatible name for callers using the previous script API.
load_character_roster = load_roster


def load_registry_catalog() -> List[Dict[str, str]]:
    """Load product infrastructure only from the canonical registry manifest."""
    source = read_json(REGISTRY_SOURCE, {})
    if not isinstance(source, dict):
        raise SystemExit(f"Registry source must be a JSON object: {REGISTRY_SOURCE}")

    rows = source.get("items")
    if not isinstance(rows, list):
        raise SystemExit(
            f"Registry source must contain an items array: {REGISTRY_SOURCE}"
        )

    registry: List[Dict[str, str]] = []
    for row in rows:
        if not isinstance(row, dict):
            continue
        registry_id = clean(row.get("registry_id"))
        name = clean(row.get("name"))
        item_type = clean(row.get("type"))
        if not registry_id or not name or not item_type:
            raise SystemExit(
                "Every registry manifest requires registry_id, name, and type."
            )
        registry.append(
            {
                "registry_id": registry_id,
                "name": name,
                "type": item_type,
                "record_kind": "registry_manifest",
            }
        )
    return dedupe(registry, "registry_id")


def validate_separation(
    roster: List[Dict[str, Any]],
    registry: List[Dict[str, str]],
    *,
    require_complete_roster: bool,
) -> None:
    errors: List[str] = []

    if len(registry) != OFFICIAL_REGISTRY_MANIFEST_COUNT:
        errors.append(
            f"registry count is {len(registry)}, "
            f"expected {OFFICIAL_REGISTRY_MANIFEST_COUNT}"
        )
    if len(registry) + OFFICIAL_CHARACTER_CARD_COUNT != OFFICIAL_ECOSYSTEM_ITEM_COUNT:
        errors.append("official ecosystem arithmetic is inconsistent")

    registry_ids = [clean(item.get("registry_id")) for item in registry]
    if len(registry_ids) != len(set(registry_ids)):
        errors.append("registry IDs are not unique")
    if any(item.get("record_kind") != "registry_manifest" for item in registry):
        errors.append("registry catalog contains a non-registry record")
    if any("character_id" in item or "rarity" in item for item in registry):
        errors.append("character-card fields leaked into the registry catalog")

    if any(item.get("record_kind") != "character_card" for item in roster):
        errors.append("character roster contains a non-character record")
    if any("registry_id" in item for item in roster):
        errors.append("registry manifest leaked into character roster")

    if require_complete_roster and len(roster) != OFFICIAL_CHARACTER_CARD_COUNT:
        errors.append(
            f"character count is {len(roster)}, "
            f"expected {OFFICIAL_CHARACTER_CARD_COUNT}"
        )
    elif roster and len(roster) != OFFICIAL_CHARACTER_CARD_COUNT:
        errors.append(
            f"partial character roster detected: {len(roster)} records; "
            f"expected {OFFICIAL_CHARACTER_CARD_COUNT}"
        )

    if errors:
        raise SystemExit("Verification failed:\n- " + "\n- ".join(errors))


def write_roster(roster: List[Dict[str, Any]]) -> None:
    write_json(
        ROSTER_OUT,
        {
            "schema": "miseos.character.roster.v1",
            "created_at": now_iso(),
            "record_kind": "character_roster",
            "official_character_card_count": OFFICIAL_CHARACTER_CARD_COUNT,
            "actual_loaded_character_records": len(roster),
            "registry_manifest_count": 0,
            "language": OFFICIAL_LANGUAGE,
            "note": (
                "Character roster only. Registry/package manifests are stored "
                "in registry/registry-catalog.manifest.json."
            ),
            "items": roster,
        },
    )


def write_registry_catalog_manifest(
    registry: List[Dict[str, str]],
) -> None:
    type_counts = dict(sorted(Counter(item["type"] for item in registry).items()))
    write_json(
        REGISTRY_OUT,
        {
            "schema": "miseos.registry.catalog.v1",
            "created_at": now_iso(),
            "record_kind": "registry_manifest_catalog",
            "character_cards": OFFICIAL_CHARACTER_CARD_COUNT,
            "total_registry_manifests": len(registry),
            "total_ecosystem_items": (
                OFFICIAL_CHARACTER_CARD_COUNT + len(registry)
            ),
            "language": OFFICIAL_LANGUAGE,
            "separation_rule": (
                "Registry manifests are product infrastructure, not "
                "character cards."
            ),
            "type_counts": type_counts,
            "items": registry,
        },
    )

    lines = [
        "# MiseOS Registry Catalog",
        "",
        "> **Product infrastructure only. These 23 manifests are not "
        "character cards.**",
        "",
        "## Official Ecosystem Model",
        "",
        f"- Character agents: **{OFFICIAL_CHARACTER_CARD_COUNT}**",
        f"- Registry manifests: **{len(registry)}**",
        "- Total ecosystem items: "
        f"**{OFFICIAL_CHARACTER_CARD_COUNT + len(registry)}**",
        "",
        f"`{OFFICIAL_LANGUAGE}`",
        "",
        "Character records belong in the character roster and collectible-card "
        "metadata. Registry records belong in product, package, marketplace, "
        "workflow, policy, schema, and infrastructure metadata.",
        "",
        "## Catalog",
        "",
        "| # | Registry ID | Name | Type | Record kind |",
        "|---:|---|---|---|---|",
    ]
    for index, item in enumerate(registry, start=1):
        lines.append(
            f"| {index} | `{item['registry_id']}` | {item['name']} | "
            f"{item['type']} | `registry_manifest` |"
        )

    lines.extend(
        [
            "",
            "## Required Language",
            "",
            "Use: **112 character agents + 23 registry manifests = 135 "
            "MiseOS ecosystem items.**",
            "",
            "Do not describe the ecosystem as **135 characters**.",
        ]
    )
    REGISTRY_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_org_profile() -> None:
    profile = f"""# Mise-OS

**Everything in its place before it ships.**

MiseOS is the Git-native operating system for coordinated development, repo stewardship, automation, and ethical AI workflows.

## Official Ecosystem Model

| Layer | Count | Purpose |
|---|---:|---|
| Character agents | 112 | Collectible operators with roles, departments, rarity, lore, workflows, and bounded permissions |
| Registry manifests | 23 | SDKs, packages, containers, schemas, policies, analytics, workflows, templates, themes, and system tools |
| Total ecosystem items | 135 | One coordinated, repo-safe development ecosystem |

> {OFFICIAL_LANGUAGE}

Registry manifests are product infrastructure. They are never counted or marketed as character cards.

## What MiseOS Builds

- Repo-safe AI agents and GitHub automation
- Agent SDKs, CLIs, policy engines, and workflow packs
- MCP connectors and governed tool access
- Release, reliability, evidence, and security systems
- Character cards, lore, galleries, and community experiences

## Product Line

```text
Community      → open-source starter tools and documentation
Pro            → hosted repo-safe development tools
Team           → GitHub App, policy packs, MCP connectors
Enterprise     → self-hosted runtime, governance, audit, private deployment
```

MiseOS turns autonomous development into coordinated service: every agent has a station, every workflow has guardrails, and every release leaves evidence.
"""
    (ROOT / ".github" / "profile" / "README.md").write_text(
        profile,
        encoding="utf-8",
    )


def cmd_catalog() -> None:
    ensure_dirs()
    registry = load_registry_catalog()
    validate_separation([], registry, require_complete_roster=False)
    write_registry_catalog_manifest(registry)
    write_org_profile()
    print(
        "[catalog] "
        f"character_agents={OFFICIAL_CHARACTER_CARD_COUNT} "
        f"registry_manifests={len(registry)} "
        f"ecosystem_items={OFFICIAL_CHARACTER_CARD_COUNT + len(registry)}"
    )


def cmd_prepare() -> None:
    ensure_dirs()
    roster = load_roster()
    registry = load_registry_catalog()
    validate_separation(roster, registry, require_complete_roster=True)
    write_roster(roster)
    write_registry_catalog_manifest(registry)
    write_org_profile()
    print(
        "[prepare] "
        f"character_agents={len(roster)} "
        f"registry_manifests={len(registry)} "
        f"ecosystem_items={len(roster) + len(registry)}"
    )


def cmd_verify(require_complete_roster: bool) -> None:
    ensure_dirs()
    roster = load_roster()
    registry = load_registry_catalog()
    validate_separation(
        roster,
        registry,
        require_complete_roster=require_complete_roster,
    )
    print(
        "[verify] "
        f"characters_loaded={len(roster)} "
        f"registry_manifests={len(registry)} "
        "official_model=112+23=135"
    )


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="MiseOS character/registry separation utility"
    )
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser(
        "catalog",
        help="Rebuild the 23-item registry catalog and organization profile",
    )
    sub.add_parser(
        "prepare",
        help="Build outputs; requires a complete 112-character roster",
    )
    verify_parser = sub.add_parser(
        "verify",
        help="Verify catalog boundaries and record types",
    )
    verify_parser.add_argument(
        "--require-complete-roster",
        action="store_true",
        help="Fail unless exactly 112 character records are loaded",
    )
    return parser


def main() -> None:
    args = build_parser().parse_args()
    if args.command == "catalog":
        cmd_catalog()
    elif args.command == "prepare":
        cmd_prepare()
    elif args.command == "verify":
        cmd_verify(args.require_complete_roster)


if __name__ == "__main__":
    main()

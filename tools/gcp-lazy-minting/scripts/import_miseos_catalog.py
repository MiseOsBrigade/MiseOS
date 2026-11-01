#!/usr/bin/env python3
"""Convert the MiseOS cards catalog into metadata sidecar files."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def attributes(card: dict) -> list[dict]:
    keys = [
        ("Department", "department"),
        ("Role", "role"),
        ("Rarity", "rarity"),
        ("Level", "level"),
        ("Power", "power"),
        ("Precision", "precision"),
        ("Speed", "speed"),
        ("Resilience", "resilience"),
        ("Intelligence", "intelligence"),
        ("Teamwork", "teamwork"),
    ]
    result = []
    for trait_type, key in keys:
        value = card.get(key)
        if value is not None and value != "":
            result.append({"trait_type": trait_type, "value": value})
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("catalog", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    cards = json.loads(args.catalog.read_text(encoding="utf-8"))
    if not isinstance(cards, list):
        raise SystemExit("Expected a JSON array")

    args.output.mkdir(parents=True, exist_ok=True)
    for card in cards:
        token_id = int(card["number"])
        slug = card["slug"]
        sidecar = {
            "schema": "miseos.metadata.override.v1",
            "name": card["name"],
            "description": (
                f"{card['name']} is a MiseOS {card.get('role', 'agent')} "
                f"in the {card.get('department', 'MiseOS')} department."
            ),
            "external_url": f"https://miseos.example/characters/{slug}",
            "record_kind": card.get("record_kind", "character_card"),
            "attributes": attributes(card),
        }
        destination = args.output / f"{token_id:03d}-{slug}.json"
        destination.write_text(
            json.dumps(sidecar, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )
    print(f"Wrote {len(cards)} sidecars to {args.output}")


if __name__ == "__main__":
    main()

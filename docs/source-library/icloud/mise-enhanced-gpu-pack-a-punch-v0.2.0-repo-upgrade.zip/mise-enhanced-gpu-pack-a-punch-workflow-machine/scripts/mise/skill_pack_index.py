#!/usr/bin/env python3
"""Index vendored skill packs for Mise Pack-a-Punch evidence reports.

This script is intentionally read-only. It scans SKILL.md and component YAML
metadata, then emits deterministic JSON and Markdown indexes that can be
uploaded as GitHub Actions artifacts.
"""
from __future__ import annotations

import argparse
import dataclasses
import hashlib
import json
from pathlib import Path
from typing import Iterable


@dataclasses.dataclass(frozen=True)
class SkillRecord:
    name: str
    path: str
    bytes: int
    sha256: str
    first_heading: str | None
    component: str | None = None


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def first_markdown_heading(path: Path) -> str | None:
    try:
        for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
            stripped = line.strip()
            if stripped.startswith("#"):
                return stripped.lstrip("#").strip() or None
    except OSError:
        return None
    return None


def scan_skills(root: Path) -> list[SkillRecord]:
    records: list[SkillRecord] = []
    for skill in sorted(root.rglob("SKILL.md")):
        rel = skill.relative_to(root).as_posix()
        name = skill.parent.name
        records.append(
            SkillRecord(
                name=name,
                path=rel,
                bytes=skill.stat().st_size,
                sha256=sha256_file(skill),
                first_heading=first_markdown_heading(skill),
            )
        )
    return records


def scan_components(root: Path) -> list[dict[str, str | int]]:
    components_dir = root / "components.d"
    items: list[dict[str, str | int]] = []
    if not components_dir.exists():
        return items
    for component in sorted(components_dir.glob("*.yml")) + sorted(components_dir.glob("*.yaml")):
        items.append(
            {
                "name": component.stem,
                "path": component.relative_to(root).as_posix(),
                "bytes": component.stat().st_size,
                "sha256": sha256_file(component),
            }
        )
    return items


def write_markdown(out: Path, skills: Iterable[SkillRecord], components: list[dict[str, str | int]]) -> None:
    skills = list(skills)
    lines = [
        "# Mise Skill Pack Index",
        "",
        "Generated from vendored skill metadata. This index is evidence only; it does not execute any skill code.",
        "",
        f"- Skills indexed: {len(skills)}",
        f"- Components indexed: {len(components)}",
        "",
        "## Skills",
        "",
        "| Skill | Path | SHA-256 |",
        "|---|---|---|",
    ]
    for item in skills:
        label = item.first_heading or item.name
        lines.append(f"| {label} | `{item.path}` | `{item.sha256[:16]}...` |")
    lines.extend(["", "## Components", "", "| Component | Path | SHA-256 |", "|---|---|---|"])
    for item in components:
        lines.append(f"| {item['name']} | `{item['path']}` | `{str(item['sha256'])[:16]}...` |")
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Index vendored Mise-compatible skill packs")
    parser.add_argument("--root", default="vendor/nv-skills", help="Skill-pack root directory")
    parser.add_argument("--out-dir", default=".mise_out", help="Output directory")
    parser.add_argument("--fail-on-empty", action="store_true", help="Exit non-zero if no skills are found")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    out_dir = Path(args.out_dir).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    if not root.exists():
        raise SystemExit(f"skill pack root not found: {root}")

    skills = scan_skills(root)
    components = scan_components(root)
    if args.fail_on_empty and not skills:
        raise SystemExit("no SKILL.md files found")

    payload = {
        "schema": "mise.skill-pack-index.v1",
        "root": str(root),
        "skill_count": len(skills),
        "component_count": len(components),
        "skills": [dataclasses.asdict(item) for item in skills],
        "components": components,
    }
    (out_dir / "skill-pack-index.json").write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    write_markdown(out_dir / "skill-pack-index.md", skills, components)
    print(json.dumps({"skill_count": len(skills), "component_count": len(components), "out_dir": str(out_dir)}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
"""Index vendored SKILL.md files and component manifests without executing them."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def first_heading(path: Path) -> str | None:
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        stripped = line.strip()
        if stripped.startswith("#"):
            return stripped.lstrip("#").strip() or None
    return None


def main() -> int:
    parser = argparse.ArgumentParser(description="Index a vendored Mise-compatible skill pack")
    parser.add_argument("--root", default="vendor/nv-skills")
    parser.add_argument("--out-dir", default=".mise_out")
    parser.add_argument("--fail-on-empty", action="store_true")
    args = parser.parse_args()

    root = Path(args.root)
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    if not root.exists():
        raise SystemExit(f"skill pack root not found: {root}")

    skills = []
    for path in sorted(root.rglob("SKILL.md")):
        skills.append({
            "name": path.parent.name,
            "path": path.relative_to(root).as_posix(),
            "bytes": path.stat().st_size,
            "sha256": sha256_file(path),
            "first_heading": first_heading(path),
        })

    components = []
    components_dir = root / "components.d"
    if components_dir.exists():
        for path in sorted(components_dir.glob("*.yml")) + sorted(components_dir.glob("*.yaml")):
            components.append({
                "name": path.stem,
                "path": path.relative_to(root).as_posix(),
                "bytes": path.stat().st_size,
                "sha256": sha256_file(path),
            })

    if not skills and not components:
        # Emit empty-but-valid index so workflow can proceed
        (out_dir / "skill-pack-index.json").write_text(
            json.dumps({"schema": "mise.skill-pack-index.v1", "root": str(root),
                        "skill_count": 0, "component_count": 0,
                        "skills": [], "components": [],
                        "note": "no skill files found in vendored directory"}, indent=2) + "\n",
            encoding="utf-8")
        (out_dir / "skill-pack-index.md").write_text(
            "# Mise Skill Pack Index\n\n**Warning:** No SKILL.md files found in vendored directory.\n"
            "Run `./apply-upgrade.sh` to populate `vendor/nv-skills/`.\n", encoding="utf-8")
        print(json.dumps({"skill_count": 0, "component_count": 0, "out_dir": str(out_dir), "status": "empty"}))
        return 0

    if args.fail_on_empty:
        raise SystemExit("no SKILL.md files found")

    payload = {
        "schema": "mise.skill-pack-index.v1",
        "root": str(root),
        "skill_count": len(skills),
        "component_count": len(components),
        "skills": skills,
        "components": components,
    }
    (out_dir / "skill-pack-index.json").write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")

    lines = [
        "# Mise Skill Pack Index",
        "",
        "Generated from vendored skill metadata. This index is evidence only; it does not execute skill code.",
        "",
        f"- Skills indexed: {len(skills)}",
        f"- Components indexed: {len(components)}",
        "",
        "| Skill | Path | SHA-256 |",
        "|---|---|---|",
    ]
    for item in skills:
        label = item["first_heading"] or item["name"]
        lines.append(f"| {label} | `{item['path']}` | `{item['sha256'][:16]}...` |")
    (out_dir / "skill-pack-index.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"skill_count": len(skills), "component_count": len(components), "out_dir": str(out_dir)}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

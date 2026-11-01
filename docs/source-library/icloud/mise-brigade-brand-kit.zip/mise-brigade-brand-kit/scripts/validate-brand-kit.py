#!/usr/bin/env python3
"""
Mise Brigade de Repo brand-token helper.

This helper prints the current brand tokens and validates required asset paths.
Run from the brand/ directory:

    python scripts/validate-brand-kit.py
"""
from __future__ import annotations

import json
from pathlib import Path

REQUIRED = [
    "assets/svg/logos/mise-brigade-logo-mark.svg",
    "assets/svg/logos/mise-brigade-horizontal.svg",
    "assets/svg/banners/readme-hero-banner.svg",
    "assets/svg/banners/social-card.svg",
    "assets/svg/tabs/tab-issues-review.svg",
    "assets/svg/tabs/tab-merge-pr.svg",
    "assets/svg/tabs/tab-branch-corrections.svg",
    "assets/svg/tabs/tab-comments-commits.svg",
    "assets/svg/tabs/tab-repo-clean.svg",
]

def main() -> int:
    root = Path.cwd()
    tokens = root / "brand.tokens.json"
    if not tokens.exists():
        raise SystemExit("brand.tokens.json not found. Run from the brand/ directory.")

    data = json.loads(tokens.read_text())
    missing = [path for path in REQUIRED if not (root / path).exists()]

    print(json.dumps({
        "name": data.get("name"),
        "system": data.get("system"),
        "theme": data.get("theme"),
        "missing_assets": missing,
        "status": "ok" if not missing else "missing-assets",
    }, indent=2))

    return 1 if missing else 0

if __name__ == "__main__":
    raise SystemExit(main())

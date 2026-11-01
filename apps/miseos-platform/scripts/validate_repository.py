#!/usr/bin/env python3
"""Deterministic repository validation for the static MiseOS prototype."""
from __future__ import annotations

import csv
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]

REQUIRED_FILES = [
    "README.md",
    "index.html",
    "characters.html",
    "mint.html",
    ".nojekyll",
    "config/commerce.catalog.json",
    "config/mint.json",
    "output/manifests/REGISTRY_CATALOG.md",
    "miseos_art_factory_v2_single.py",
]

# Sentinel files are required to exist but are intentionally empty (e.g. the
# GitHub Pages ".nojekyll" marker), so they are exempt from the non-empty check.
REQUIRED_SENTINELS = [
    ".nojekyll",
]


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def validate_required_files() -> None:
    for rel in REQUIRED_FILES:
        path = ROOT / rel
        if not path.is_file():
            fail(f"missing required file: {rel}")
        if rel not in REQUIRED_SENTINELS and path.stat().st_size == 0:
            fail(f"missing or empty required file: {rel}")


def validate_commerce() -> None:
    path = ROOT / "config/commerce.catalog.json"
    catalog = json.loads(path.read_text(encoding="utf-8"))
    products = catalog.get("products")
    if not isinstance(products, list) or len(products) < 4:
        fail("commerce catalog must define at least four products")
    keys = [item.get("key") for item in products]
    if len(keys) != len(set(keys)) or any(not key for key in keys):
        fail("commerce product keys must be present and unique")
    if catalog.get("mode") not in {"catalog_only", "sandbox", "production"}:
        fail("unsupported commerce mode")
    if catalog.get("mode") == "production" and catalog.get("billing_provider") == "unconfigured":
        fail("production commerce requires a configured billing provider")


def validate_mint() -> None:
    config = json.loads((ROOT / "config/mint.json").read_text(encoding="utf-8"))
    if config.get("paymentsEnabled"):
        for package in config.get("packages", []):
            url = str(package.get("checkoutUrl", ""))
            if not url.startswith("https://"):
                fail("enabled payment package contains a non-HTTPS checkout URL")


def validate_registry() -> None:
    text = (ROOT / "output/manifests/REGISTRY_CATALOG.md").read_text(encoding="utf-8")
    rows = [line for line in text.splitlines() if line.startswith("|") and "miseos." in line]
    if len(rows) != 23:
        fail(f"expected 23 registry entries, found {len(rows)}")


def validate_runtime_exports() -> None:
    runtime = ROOT / "data" / "runtime"
    if not runtime.exists():
        return
    for path in runtime.glob("*.csv"):
        with path.open(encoding="utf-8-sig", newline="") as handle:
            reader = csv.reader(handle)
            header = next(reader, None)
            if not header:
                fail(f"runtime export has no header: {path.relative_to(ROOT)}")


def validate_static_pages() -> None:
    index = (ROOT / "index.html").read_text(encoding="utf-8")
    if "MiseOS GridOps Playground" not in index:
        fail("index.html does not contain the expected GridOps title")
    lineage = ROOT / "apps" / "lineage-editor" / "index.html"
    if not lineage.is_file() or "MiseOS Lineage Editor v2" not in lineage.read_text(encoding="utf-8"):
        fail("Lineage Editor proof is missing or invalid")


def main() -> None:
    validate_required_files()
    validate_commerce()
    validate_mint()
    validate_registry()
    validate_runtime_exports()
    validate_static_pages()
    print("MiseOS repository validation passed.")


if __name__ == "__main__":
    main()

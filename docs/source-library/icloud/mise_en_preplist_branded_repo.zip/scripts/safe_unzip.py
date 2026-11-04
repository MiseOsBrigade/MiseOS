#!/usr/bin/env python3
"""
Safely extract a zip archive into a target directory.

This script rejects:
- absolute paths
- parent-directory traversal
- unsafe file types from zip metadata

Usage:
  python3 scripts/safe_unzip.py bootstrap/payload.zip .
"""

from __future__ import annotations

import argparse
import stat
import sys
import zipfile
from pathlib import Path


def is_safe_member(name: str) -> bool:
    path = Path(name)

    if path.is_absolute():
        return False

    if any(part in ("..", "") for part in path.parts):
        return False

    return True


def is_regular_file_or_dir(info: zipfile.ZipInfo) -> bool:
    mode = (info.external_attr >> 16) & 0o170000

    if mode == 0:
        return True

    return mode in (stat.S_IFREG, stat.S_IFDIR)


def extract_safe(zip_path: Path, destination: Path) -> list[str]:
    extracted: list[str] = []
    destination = destination.resolve()

    with zipfile.ZipFile(zip_path) as archive:
        for info in archive.infolist():
            name = info.filename

            if not is_safe_member(name):
                raise ValueError(f"Unsafe zip path rejected: {name}")

            if not is_regular_file_or_dir(info):
                raise ValueError(f"Unsafe zip file type rejected: {name}")

            target = (destination / name).resolve()

            if destination not in target.parents and target != destination:
                raise ValueError(f"Zip entry escapes destination: {name}")

            archive.extract(info, destination)
            extracted.append(name)

    return extracted


def main() -> int:
    parser = argparse.ArgumentParser(description="Safely extract a zip payload.")
    parser.add_argument("zip_path", type=Path)
    parser.add_argument("destination", type=Path)
    args = parser.parse_args()

    if not args.zip_path.is_file():
        print(f"Missing zip payload: {args.zip_path}", file=sys.stderr)
        return 1

    try:
        extracted = extract_safe(args.zip_path, args.destination)
    except Exception as exc:
        print(f"Extraction failed: {exc}", file=sys.stderr)
        return 1

    print("Extracted files:")
    for item in extracted:
        print(f" - {item}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

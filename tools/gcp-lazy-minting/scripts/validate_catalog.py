#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

from jsonschema import Draft202012Validator


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("metadata_or_directory", type=Path)
    parser.add_argument(
        "--schema",
        type=Path,
        default=Path("schemas/nft-metadata.schema.json"),
    )
    args = parser.parse_args()

    schema = json.loads(args.schema.read_text(encoding="utf-8"))
    validator = Draft202012Validator(schema)
    paths = (
        sorted(args.metadata_or_directory.glob("*.json"))
        if args.metadata_or_directory.is_dir()
        else [args.metadata_or_directory]
    )

    failed = False
    for path in paths:
        value = json.loads(path.read_text(encoding="utf-8"))
        errors = sorted(validator.iter_errors(value), key=lambda e: list(e.path))
        if errors:
            failed = True
            print(f"FAIL {path}")
            for error in errors:
                print(f"  {'/'.join(map(str, error.path))}: {error.message}")
        else:
            print(f"PASS {path}")

    raise SystemExit(1 if failed else 0)


if __name__ == "__main__":
    main()

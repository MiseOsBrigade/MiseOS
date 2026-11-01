#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("root", type=Path)
    parser.add_argument("--output", type=Path, default=Path("checksums.sha256"))
    args = parser.parse_args()

    rows = []
    for path in sorted(p for p in args.root.rglob("*") if p.is_file()):
        if path.resolve() == args.output.resolve():
            continue
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        rows.append(f"{digest}  {path.relative_to(args.root).as_posix()}")

    args.output.write_text("\n".join(rows) + "\n", encoding="utf-8")
    print(f"Wrote {len(rows)} checksums to {args.output}")


if __name__ == "__main__":
    main()

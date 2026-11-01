from __future__ import annotations

import argparse
import hashlib
import os
import re
import shutil
import sys
from dataclasses import dataclass
from pathlib import Path
from zipfile import BadZipFile, ZipFile, ZipInfo

ROOT = Path(__file__).resolve().parents[1]
INCOMING_DIR = ROOT / "incoming"
WORK_DIR = ROOT / "unzippedwork"
OUTPUT_DIR = ROOT

MAX_FILES = 2000
MAX_TOTAL_BYTES = 250 * 1024 * 1024
MAX_SINGLE_FILE_BYTES = 50 * 1024 * 1024

IGNORED_PARTS = {
    ".git",
    ".github",
    "node_modules",
    "__pycache__",
    ".venv",
    "venv",
    "dist",
    "build",
    ".DS_Store",
    "__MACOSX",
}
IGNORED_PARTS_LOWER = {part.lower() for part in IGNORED_PARTS}

CATEGORY_DIRS = [
    "frontend",
    "backend",
    "config",
    "docs",
    "assets",
    "data",
    "tests",
    "misc",
]

CATEGORY_MAP = {
    "frontend": {
        ".html", ".css", ".scss", ".sass", ".js", ".jsx", ".ts", ".tsx", ".vue", ".svelte",
    },
    "backend": {
        ".py", ".rb", ".php", ".java", ".go", ".rs", ".cs", ".kt", ".swift",
    },
    "config": {
        ".json", ".yaml", ".yml", ".toml", ".ini", ".env", ".gitignore", ".dockerignore",
    },
    "docs": {
        ".md", ".txt", ".rst", ".pdf",
    },
    "assets": {
        ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico", ".mp4", ".mov", ".mp3", ".wav",
    },
    "data": {
        ".csv", ".xml", ".sql", ".db", ".sqlite", ".parquet", ".jsonl",
    },
}

SPECIAL_FILES = {
    ".dockerignore": "config",
    ".env": "config",
    ".env.example": "config",
    ".gitignore": "config",
    "package.json": "frontend",
    "package-lock.json": "frontend",
    "pnpm-lock.yaml": "frontend",
    "yarn.lock": "frontend",
    "vite.config.js": "frontend",
    "vite.config.ts": "frontend",
    "webpack.config.js": "frontend",
    "next.config.js": "frontend",
    "requirements.txt": "backend",
    "pyproject.toml": "backend",
    "poetry.lock": "backend",
    "pipfile": "backend",
    "pipfile.lock": "backend",
    "dockerfile": "config",
    "docker-compose.yml": "config",
    "docker-compose.yaml": "config",
    "readme.md": "docs",
    "license": "docs",
}

FRONTEND_HINTS = {"app", "web", "client", "frontend", "components", "pages"}
BACKEND_HINTS = {"server", "api", "backend", "services", "routes", "controllers"}
TEST_HINTS = {"test", "tests", "spec", "specs"}


@dataclass
class ImportReport:
    scanned_zips: int = 0
    imported_files: int = 0
    skipped_files: int = 0
    renamed_duplicates: int = 0
    dry_run: bool = False

    def lines(self, mode: str) -> list[str]:
        return [
            "# Zip Import Summary",
            "",
            f"- **Mode**: `{mode}`",
            f"- **Dry Run**: `{self.dry_run}`",
            f"- **Zip Files Scanned**: {self.scanned_zips}",
            f"- **Files Imported**: {self.imported_files}",
            f"- **Files Skipped**: {self.skipped_files}",
            f"- **Duplicate Files Renamed**: {self.renamed_duplicates}",
            "",
        ]


def parse_bool(value: str | bool | None) -> bool:
    if isinstance(value, bool):
        return value
    if value is None:
        return False
    return str(value).strip().lower() in {"1", "true", "yes", "y", "on"}


def is_safe_path(path: Path) -> bool:
    return not path.is_absolute() and ".." not in path.parts


def assert_within_directory(base: Path, target: Path) -> None:
    base_resolved = base.resolve()
    target_resolved = target.resolve(strict=False)
    if not target_resolved.is_relative_to(base_resolved):
        raise ValueError(f"Resolved path escapes target directory: {target}")


def clean_part(part: str) -> str:
    cleaned = part.strip().replace("\x00", "")
    cleaned = re.sub(r"[^\w.\- ]", "-", cleaned)
    cleaned = re.sub(r"\s+", "-", cleaned)
    cleaned = re.sub(r"-+", "-", cleaned).strip(" -")
    return cleaned if cleaned not in {"", ".", ".."} else "unnamed"


def clean_relative_path(path: Path) -> Path:
    return Path(*(clean_part(part) for part in path.parts))


def should_skip(path: Path) -> bool:
    return any(part.lower() in IGNORED_PARTS_LOWER for part in path.parts)


def hash_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as file_handle:
        for chunk in iter(lambda: file_handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def unique_destination(path: Path, source: Path, report: ImportReport) -> Path:
    if not path.exists():
        return path

    if path.is_file():
        try:
            if hash_file(path) == hash_file(source):
                return path
        except OSError:
            pass

    stem = path.stem or "file"
    suffix = path.suffix
    parent = path.parent
    counter = 2

    while True:
        candidate = parent / f"{stem}-{counter}{suffix}"
        if not candidate.exists():
            report.renamed_duplicates += 1
            return candidate
        counter += 1


def detect_category(filepath: Path, relative: Path) -> str:
    name = filepath.name.lower()
    suffix = filepath.suffix.lower()
    full_suffix = "".join(filepath.suffixes).lower()
    parts = [part.lower() for part in relative.parts]

    if any(part in TEST_HINTS for part in parts):
        return "tests"

    top_folder = parts[0] if len(parts) > 1 else ""

    if top_folder in {"frontend", "client", "web"}:
        return "frontend"
    if top_folder in {"backend", "server", "api"}:
        return "backend"

    if name in SPECIAL_FILES:
        return SPECIAL_FILES[name]

    if name.startswith(".env"):
        return "config"

    if "test" in name or "spec" in name:
        return "tests"

    for category, extensions in CATEGORY_MAP.items():
        if suffix in extensions or full_suffix in extensions or name in extensions:
            return category

    if top_folder in FRONTEND_HINTS:
        return "frontend"
    if top_folder in BACKEND_HINTS:
        return "backend"

    return "misc"


def inspect_zip(zippath: Path) -> None:
    try:
        with ZipFile(zippath, "r") as zip_file:
            file_infos = [info for info in zip_file.infolist() if not info.is_dir()]

            if len(file_infos) > MAX_FILES:
                raise ValueError(f"Too many files in {zippath.name}: {len(file_infos)}")

            total_size = 0

            for info in file_infos:
                member_path = Path(info.filename)

                if not is_safe_path(member_path):
                    raise ValueError(f"Unsafe path caught in {zippath.name}: {info.filename}")

                if should_skip(member_path):
                    continue

                if info.file_size > MAX_SINGLE_FILE_BYTES:
                    raise ValueError(f"Single file too large in {zippath.name}: {info.filename}")

                total_size += info.file_size

            if total_size > MAX_TOTAL_BYTES:
                raise ValueError(f"Archive decompression payload too large: {zippath.name}")

            bad_file = zip_file.testzip()
            if bad_file is not None:
                raise ValueError(f"Corrupt file inside archive: {bad_file}")

    except BadZipFile as error:
        raise ValueError(f"Invalid zip archive file: {zippath.name}") from error


def extract_member(zip_file: ZipFile, member: ZipInfo, destination: Path) -> bool:
    member_path = Path(member.filename)

    if member.is_dir() or not is_safe_path(member_path) or should_skip(member_path):
        return False

    cleaned = clean_relative_path(member_path)
    target = destination / cleaned

    assert_within_directory(destination, target)

    target.parent.mkdir(parents=True, exist_ok=True)

    with zip_file.open(member) as source, target.open("wb") as target_file:
        shutil.copyfileobj(source, target_file)

    return True


def extract_zip(zippath: Path, destination: Path, report: ImportReport) -> None:
    with ZipFile(zippath, "r") as zip_file:
        for member in zip_file.infolist():
            extracted = extract_member(zip_file, member, destination)

            if not extracted and not member.is_dir():
                report.skipped_files += 1


def find_source_root(directory: Path) -> Path:
    children = [
        child
        for child in directory.iterdir()
        if child.name not in {"__MACOSX", ".DS_Store"}
    ]

    if len(children) == 1 and children[0].is_dir():
        return children[0]

    return directory


def ensure_category_dirs(dry_run: bool) -> None:
    if dry_run:
        return

    for category in CATEGORY_DIRS:
        (OUTPUT_DIR / category).mkdir(exist_ok=True)


def copy_file(
    source: Path,
    destination: Path,
    dry_run: bool,
    report: ImportReport,
    detail_lines: list[str],
) -> None:
    final_destination = unique_destination(destination, source, report)

    assert_within_directory(ROOT, final_destination)

    relative_source = source.relative_to(WORK_DIR)
    relative_destination = final_destination.relative_to(ROOT)

    if final_destination.exists() and final_destination.is_file():
        try:
            if hash_file(final_destination) == hash_file(source):
                detail_lines.append(
                    f"- `{relative_source}` → `{relative_destination}` — skipped, identical file already exists"
                )
                report.skipped_files += 1
                return
        except OSError:
            pass

    detail_lines.append(f"- `{relative_source}` → `{relative_destination}`")

    if dry_run:
        report.imported_files += 1
        return

    final_destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, final_destination)
    report.imported_files += 1


def copy_preserve_structure(
    source_root: Path,
    dry_run: bool,
    report: ImportReport,
    detail_lines: list[str],
) -> None:
    for filepath in source_root.rglob("*"):
        if not filepath.is_file():
            continue

        relative = filepath.relative_to(source_root)

        if should_skip(relative):
            report.skipped_files += 1
            continue

        destination = OUTPUT_DIR / clean_relative_path(relative)
        copy_file(filepath, destination, dry_run, report, detail_lines)


def copy_category_structure(
    source_root: Path,
    dry_run: bool,
    report: ImportReport,
    detail_lines: list[str],
) -> None:
    for filepath in source_root.rglob("*"):
        if not filepath.is_file():
            continue

        relative = filepath.relative_to(source_root)

        if should_skip(relative):
            report.skipped_files += 1
            continue

        category = detect_category(filepath, relative)
        destination = OUTPUT_DIR / category / clean_relative_path(relative)

        copy_file(filepath, destination, dry_run, report, detail_lines)


def write_summary(report: ImportReport, detail_lines: list[str], mode: str) -> None:
    summary_lines = report.lines(mode)

    if detail_lines:
        summary_lines.extend(["## Imported File Map", ""])
        summary_lines.extend(detail_lines[:500])
        summary_lines.append("")

        if len(detail_lines) > 500:
            summary_lines.append(
                f"*Output truncated. {len(detail_lines) - 500} additional file structures were processed.*"
            )

    summary = "\n".join(summary_lines)
    print(summary)

    github_step_summary = os.getenv("GITHUB_STEP_SUMMARY")
    if github_step_summary:
        Path(github_step_summary).write_text(summary, encoding="utf-8")


def cleanup_work_dir() -> None:
    if WORK_DIR.exists():
        shutil.rmtree(WORK_DIR)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Safely import files from zip archives into this repository."
    )
    parser.add_argument(
        "--mode",
        choices=["preserve", "category"],
        default=os.getenv("MODE", "preserve"),
        help="Import strategy: preserve source tree or bucket files by category.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        default=parse_bool(os.getenv("DRYRUN", "false")),
        help="Preview imports without writing permanent repository changes.",
    )

    args = parser.parse_args()

    report = ImportReport(dry_run=args.dry_run)
    detail_lines: list[str] = []

    zip_files = sorted(INCOMING_DIR.glob("*.zip"))

    if not zip_files:
        print("No zip files found in incoming/.")
        return 0

    report.scanned_zips = len(zip_files)

    cleanup_work_dir()
    WORK_DIR.mkdir(parents=True, exist_ok=True)

    try:
        if args.mode == "category":
            ensure_category_dirs(args.dry_run)

        for zippath in zip_files:
            inspect_zip(zippath)

            extract_dir = WORK_DIR / clean_part(zippath.stem)
            assert_within_directory(WORK_DIR, extract_dir)
            extract_dir.mkdir(parents=True, exist_ok=True)

            extract_zip(zippath, extract_dir, report)

            source_root = find_source_root(extract_dir)

            if args.mode == "preserve":
                copy_preserve_structure(source_root, args.dry_run, report, detail_lines)
            else:
                copy_category_structure(source_root, args.dry_run, report, detail_lines)

        write_summary(report, detail_lines, args.mode)
        return 0

    except ValueError as error:
        print(f"Import failed safety boundary verification: {error}", file=sys.stderr)
        return 1

    finally:
        cleanup_work_dir()


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""
MiseOS Art Factory v2 — Option B Single File

Chibi / Kawaii / Shimeji + Mint-Ready Card Pipeline for the MiseOS 112-character roster + 23 registry manifests.

Core capabilities:
- Merge character sources only into the character roster.
- Keep registry/package manifests separate from collectible character cards.
- Generate prompt jobs for chibi, kawaii, shimeji, card-front, card-back, Krikey animation, MangaBoom comic panels.
- Use backend adapters: local dry-run, Fal queue, generic webhook for YepCode/Catalyst/custom workers, Photoshop manifest.
- Build 4-state shimeji sprite sheets from finished transparent PNGs.
- Render original premium card fronts/backs with holo, rarity seals, stat bars, lore panels.
- Export ERC-721 metadata with ERC-2981 royalty-interface fields and Blockscout placeholders.

Install:
  pip install Pillow requests python-slugify

Expected inputs:
  input/characters.generated.json
  input/mise_orchestra_collection_manifest.json
  input/mise_orchestra_cards.csv                 # optional
  input/miseos-registry-catalog.csv              # optional registry/package catalog, not character cards
  input/source_images/<agent-slug>.png           # optional reference/final art

Quick commands:
  python miseos_art_factory_v2_single.py prepare --backend local
  python miseos_art_factory_v2_single.py cards
  python miseos_art_factory_v2_single.py shimeji
  python miseos_art_factory_v2_single.py preview

Fal commands:
  export FAL_KEY="..."
  python miseos_art_factory_v2_single.py prepare --backend fal
  python miseos_art_factory_v2_single.py generate --style chibi --backend fal --limit 5
"""
from __future__ import annotations

import argparse
import base64
import csv
import dataclasses
import hashlib
import io
import json
import math
import mimetypes
import os
import random
import re
import time
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Sequence, Tuple

try:
    import requests
except Exception:
    requests = None

try:
    from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps
except Exception as exc:
    raise RuntimeError("Pillow is required. Install with: pip install Pillow") from exc

try:
    from slugify import slugify
except Exception:
    def slugify(value: str) -> str:
        value = value.lower().strip()
        value = re.sub(r"[^a-z0-9]+", "-", value)
        return value.strip("-")

VERSION = "2.1.0-separated-roster-registry"
ROOT = Path(".")
INPUT_DIR = ROOT / "input"
OUTPUT_DIR = ROOT / "output"
SOURCE_IMAGES_DIR = INPUT_DIR / "source_images"
CORE_ROSTER_PATH = INPUT_DIR / "characters.generated.json"
COLLECTION_MANIFEST_PATH = INPUT_DIR / "mise_orchestra_collection_manifest.json"
CARDS_CSV_PATH = INPUT_DIR / "mise_orchestra_cards.csv"
REGISTRY_CSV_PATH = INPUT_DIR / "miseos-registry-catalog.csv"
ROSTER_OUT = OUTPUT_DIR / "merged_roster.json"
JOBS_DIR = OUTPUT_DIR / "jobs"
REFINED_DIR = OUTPUT_DIR / "refined"
SPRITES_DIR = OUTPUT_DIR / "sprites"
CARDS_DIR = OUTPUT_DIR / "cards"
METADATA_DIR = CARDS_DIR / "metadata"
MANIFESTS_DIR = OUTPUT_DIR / "manifests"
PHOTOSHOP_DIR = OUTPUT_DIR / "photoshop"
PREVIEW_DIR = OUTPUT_DIR / "preview"
LOGS_DIR = OUTPUT_DIR / "logs"

STRICT_REFINE_ONLY_RARITIES = {"Mythic", "Legendary"}
MINT_ELIGIBLE_RARITIES = {"Rare", "Epic", "Legendary", "Mythic"}
DEFAULT_CHAIN = os.getenv("MISEOS_CHAIN", "Polygon")
DEFAULT_TOKEN_STANDARD = "ERC-721"
DEFAULT_ROYALTY_INTERFACE = "ERC-2981"
OFFICIAL_CHARACTER_CARD_COUNT = 112
OFFICIAL_REGISTRY_MANIFEST_COUNT = 23
OFFICIAL_ECOSYSTEM_ITEM_COUNT = OFFICIAL_CHARACTER_CARD_COUNT + OFFICIAL_REGISTRY_MANIFEST_COUNT

DEFAULT_REGISTRY_MANIFESTS = [
    {"registry_id": "miseos.agent-sdk", "name": "MiseOS Agent SDK", "type": "SDK"},
    {"registry_id": "miseos.analytics-engine", "name": "MiseOS Analytics Engine", "type": "Analytics"},
    {"registry_id": "miseos.attestation-gate", "name": "MiseOS Attestation Gate", "type": "Policy"},
    {"registry_id": "miseos.cli", "name": "MiseOS CLI", "type": "Package"},
    {"registry_id": "miseos.docs-builder", "name": "MiseOS Docs Builder", "type": "Container"},
    {"registry_id": "miseos.docs-hub-template", "name": "MiseOS Docs Hub Template", "type": "Template"},
    {"registry_id": "miseos.gradle-plugin", "name": "MiseOS Gradle Plugin", "type": "Package"},
    {"registry_id": "miseos.maven-policy-adapter", "name": "MiseOS Maven Policy Adapter", "type": "Package"},
    {"registry_id": "miseos.nuget-client", "name": "MiseOS NuGet Client", "type": "SDK"},
    {"registry_id": "miseos.policy-checker", "name": "MiseOS Policy Checker", "type": "Container"},
    {"registry_id": "miseos.policy-engine", "name": "MiseOS Policy Engine", "type": "Policy"},
    {"registry_id": "miseos.registry-schema", "name": "MiseOS Registry Schema", "type": "Schema"},
    {"registry_id": "miseos.release-sentinel", "name": "MiseOS Release Sentinel", "type": "Agent"},
    {"registry_id": "miseos.repo-steward", "name": "MiseOS Repo Steward", "type": "Agent"},
    {"registry_id": "miseos.ruby-steward", "name": "MiseOS Ruby Steward", "type": "Package"},
    {"registry_id": "miseos.runner", "name": "MiseOS Runner", "type": "Container"},
    {"registry_id": "miseos.sbom-indexer", "name": "MiseOS SBOM Indexer", "type": "Agent"},
    {"registry_id": "miseos.trust-graph", "name": "MiseOS Trust Graph", "type": "Analytics"},
    {"registry_id": "miseos.workflow-linter", "name": "MiseOS Workflow Linter", "type": "Agent"},
    {"registry_id": "miseos.workflow-pack", "name": "MiseOS Workflow Pack", "type": "Workflow"},
    {"registry_id": "miseos.repo-pet", "name": "MiseOS Repo Pet", "type": "Agent"},
    {"registry_id": "miseos.repo-reliability-kit", "name": "MiseOS Repo Reliability Kit", "type": "Workflow"},
    {"registry_id": "miseos.orchestra-theme", "name": "Mise Orchestra Theme", "type": "Theme"},
]

# Fal routes discovered/recommended for this visual pipeline.
FAL_ENDPOINTS = {
    "generate": os.getenv("FAL_MODEL_GENERATE", "fal-ai/flux-2/klein/9b"),
    "refine": os.getenv("FAL_MODEL_REFINE", "fal-ai/nano-banana-2"),
    "card": os.getenv("FAL_MODEL_CARD", "openai/gpt-image-2"),
    "background_remove": os.getenv("FAL_MODEL_BG_REMOVE", "pixelcut/background-removal"),
}

CATALYST_FEATURE_MAP = {
    "hosting": "Web Client Hosting",
    "functions": "Functions",
    "storage": "Filestore",
    "api": "API Gateway",
    "webhooks": "Webhooks",
}

DEPARTMENT_THEME = {
    "Executive Chefs": {"accent": "#D4AF37", "soft": "#FFF3B0", "dark": "#100B05", "keywords": "executive command, master orchestration, gold aura, leadership crest"},
    "Kitchen Operations": {"accent": "#E97B22", "soft": "#FFD1A1", "dark": "#170B04", "keywords": "kitchen heat, tactical flow, prep stations, flame motion"},
    "Service Layer": {"accent": "#2E8B4E", "soft": "#C9F2D4", "dark": "#06130A", "keywords": "runtime service, steady delivery, reliable green circuit glow"},
    "Engineering & Development": {"accent": "#5B8DEF", "soft": "#D8E6FF", "dark": "#050914", "keywords": "code craft, blueprint grid, system builder, precise instruments"},
    "Security & Quality": {"accent": "#E5564B", "soft": "#FFD3CF", "dark": "#170504", "keywords": "security seal, validation aura, guarded kitchen, threat containment"},
    "Platform & Infrastructure": {"accent": "#26B6A6", "soft": "#CCF6F1", "dark": "#041312", "keywords": "infrastructure grid, compute nodes, storage vaults, observability lines"},
    "Integrations & Ecosystem": {"accent": "#A98BE0", "soft": "#E8DEFF", "dark": "#0C0715", "keywords": "API portals, connector magic, integration runes, ecosystem bridges"},
    "Reliability": {"accent": "#C9A227", "soft": "#FFF2B9", "dark": "#120E03", "keywords": "SLO compass, uptime sigils, observability gauges, calm precision"},
    "Insights & Growth": {"accent": "#6F87FF", "soft": "#DDE4FF", "dark": "#05081A", "keywords": "analytics glow, learning garden, chart magic, optimization pulse"},
    "Pipeline": {"accent": "#F3722C", "soft": "#FFD9C4", "dark": "#160804", "keywords": "delivery pipeline, rocket motion, build-test-deploy rhythm"},
    "Operations": {"accent": "#E97B22", "soft": "#FFD1A1", "dark": "#170B04", "keywords": "kitchen operations, prep flow, flame control, culinary command"},
    "Platform": {"accent": "#2E8B4E", "soft": "#C9F2D4", "dark": "#06130A", "keywords": "platform foundations, API gateways, secure connectivity"},
    "Security": {"accent": "#E5564B", "soft": "#FFD3CF", "dark": "#170504", "keywords": "security shields, locked vaults, compliance seals"},
    "Unknown": {"accent": "#D4AF37", "soft": "#F6F1E7", "dark": "#0E0F10", "keywords": "MiseOS agent, orchestrated kitchen system"},
}

RARITY_THEME = {
    "Common": {"rank": 5, "accent": "#A0A0A0", "foil": "clean satin finish, subtle shine", "border": "steel border", "seal": "COMMON"},
    "Rare": {"rank": 4, "accent": "#4A90E2", "foil": "blue foil glints, crisp aura, collectible sparkle", "border": "blue prism border", "seal": "RARE"},
    "Epic": {"rank": 3, "accent": "#8E44FF", "foil": "purple arcane foil, layered glow, high-energy aura", "border": "violet hologram border", "seal": "EPIC"},
    "Legendary": {"rank": 2, "accent": "#FF9800", "foil": "legendary gold foil, radiant sigils, ornate premium glow", "border": "gold mythic frame", "seal": "LEGENDARY"},
    "Mythic": {"rank": 1, "accent": "#FF2E88", "foil": "rainbow holo crest, divine glow, masterpiece collector aura", "border": "mythic chroma frame", "seal": "MYTHIC"},
}

@dataclass
class Agent:
    id: str
    slug: str
    name: str
    role: str = "Unknown Role"
    department: str = "Unknown"
    department_label: str = ""
    department_tagline: str = ""
    rarity: str = "Common"
    role_category: str = ""
    codename: str = ""
    mise_name: str = ""
    command: str = ""
    summary: str = ""
    lore: str = ""
    nationality: str = ""
    signature_phrase: str = ""
    unique_trait: str = ""
    visual: Dict[str, Any] = field(default_factory=dict)
    workflow: Dict[str, Any] = field(default_factory=dict)
    stats: Dict[str, int] = field(default_factory=dict)
    synced_agents: List[str] = field(default_factory=list)
    tags: List[str] = field(default_factory=list)
    source_image: str = ""
    mint_eligible: bool = False
    refine_only: bool = False

@dataclass
class GenerationJob:
    agent_slug: str
    agent_name: str
    style: str
    rarity: str
    mode: str
    prompt: str
    negative_prompt: str
    reference_images: List[str]
    output_path: str
    backend: str
    model: str
    size: str
    transparent_background: bool
    strength: float
    seed: int
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class BackendResult:
    ok: bool
    output_path: Optional[str] = None
    remote_url: Optional[str] = None
    error: Optional[str] = None
    raw: Dict[str, Any] = field(default_factory=dict)


def ensure_dirs() -> None:
    paths = [INPUT_DIR, SOURCE_IMAGES_DIR, OUTPUT_DIR, JOBS_DIR, SPRITES_DIR / "frames", SPRITES_DIR / "sheets", CARDS_DIR / "png", CARDS_DIR / "back", METADATA_DIR, MANIFESTS_DIR, PHOTOSHOP_DIR, PREVIEW_DIR, LOGS_DIR]
    for style in ["chibi", "kawaii", "shimeji", "card-front", "card-back"]:
        paths.append(REFINED_DIR / style)
    for path in paths:
        path.mkdir(parents=True, exist_ok=True)

def now_iso() -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

def stable_hash(text: str) -> int:
    return int(hashlib.sha256(text.encode("utf-8")).hexdigest(), 16)

def stable_seed(text: str) -> int:
    return stable_hash(text) % 2_147_483_647

def clean_name(value: Any) -> str:
    return " ".join(str(value or "").strip().split())

def clean_rarity(value: Any) -> str:
    raw = clean_name(value).title()
    return {"Genesis": "Mythic", "Ultra Rare": "Legendary", "Legend": "Legendary", "Mythical": "Mythic"}.get(raw, raw or "Common")

def agent_slug(name: str) -> str:
    return slugify(clean_name(name)) or "unnamed-agent"

def json_read(path: Path, default: Any = None) -> Any:
    if not path.exists():
        return default
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)

def json_write(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(data, handle, indent=2, ensure_ascii=False)

def jsonl_write(path: Path, rows: Iterable[Dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")

def jsonl_read(path: Path) -> Iterable[Dict[str, Any]]:
    with path.open("r", encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if line:
                yield json.loads(line)

def csv_rows(path: Path) -> List[Dict[str, str]]:
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))

def hex_to_rgb(value: str) -> Tuple[int, int, int]:
    value = (value or "#000000").strip().lstrip("#")
    if len(value) == 3:
        value = "".join(c * 2 for c in value)
    try:
        return tuple(int(value[i:i + 2], 16) for i in (0, 2, 4))  # type: ignore
    except Exception:
        return (0, 0, 0)

def rgba(hex_value: str, alpha: int = 255) -> Tuple[int, int, int, int]:
    r, g, b = hex_to_rgb(hex_value)
    return (r, g, b, alpha)

def safe_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
        "/Library/Fonts/Arial Bold.ttf" if bold else "/Library/Fonts/Arial.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except Exception:
            continue
    return ImageFont.load_default()  # type: ignore

def wrap_text(text: str, width: int) -> str:
    words = str(text or "").replace("\n", " ").split()
    lines, line = [], []
    for word in words:
        candidate = " ".join(line + [word])
        if len(candidate) <= width:
            line.append(word)
        else:
            if line:
                lines.append(" ".join(line))
            line = [word]
    if line:
        lines.append(" ".join(line))
    return "\n".join(lines)

def load_image(path_or_url: str) -> Image.Image:
    if path_or_url.startswith(("http://", "https://")):
        if requests is None:
            raise RuntimeError("requests is required for URL image loading")
        response = requests.get(path_or_url, timeout=90)
        response.raise_for_status()
        return Image.open(io.BytesIO(response.content)).convert("RGBA")
    return Image.open(path_or_url).convert("RGBA")

def save_bytes_from_url(url: str, output_path: Path) -> None:
    if requests is None:
        raise RuntimeError("requests is required for URL downloads")
    response = requests.get(url, timeout=180)
    response.raise_for_status()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_bytes(response.content)

def fit_transparent(im: Image.Image, size: Tuple[int, int]) -> Image.Image:
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    placed = ImageOps.contain(im.convert("RGBA"), size, method=Image.Resampling.LANCZOS)
    canvas.alpha_composite(placed, ((size[0] - placed.width) // 2, (size[1] - placed.height) // 2))
    return canvas

def image_to_data_uri(path: Path) -> str:
    mime = mimetypes.guess_type(str(path))[0] or "image/png"
    data = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{data}"

def find_source_image(slug: str) -> str:
    for ext in [".png", ".webp", ".jpg", ".jpeg"]:
        candidate = SOURCE_IMAGES_DIR / f"{slug}{ext}"
        if candidate.exists():
            return str(candidate)
    return ""

def normalize_department(raw: str) -> str:
    value = clean_name(raw)
    aliases = {"pipeline kitchen": "Pipeline", "platform kitchen": "Platform", "reliability kitchen": "Reliability", "insights and growth": "Insights & Growth", "insights & growth": "Insights & Growth"}
    return aliases.get(value.lower(), value or "Unknown")

def theme_for_department(dept: str) -> Dict[str, str]:
    return DEPARTMENT_THEME.get(dept) or DEPARTMENT_THEME.get(normalize_department(dept)) or DEPARTMENT_THEME["Unknown"]

def theme_for_rarity(rarity: str) -> Dict[str, Any]:
    return RARITY_THEME.get(clean_rarity(rarity), RARITY_THEME["Common"])


def agent_from_core(item: Dict[str, Any], index: int) -> Agent:
    identity, visual, workflow = item.get("identity") or {}, item.get("visual") or {}, item.get("workflow") or {}
    name = clean_name(item.get("name") or item.get("miseName") or item.get("codename") or f"Agent {index}")
    slug = agent_slug(item.get("id") or name)
    rarity = clean_rarity(item.get("rarity") or ("Mythic" if item.get("genesisVariant") else "Common"))
    department = normalize_department(item.get("departmentLabel") or item.get("department") or workflow.get("department") or "Unknown")
    role = clean_name(identity.get("title") or workflow.get("roleName") or workflow.get("jobName") or item.get("role") or item.get("roleCategory") or "Unknown Role")
    synced = workflow.get("syncsWith") or item.get("synced_agents") or []
    if not isinstance(synced, list):
        synced = [str(synced)]
    stats = {}
    for k, v in (item.get("stats") or {}).items():
        try:
            stats[str(k)] = int(v)
        except Exception:
            pass
    return Agent(
        id=str(item.get("number") or item.get("id") or index), slug=slug, name=name, role=role,
        department=department, department_label=clean_name(item.get("departmentLabel") or department),
        department_tagline=clean_name(item.get("departmentTagline") or ""), rarity=rarity,
        role_category=clean_name(item.get("roleCategory") or ""), codename=clean_name(item.get("codename") or ""),
        mise_name=clean_name(item.get("miseName") or ""), command=clean_name(workflow.get("jobName") or item.get("command") or ""),
        summary=clean_name(workflow.get("summary") or item.get("summary") or ""), lore=clean_name(item.get("lore") or ""),
        nationality=clean_name(identity.get("nationality") or ""), signature_phrase=clean_name(identity.get("signaturePhrase") or ""),
        unique_trait=clean_name(identity.get("uniqueTrait") or ""), visual=visual, workflow=workflow, stats=stats,
        synced_agents=[clean_name(x) for x in synced if clean_name(x)], tags=[clean_name(x) for x in item.get("tags", []) if clean_name(x)],
        source_image=find_source_image(slug),
    )

def agent_from_manifest(card: Dict[str, Any], index: int) -> Agent:
    name = clean_name(card.get("name") or f"Card {index}")
    slug = agent_slug(name)
    rarity = clean_rarity(card.get("rarity") or "Rare")
    department = normalize_department(card.get("department") or "Unknown")
    role = clean_name(card.get("role") or "Collectible Agent")
    return Agent(
        id=str(card.get("id") or index), slug=slug, name=name, role=role, department=department,
        department_label=department, rarity=rarity, command=f"{department.upper()}::{role.upper()}",
        summary=f"{name} is a {rarity} Mise Orchestra collectible agent serving as {role}.",
        lore=f"{name} belongs to the Kitchen Chaos DevOps Universe, where every technical workflow becomes a coordinated brigade station.",
        source_image=find_source_image(slug), tags=["collection-manifest", "mint-card"],
    )

def apply_csv_row(agent: Agent, row: Dict[str, str]) -> None:
    def first(*keys: str) -> str:
        for key in keys:
            val = clean_name(row.get(key))
            if val:
                return val
        return ""
    agent.role = agent.role if agent.role != "Unknown Role" else first("role", "Role", "title", "Title") or agent.role
    agent.department = agent.department if agent.department != "Unknown" else normalize_department(first("department", "Department")) or agent.department
    agent.rarity = agent.rarity if agent.rarity != "Common" else clean_rarity(first("rarity", "Rarity")) or agent.rarity
    agent.command = agent.command or first("command", "Command", "ability", "Ability")
    agent.summary = agent.summary or first("summary", "Summary", "description", "Description")
    agent.lore = agent.lore or first("lore", "Lore", "story", "Story")

def load_roster() -> List[Agent]:
    ensure_dirs()
    agents_by_slug: Dict[str, Agent] = {}
    raw_core = json_read(CORE_ROSTER_PATH, default=[])
    raw_items = raw_core.get("characters") or raw_core.get("agents") or raw_core.get("cards") or [] if isinstance(raw_core, dict) else raw_core or []
    for idx, item in enumerate(raw_items, start=1):
        if isinstance(item, dict):
            agent = agent_from_core(item, idx)
            agents_by_slug.setdefault(agent.slug, agent)
    raw_manifest = json_read(COLLECTION_MANIFEST_PATH, default={})
    for idx, card in enumerate(raw_manifest.get("cards", []) if isinstance(raw_manifest, dict) else [], start=1):
        agent = agent_from_manifest(card, idx)
        if agent.slug in agents_by_slug:
            existing = agents_by_slug[agent.slug]
            existing.rarity = existing.rarity if existing.rarity != "Common" else agent.rarity
            existing.role = existing.role if existing.role != "Unknown Role" else agent.role
            existing.department = existing.department if existing.department != "Unknown" else agent.department
            existing.tags = sorted(set(existing.tags + agent.tags))
            existing.command = existing.command or agent.command
            existing.summary = existing.summary or agent.summary
            existing.lore = existing.lore or agent.lore
        else:
            agents_by_slug[agent.slug] = agent
    for row in csv_rows(CARDS_CSV_PATH):
        raw_name = row.get("name") or row.get("Name") or row.get("character") or row.get("Character") or row.get("agent") or row.get("Agent")
        if not raw_name:
            continue
        slug = agent_slug(raw_name)
        if slug not in agents_by_slug:
            agents_by_slug[slug] = Agent(id=str(len(agents_by_slug) + 1), slug=slug, name=clean_name(raw_name), source_image=find_source_image(slug))
        apply_csv_row(agents_by_slug[slug], row)
    for agent in agents_by_slug.values():
        agent.rarity = clean_rarity(agent.rarity)
        agent.department = normalize_department(agent.department)
        agent.mint_eligible = agent.rarity in MINT_ELIGIBLE_RARITIES
        agent.refine_only = agent.rarity in STRICT_REFINE_ONLY_RARITIES
        agent.source_image = agent.source_image or find_source_image(agent.slug)
    agents = sorted(agents_by_slug.values(), key=lambda a: (theme_for_rarity(a.rarity)["rank"], a.department, a.name.lower()))
    json_write(ROSTER_OUT, [asdict(a) for a in agents])
    return agents


def load_registry_catalog() -> List[Dict[str, Any]]:
    """Load product/package registry manifests separately from character cards."""
    rows = csv_rows(REGISTRY_CSV_PATH)
    if not rows:
        return list(DEFAULT_REGISTRY_MANIFESTS)
    registry: List[Dict[str, Any]] = []
    for row in rows:
        registry_id = clean_name(
            row.get("registry_id")
            or row.get("Registry ID")
            or row.get("id")
            or row.get("ID")
        )
        name = clean_name(row.get("name") or row.get("Name"))
        item_type = clean_name(row.get("type") or row.get("Type"))
        if not registry_id or not name:
            continue
        registry.append({
            "registry_id": registry_id,
            "name": name,
            "type": item_type or "Package",
        })
    existing_ids = {item["registry_id"] for item in registry}
    for item in DEFAULT_REGISTRY_MANIFESTS:
        if item["registry_id"] not in existing_ids:
            registry.append(item)
    return registry


def write_registry_catalog_manifest() -> None:
    registry = load_registry_catalog()
    ensure_dirs()
    json_write(
        MANIFESTS_DIR / "registry_catalog_manifest.json",
        {
            "schema": "miseos.registry.catalog.v1",
            "created_at": now_iso(),
            "total_registry_manifests": len(registry),
            "official_character_cards": OFFICIAL_CHARACTER_CARD_COUNT,
            "official_ecosystem_items": OFFICIAL_CHARACTER_CARD_COUNT + len(registry),
            "note": "Registry manifests are product/package ecosystem items, not character cards.",
            "items": registry,
        },
    )
    md = [
        "# MiseOS Registry Catalog",
        "",
        "> Product/package manifests. These are not character cards.",
        "",
        f"Character cards: **{OFFICIAL_CHARACTER_CARD_COUNT}**",
        f"Registry manifests: **{len(registry)}**",
        f"Total ecosystem items: **{OFFICIAL_CHARACTER_CARD_COUNT + len(registry)}**",
        "",
        "| # | Registry ID | Name | Type |",
        "|---:|---|---|---|",
    ]
    for idx, item in enumerate(registry, start=1):
        md.append(
            f"| {idx} | `{item['registry_id']}` | {item['name']} | {item['type']} |"
        )
    (MANIFESTS_DIR / "REGISTRY_CATALOG.md").write_text(
        "\n".join(md) + "\n",
        encoding="utf-8",
    )


def write_brand_docs(agents: Sequence[Agent]) -> None:
    """Write README and organization profile around the corrected 112 + 23 = 135 model."""
    registry = load_registry_catalog()
    total_registry = len(registry)
    ecosystem_total = OFFICIAL_CHARACTER_CARD_COUNT + total_registry
    readme = f"""# Mise-OS

> The Git-native operating system for coordinated development, repo stewardship, automation, and ethical AI workflows.

**Everything in its place before it ships.**

MiseOS turns AI chaos into coordinated service: specialized agents, registry packages, repo-safe workflows, security gates, observability, and marketplace-ready DevOps tools working as one precise system.

## Correct Ecosystem Count

| Layer | Count | Meaning |
|---|---:|---|
| Character cards | {OFFICIAL_CHARACTER_CARD_COUNT} | Collectible brigade operators with roles, rarity, lore, departments, and workflows |
| Registry manifests | {total_registry} | SDKs, packages, containers, schemas, policy tools, agents, workflows, analytics, and themes |
| Total ecosystem items | {ecosystem_total} | Full MiseOS ecosystem model |

Registry manifests are **not** character cards. They are the product/package layer of the MiseOS ecosystem.

## System Layers

```text
Mise-OS/
├── agents/              # 112 character/operator cards and self-contained agent tools
├── registry/            # 23 product/package manifests
├── workflows/           # repo-safe DevOps shift flows
├── tools/               # CLI, linter, policy engine, release engine, SBOM, trust graph
├── mcp/                 # GitHub, filesystem, Docker, Kubernetes, vector, runtime connectors
├── webhooks/            # GitHub, Stripe, Fal, Catalyst, YepCode, Quicknode events
├── services/            # SaaS API, auth, billing, licensing, usage metering, telemetry
├── docs/                # architecture, marketing, licensing, account setup, runbooks
└── cards/               # images, ERC-721 metadata, previews, minting assets
```

## Registry Catalog

See [`output/manifests/REGISTRY_CATALOG.md`](output/manifests/REGISTRY_CATALOG.md) for the canonical 23-item registry table.

## Build Commands

```bash
python miseos_art_factory_v2_single.py prepare --backend local
python miseos_art_factory_v2_single.py cards
python miseos_art_factory_v2_single.py preview
```

`prepare` now writes the character roster and registry catalog separately:

```text
output/merged_roster.json                         # character/agent roster only
output/manifests/registry_catalog_manifest.json   # registry/package manifests only
output/manifests/REGISTRY_CATALOG.md              # human-readable registry table
```

## Commercial Model

MiseOS is designed as open-core infrastructure:

- Free/community: docs, gallery, starter CLI, basic registry, demo workflows
- Pro: hosted dashboard, repo manager, workflow linter, release risk reports
- Team: GitHub App, MCP connectors, policy packs, audit logs, team shifts
- Enterprise: self-hosted runtime, SSO, compliance, private deployment, custom agents

## Signature

MiseOS / Mise Orchestra — Git-native, repo-safe automation for builders who ship with evidence.
"""
    Path("README.md").write_text(readme, encoding="utf-8")
    profile_dir = ROOT / ".github" / "profile"
    profile_dir.mkdir(parents=True, exist_ok=True)
    org_profile = f"""# Mise-OS

**Everything in its place before it ships.**

MiseOS is the Git-native operating system for coordinated development, repo stewardship, automation, and ethical AI workflows.

## Ecosystem

- **{OFFICIAL_CHARACTER_CARD_COUNT} character agents** — the visible brigade of collectible operators.
- **{total_registry} registry manifests** — SDKs, packages, containers, policies, schemas, workflows, analytics tools, and themes.
- **{ecosystem_total} total ecosystem items** — one coordinated DevOps operating system.

## What We Build

- Repo-safe AI agents
- GitHub Actions and marketplace tools
- MCP connectors
- Policy and security gates
- Release and reliability workflows
- Agent SDKs and registry packages
- Character cards, metadata, and gallery experiences

## Product Line

```text
Community      → open-source starter tools and documentation
Pro            → hosted repo-safe DevOps tools
Team           → GitHub App, policy packs, MCP connectors
Enterprise     → self-hosted runtime, governance, audit, private deployment
```

MiseOS turns autonomous development into a coordinated kitchen: every agent has a station, every workflow has guardrails, and every release leaves evidence.
"""
    (profile_dir / "README.md").write_text(org_profile, encoding="utf-8")


def style_descriptor(style: str) -> str:
    return {
        "chibi": "chibi super-deformed character, 1.5:1 to 2:1 head-to-body ratio, large expressive eyes, tiny compact body, rounded hands, cute heroic pose",
        "kawaii": "kawaii mascot character, plush softness, rounded forms, glossy eyes, gentle smile, soft highlights, adorable but professional",
        "shimeji": "desktop shimeji mascot sprite, chibi proportions, full-body, transparent background, clean 128x128 readable silhouette, idle-pose friendly",
        "card-front": "premium original collectible trading card front, holographic foil, ornate MiseOS frame, large character art window, crisp readable typography, non-infringing original layout",
        "card-back": "premium original collectible trading card back, lore panel, sigil system, metadata blocks, MiseOS black-gold brand, crisp readable typography",
    }.get(style, "MiseOS chibi kawaii character art")

def negative_prompt() -> str:
    return "low quality, blurry, distorted hands, extra limbs, unreadable text, misspelled title, watermark, logo plagiarism, copied third-party card template, copyrighted monster franchise layout, messy background, cropped body, asymmetrical eyes, scary horror, photorealistic human"

def identity_lock(agent: Agent) -> str:
    base = ["chef-inspired black and gold MiseOS uniform", "white chef hat or role-specific headwear unless reference says otherwise", "visible signature prop/tool", "full body visible", "clean character silhouette"]
    if agent.visual:
        for key, label in [("tool", "signature tool"), ("aura", "aura"), ("silhouette", "silhouette cue")]:
            val = clean_name(agent.visual.get(key))
            if val:
                base.append(f"{label}: {val}")
    base.append("STRICT IDENTITY LOCK: preserve hairstyle silhouette, face proportions, costume shape, emblem placement, prop identity, color hierarchy" if agent.refine_only else "SOFT IDENTITY LOCK: preserve main role, prop, outfit language, and department color palette while allowing fresh pose variation")
    return "; ".join(base)

def build_agent_prompt(agent: Agent, style: str) -> str:
    dept, rarity = theme_for_department(agent.department), theme_for_rarity(agent.rarity)
    strict = "Use image-to-image refinement, not free reinvention." if agent.refine_only and agent.source_image else "Generate a new faithful character illustration from the spec."
    return (
        f"{strict} Create {style_descriptor(style)} for {agent.name}. Role: {agent.role}. Department: {agent.department}. Rarity: {agent.rarity}. "
        f"Department visual language: {dept['keywords']}. Rarity visual treatment: {rarity['foil']} with {rarity['border']}. "
        f"Identity requirements: {identity_lock(agent)}. Brand style: MiseOS / Mise Orchestra, kitchen chaos DevOps universe, black-gold premium palette, anime chibi linework, polished vector-like render, high contrast, tasteful magical system accents. "
        f"Output requirements: centered composition, transparent background for character-only styles, sharp edges, collectible-grade finish, no copied third-party IP."
    )

def build_animation_prompt(agent: Agent) -> str:
    return f"Animate {agent.name}, a {agent.rarity} MiseOS {agent.role}, as a short 3-5 second looping mascot animation: cute idle bounce, tiny prop flourish, spark aura pulse, chef-brigade confidence. Keep on-model: {identity_lock(agent)}."

def build_comic_prompt(agent: Agent) -> str:
    return f"Create a 4-panel chibi manga comic for {agent.name}: 1 repo chaos appears, 2 {agent.name} identifies the issue using {agent.role} skills, 3 brigade workflow activates, 4 calm deployment with MiseOS slogan."

def job_for_agent(agent: Agent, style: str, backend: str) -> GenerationJob:
    mode = "refine" if agent.refine_only and agent.source_image else "generate"
    if style in {"card-front", "card-back"}:
        model, size, transparent = FAL_ENDPOINTS["card"], "1536x2144", False
    elif mode == "refine":
        model, size, transparent = FAL_ENDPOINTS["refine"], "1024x1024", True
    else:
        model, size, transparent = FAL_ENDPOINTS["generate"], "1024x1024", True
    return GenerationJob(
        agent_slug=agent.slug, agent_name=agent.name, style=style, rarity=agent.rarity, mode=mode,
        prompt=build_agent_prompt(agent, style), negative_prompt=negative_prompt(),
        reference_images=[agent.source_image] if agent.source_image else [],
        output_path=str(REFINED_DIR / style / f"{agent.slug}.png"), backend=backend, model=model, size=size,
        transparent_background=transparent, strength=0.64 if agent.refine_only else 0.82,
        seed=stable_seed(f"{agent.slug}:{style}:{agent.rarity}"),
        metadata={"department": agent.department, "role": agent.role, "mint_eligible": agent.mint_eligible, "refine_only": agent.refine_only, "animation_prompt": build_animation_prompt(agent), "comic_prompt": build_comic_prompt(agent)},
    )

class ImageBackend:
    name = "base"
    def run(self, job: GenerationJob) -> BackendResult:
        raise NotImplementedError

class LocalPromptBackend(ImageBackend):
    name = "local"
    def run(self, job: GenerationJob) -> BackendResult:
        out_path = Path(job.output_path)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        prompt_path = out_path.with_suffix(".prompt.json")
        json_write(prompt_path, asdict(job))
        return BackendResult(ok=True, output_path=str(prompt_path), raw={"dry_run": True})

class GenericWebhookBackend(ImageBackend):
    name = "webhook"
    def __init__(self, url: str, token: str = "") -> None:
        if not url:
            raise ValueError("Webhook backend requires MISEOS_IMAGE_WEBHOOK_URL, YEPCODE_WEBHOOK_URL, or CATALYST_IMAGE_URL")
        self.url, self.token = url, token
    def run(self, job: GenerationJob) -> BackendResult:
        if requests is None:
            raise RuntimeError("requests is required")
        headers = {"Content-Type": "application/json"}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        response = requests.post(self.url, headers=headers, json=asdict(job), timeout=600)
        if response.status_code >= 400:
            return BackendResult(ok=False, error=response.text, raw={"status": response.status_code})
        data = response.json() if response.text.strip().startswith("{") else {"text": response.text}
        output = data.get("output_path") or data.get("path")
        remote = data.get("image_url") or data.get("url")
        if remote and not output:
            output = job.output_path
            save_bytes_from_url(remote, Path(output))
        return BackendResult(ok=True, output_path=output, remote_url=remote, raw=data)

class FalQueueBackend(ImageBackend):
    name = "fal"
    def __init__(self, api_key: str = "", base_url: str = "https://queue.fal.run") -> None:
        self.api_key = api_key or os.getenv("FAL_KEY") or os.getenv("FAL_API_KEY") or ""
        self.base_url = base_url.rstrip("/")
        if not self.api_key:
            raise ValueError("Fal backend requires FAL_KEY or FAL_API_KEY")
    def headers(self) -> Dict[str, str]:
        return {"Authorization": f"Key {self.api_key}", "Content-Type": "application/json"}
    def build_payload(self, job: GenerationJob) -> Dict[str, Any]:
        payload: Dict[str, Any] = {"prompt": job.prompt, "negative_prompt": job.negative_prompt, "seed": job.seed, "num_images": 1}
        if job.reference_images:
            ref = job.reference_images[0]
            payload["image_url"] = image_to_data_uri(Path(ref)) if Path(ref).exists() else ref
            payload["strength"] = job.strength
        if "x" in job.size:
            w, h = job.size.split("x", 1)
            payload["image_size"] = {"width": int(w), "height": int(h)}
        if job.transparent_background:
            payload["transparent_background"] = True
        return payload
    def extract_image_url(self, data: Dict[str, Any]) -> Optional[str]:
        for key in ["image_url", "url", "output_url"]:
            if isinstance(data.get(key), str) and data[key].startswith("http"):
                return data[key]
        images = data.get("images")
        if isinstance(images, list) and images:
            first = images[0]
            if isinstance(first, dict):
                return first.get("url") or first.get("image_url")
            if isinstance(first, str):
                return first
        return None
    def run(self, job: GenerationJob) -> BackendResult:
        if requests is None:
            raise RuntimeError("requests is required")
        out_path = Path(job.output_path)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        try:
            response = requests.post(f"{self.base_url}/{job.model}", headers=self.headers(), json=self.build_payload(job), timeout=300)
            if response.status_code >= 400:
                return BackendResult(ok=False, error=response.text, raw={"status": response.status_code, "model": job.model})
            data = response.json()
            image_url = self.extract_image_url(data)
            if not image_url:
                pending = out_path.with_suffix(".fal-pending.json")
                json_write(pending, {"job": asdict(job), "fal_response": data, "created_at": now_iso()})
                return BackendResult(ok=True, output_path=str(pending), raw=data)
            save_bytes_from_url(image_url, out_path)
            return BackendResult(ok=True, output_path=str(out_path), remote_url=image_url, raw=data)
        except Exception as exc:
            return BackendResult(ok=False, error=str(exc), raw={"model": job.model})

class PhotoshopManifestBackend(ImageBackend):
    name = "photoshop-manifest"
    def run(self, job: GenerationJob) -> BackendResult:
        target = PHOTOSHOP_DIR / f"{job.agent_slug}.{job.style}.photoshop.json"
        manifest = {"schema": "miseos.photoshop.batch.v1", "created_at": now_iso(), "agent": job.agent_name, "style": job.style, "mode": job.mode, "input_references": job.reference_images, "desired_output_path": job.output_path, "tasks": ["preserve identity markers", "clean background to transparent PNG when character-only style", "fix hands/eyes/edge halos", "upscale without changing silhouette", "export final PNG"], "prompt": job.prompt, "negative_prompt": job.negative_prompt}
        json_write(target, manifest)
        return BackendResult(ok=True, output_path=str(target), raw=manifest)

def make_backend(name: str) -> ImageBackend:
    name = name.lower().strip()
    if name == "local":
        return LocalPromptBackend()
    if name == "fal":
        return FalQueueBackend()
    if name in {"webhook", "yepcode", "catalyst"}:
        return GenericWebhookBackend(url=os.getenv("MISEOS_IMAGE_WEBHOOK_URL") or os.getenv("YEPCODE_WEBHOOK_URL") or os.getenv("CATALYST_IMAGE_URL") or "", token=os.getenv("MISEOS_IMAGE_WEBHOOK_TOKEN") or "")
    if name in {"photoshop", "photoshop-manifest", "adobe"}:
        return PhotoshopManifestBackend()
    raise ValueError(f"Unknown backend: {name}")


def build_jobs(agents: Sequence[Agent], backend: str = "local") -> Dict[str, List[GenerationJob]]:
    styles = ["chibi", "kawaii", "shimeji", "card-front", "card-back"]
    jobs: Dict[str, List[GenerationJob]] = {style: [] for style in styles}
    for agent in agents:
        for style in styles:
            if style in {"card-front", "card-back"} and not agent.mint_eligible:
                continue
            jobs[style].append(job_for_agent(agent, style, backend))
    return jobs

def write_jobs(jobs: Dict[str, List[GenerationJob]]) -> None:
    for style, style_jobs in jobs.items():
        jsonl_write(JOBS_DIR / f"{style}.jsonl", [asdict(j) for j in style_jobs])
    all_animation, all_comics = [], []
    for job in jobs.get("chibi", []):
        all_animation.append({"agent": job.agent_name, "slug": job.agent_slug, "prompt": job.metadata["animation_prompt"], "target": "Krikey-compatible short loop prompt"})
        all_comics.append({"agent": job.agent_name, "slug": job.agent_slug, "prompt": job.metadata["comic_prompt"], "target": "MangaBoom-compatible 4-panel comic prompt"})
    json_write(MANIFESTS_DIR / "krikey_animation_prompts.json", all_animation)
    json_write(MANIFESTS_DIR / "mangaboom_comic_prompts.json", all_comics)

def run_jobs(style: str, backend_name: str, limit: Optional[int] = None) -> None:
    backend = make_backend(backend_name)
    path = JOBS_DIR / f"{style}.jsonl"
    if not path.exists():
        raise FileNotFoundError(f"Missing job file: {path}. Run prepare first.")
    results = []
    for idx, raw in enumerate(jsonl_read(path), start=1):
        if limit and idx > limit:
            break
        job = GenerationJob(**raw)
        job.backend = backend_name
        result = backend.run(job)
        results.append({"agent": job.agent_name, "slug": job.agent_slug, "style": style, "backend": backend_name, "result": dataclasses.asdict(result), "at": now_iso()})
        print(f"[{'OK' if result.ok else 'ERR'}] {style} :: {job.agent_name} -> {result.output_path or result.remote_url or result.error}")
    json_write(LOGS_DIR / f"run_{style}_{backend_name}.json", results)


def cutout_alpha_cleanup(im: Image.Image, threshold: int = 245) -> Image.Image:
    im = im.convert("RGBA")
    data = []
    for r, g, b, a in im.getdata():
        data.append((255, 255, 255, 0) if r > threshold and g > threshold and b > threshold else (r, g, b, a))
    im.putdata(data)
    return im

def postprocess_refined(style: str, white_cutout: bool = False) -> None:
    folder = REFINED_DIR / style
    for path in folder.glob("*.*"):
        if path.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
            continue
        im = load_image(str(path))
        if white_cutout:
            im = cutout_alpha_cleanup(im)
        im = fit_transparent(im, (512, 512) if style == "shimeji" else (1024, 1024))
        im.save(path.with_suffix(".png"))
        print(f"[post] {path}")


def shimeji_frame(base: Image.Image, idx: int, state: str) -> Image.Image:
    canvas = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    char = ImageOps.contain(base, (96, 96), method=Image.Resampling.LANCZOS)
    if state == "idle":
        wobble, bounce, rot = [0, -2, 0, 2, 0, -1, 0, 1][idx % 8], [0, -2, -4, -2, 0, 1, 0, -1][idx % 8], [-1, 0, 1, 0, -1, 0, 1, 0][idx % 8]
    elif state == "walk":
        wobble, bounce, rot = [-5, -3, 0, 3, 5, 3, 0, -3][idx % 8], [0, -1, -2, -1, 0, -1, -2, -1][idx % 8], [-3, -1, 1, 3, 2, 0, -2, -3][idx % 8]
    elif state == "sit":
        wobble, bounce, rot = 0, [4, 4, 5, 4, 4, 3, 4, 4][idx % 8], 0
        char = char.resize((int(char.width * 0.95), int(char.height * 0.82)), Image.Resampling.LANCZOS)
    else:
        wobble, bounce, rot = [0, 1, 2, 1, 0, -1, -2, -1][idx % 8], 0, 90
    if rot:
        char = char.rotate(rot, resample=Image.Resampling.BICUBIC, expand=True)
    x, y = (128 - char.width) // 2 + wobble, (128 - char.height) // 2 + 12 + bounce
    canvas.alpha_composite(char, (x, y))
    return canvas

def build_shimeji_sheet(agent: Agent) -> Optional[str]:
    source = REFINED_DIR / "shimeji" / f"{agent.slug}.png"
    if not source.exists():
        for style in ["chibi", "kawaii"]:
            alt = REFINED_DIR / style / f"{agent.slug}.png"
            if alt.exists():
                source = alt
                break
        else:
            return None
    base = fit_transparent(load_image(str(source)), (512, 512))
    states = ["idle", "walk", "sit", "cling"]
    frames = []
    frame_root = SPRITES_DIR / "frames" / agent.slug
    frame_root.mkdir(parents=True, exist_ok=True)
    for state in states:
        for i in range(8):
            frame = shimeji_frame(base, i, state)
            frame.save(frame_root / f"{state}_{i:02d}.png")
            frames.append(frame)
    sheet = Image.new("RGBA", (8 * 128, 4 * 128), (0, 0, 0, 0))
    for row, state in enumerate(states):
        for col in range(8):
            sheet.alpha_composite(frames[row * 8 + col], (col * 128, row * 128))
    out = SPRITES_DIR / "sheets" / f"{agent.slug}.png"
    sheet.save(out)
    json_write(SPRITES_DIR / "sheets" / f"{agent.slug}.manifest.json", {"schema": "miseos.shimeji.v2", "agent": agent.name, "slug": agent.slug, "sheet": str(out), "frame_size": [128, 128], "states": {"idle": {"row": 0, "frames": 8}, "walk": {"row": 1, "frames": 8}, "sit": {"row": 2, "frames": 8}, "cling": {"row": 3, "frames": 8}}})
    return str(out)

def build_shimejis(agents: Sequence[Agent]) -> None:
    count = 0
    for agent in agents:
        out = build_shimeji_sheet(agent)
        if out:
            print(f"[shimeji] {agent.name} -> {out}")
            count += 1
    print(f"[shimeji] built {count} sprite sheets")


def gradient(size: Tuple[int, int], top: str, bottom: str) -> Image.Image:
    w, h = size
    tr, tg, tb = hex_to_rgb(top); br, bg, bb = hex_to_rgb(bottom)
    img = Image.new("RGBA", size)
    px = img.load()
    for y in range(h):
        t = y / max(1, h - 1)
        r, g, b = int(tr * (1 - t) + br * t), int(tg * (1 - t) + bg * t), int(tb * (1 - t) + bb * t)
        for x in range(w):
            px[x, y] = (r, g, b, 255)
    return img

def add_vignette(im: Image.Image, strength: int = 150) -> None:
    w, h = im.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    px = overlay.load()
    cx, cy, maxd = w / 2, h / 2, math.sqrt((w / 2) ** 2 + (h / 2) ** 2)
    for y in range(h):
        for x in range(w):
            d = math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / maxd
            a = int(max(0, (d - 0.45) / 0.55) * strength)
            px[x, y] = (0, 0, 0, a)
    im.alpha_composite(overlay)

def add_circuit_lines(im: Image.Image, accent: str, seed: int) -> None:
    rng, draw = random.Random(seed), ImageDraw.Draw(im, "RGBA")
    w, h = im.size
    color = rgba(accent, 90)
    for _ in range(36):
        x, y, length = rng.randint(40, w - 40), rng.randint(40, h - 40), rng.randint(80, 260)
        pts = [(x, y), (min(w - 40, x + length), y), (min(w - 40, x + length), min(h - 40, y + rng.randint(20, 100)))] if rng.random() > 0.5 else [(x, y), (x, min(h - 40, y + length)), (min(w - 40, x + rng.randint(20, 100)), min(h - 40, y + length))]
        draw.line(pts, fill=color, width=2)
        for px, py in pts:
            draw.ellipse((px - 5, py - 5, px + 5, py + 5), outline=color, width=2)

def add_holo(im: Image.Image, seed: int, intensity: int = 90) -> None:
    rng, overlay = random.Random(seed), Image.new("RGBA", im.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay, "RGBA")
    w, h = im.size
    rainbow = [(255, 85, 145), (255, 180, 65), (255, 240, 110), (90, 230, 170), (70, 190, 255), (160, 120, 255)]
    for i in range(22):
        x, y, band_w, band_h = rng.randint(-w // 2, w), rng.randint(0, h), rng.randint(180, 420), rng.randint(18, 42)
        c = rainbow[i % len(rainbow)]
        draw.polygon([(x, y), (x + band_w, y - 90), (x + band_w + 80, y - 90 + band_h), (x + 80, y + band_h)], fill=(c[0], c[1], c[2], rng.randint(18, intensity)))
    im.alpha_composite(overlay.filter(ImageFilter.GaussianBlur(2)))

def add_sparkles(im: Image.Image, seed: int, accent: str, amount: int = 100) -> None:
    rng, draw = random.Random(seed), ImageDraw.Draw(im, "RGBA")
    w, h = im.size
    ar, ag, ab = hex_to_rgb(accent)
    for _ in range(amount):
        x, y, r, a = rng.randint(40, w - 40), rng.randint(40, h - 40), rng.randint(1, 5), rng.randint(50, 180)
        draw.ellipse((x - r, y - r, x + r, y + r), fill=(255, 255, 255, a))
        if rng.random() < 0.35:
            draw.line((x - r * 3, y, x + r * 3, y), fill=(ar, ag, ab, a), width=1)
            draw.line((x, y - r * 3, x, y + r * 3), fill=(ar, ag, ab, a), width=1)

def stat_block(agent: Agent) -> Dict[str, int]:
    if agent.stats:
        out = {}
        for k, v in agent.stats.items():
            try:
                out[str(k).title()] = max(1, min(100, int(v)))
            except Exception:
                pass
        if out:
            return dict(list(out.items())[:6])
    rng = random.Random(stable_seed(agent.slug))
    return {"Precision": rng.randint(72, 99), "Speed": rng.randint(68, 99), "Resilience": rng.randint(70, 99), "Magic": rng.randint(68, 99), "Teamwork": rng.randint(70, 99), "Spark": rng.randint(65, 99)}

def make_placeholder_character(agent: Agent, size: Tuple[int, int] = (900, 900)) -> Image.Image:
    w, h = size
    im, draw = Image.new("RGBA", size, (0, 0, 0, 0)), ImageDraw.Draw(Image.new("RGBA", size, (0, 0, 0, 0)), "RGBA")
    im = Image.new("RGBA", size, (0, 0, 0, 0)); draw = ImageDraw.Draw(im, "RGBA")
    accent = theme_for_department(agent.department)["accent"]
    for r, alpha in [(360, 24), (260, 36), (170, 48)]:
        draw.ellipse((w//2-r, h//2-r, w//2+r, h//2+r), outline=rgba(accent, alpha), width=8)
    draw.ellipse((300, 90, 600, 390), fill=(255, 232, 200, 255), outline=(20, 20, 20, 255), width=8)
    draw.rounded_rectangle((330, 350, 570, 700), radius=80, fill=(20, 20, 25, 255), outline=rgba(accent, 255), width=8)
    draw.rectangle((260, 120, 640, 230), fill=(245, 245, 245, 255), outline=(20, 20, 20, 255), width=8)
    draw.ellipse((300, 40, 600, 180), fill=(255, 255, 255, 255), outline=(20, 20, 20, 255), width=8)
    draw.ellipse((370, 230, 420, 290), fill=(10, 10, 15, 255)); draw.ellipse((480, 230, 530, 290), fill=(10, 10, 15, 255))
    draw.line((600, 360, 730, 250), fill=rgba(accent, 255), width=14); draw.ellipse((700, 200, 800, 300), fill=rgba(accent, 230), outline=(255,255,255,230), width=5)
    font, label = safe_font(42, True), agent.name[:24]
    bbox = draw.textbbox((0,0), label, font=font)
    draw.text(((w-(bbox[2]-bbox[0]))//2, 760), label, font=font, fill=(255,255,255,255))
    return im

def character_art_for_card(agent: Agent) -> Image.Image:
    for style in ["card-front", "chibi", "kawaii", "shimeji"]:
        path = REFINED_DIR / style / f"{agent.slug}.png"
        if path.exists():
            return load_image(str(path))
    if agent.source_image and Path(agent.source_image).exists():
        return load_image(agent.source_image)
    return make_placeholder_character(agent)

def render_card_front(agent: Agent) -> Optional[str]:
    if not agent.mint_eligible:
        return None
    W, H = 1600, 2240
    dept, rarity, seed = theme_for_department(agent.department), theme_for_rarity(agent.rarity), stable_seed(f"card:{agent.slug}:front")
    card = gradient((W, H), dept["dark"], "#090909").convert("RGBA")
    add_circuit_lines(card, dept["accent"], seed); add_holo(card, seed, 95); add_sparkles(card, seed + 10, rarity["accent"], 140); add_vignette(card, 185)
    draw = ImageDraw.Draw(card, "RGBA")
    font_title, font_big, font_med, font_small, font_tiny = safe_font(82, True), safe_font(52, True), safe_font(38, True), safe_font(28, False), safe_font(22, False)
    draw.rounded_rectangle((44, 44, W - 44, H - 44), radius=72, outline=rgba(rarity["accent"], 255), width=10)
    draw.rounded_rectangle((72, 72, W - 72, H - 72), radius=56, outline=(255, 245, 218, 180), width=3)
    draw.rounded_rectangle((110, 110, W - 110, 270), radius=42, fill=(8, 8, 12, 205), outline=rgba(dept["accent"], 210), width=4)
    draw.text((150, 132), agent.name.upper(), font=font_title, fill=(255, 248, 225, 255))
    draw.text((154, 220), f"{agent.role}  •  {agent.department}", font=font_small, fill=(255, 230, 180, 230))
    seal_box = (W - 500, 125, W - 145, 245)
    draw.rounded_rectangle(seal_box, radius=36, fill=rgba(rarity["accent"], 210), outline=(255,255,255,200), width=3)
    bbox = draw.textbbox((0, 0), rarity["seal"], font=font_med)
    draw.text((seal_box[0] + (seal_box[2]-seal_box[0] - (bbox[2]-bbox[0]))//2, 158), rarity["seal"], font=font_med, fill=(15, 10, 10, 255))
    stage = (120, 330, W - 120, 1320)
    draw.rounded_rectangle(stage, radius=54, fill=(255,255,255,42), outline=(255,255,255,120), width=3)
    draw.ellipse((300, 1080, W-300, 1420), fill=rgba(dept["accent"], 38), outline=rgba(rarity["accent"], 90), width=3)
    art = fit_transparent(character_art_for_card(agent), (1180, 930))
    shadow = Image.new("RGBA", art.size, (0,0,0,0)); alpha = art.getchannel("A").filter(ImageFilter.GaussianBlur(18)); shadow.putalpha(alpha.point(lambda p: min(130, p)))
    card.alpha_composite(shadow, (235, 401)); card.alpha_composite(art, (210, 360))
    draw.polygon([(160, 1230), (980, 600), (1080, 660), (250, 1320)], fill=(255,255,255,38))
    panel = (120, 1390, W - 120, 1950)
    draw.rounded_rectangle(panel, radius=52, fill=(7, 9, 14, 215), outline=rgba(dept["accent"], 210), width=4)
    draw.text((170, 1440), "SIGNATURE PROTOCOL", font=font_big, fill=(255, 238, 190, 255))
    protocol = agent.command or agent.signature_phrase or f"{agent.role} protocol"
    summary = agent.summary or agent.unique_trait or f"{agent.name} coordinates {agent.department} work with precision."
    draw.text((174, 1518), protocol[:58], font=font_med, fill=rgba(rarity["accent"], 255))
    draw.multiline_text((174, 1586), wrap_text(summary, 62)[:480], font=font_small, fill=(245,245,245,235), spacing=14)
    for i, (k, v) in enumerate(stat_block(agent).items()):
        y = 1740 + i * 54
        draw.text((174, y), k.upper(), font=font_tiny, fill=(255, 238, 190, 225))
        draw.rounded_rectangle((424, y + 10, 1044, y + 34), radius=12, fill=(255,255,255,38))
        draw.rounded_rectangle((424, y + 10, 424 + int(6.2 * v), y + 34), radius=12, fill=rgba(rarity["accent"], 220))
        draw.text((1074, y - 2), str(v), font=font_tiny, fill=(255,255,255,225))
    draw.rounded_rectangle((120, 2000, W - 120, 2110), radius=36, fill=(255,255,255,210))
    draw.text((165, 2036), f"MISEOS • {DEFAULT_CHAIN} • {DEFAULT_TOKEN_STANDARD} • {agent.slug}", font=font_small, fill=(15,15,18,255))
    draw.text((W - 450, 2036), "COOK · ORCHESTRATE · DEPLOY", font=font_tiny, fill=(15,15,18,230))
    out = CARDS_DIR / "png" / f"{agent.slug}.png"; out.parent.mkdir(parents=True, exist_ok=True); card.save(out)
    return str(out)

def render_card_back(agent: Agent) -> Optional[str]:
    if not agent.mint_eligible:
        return None
    W, H = 1600, 2240
    dept, rarity, seed = theme_for_department(agent.department), theme_for_rarity(agent.rarity), stable_seed(f"card:{agent.slug}:back")
    card = gradient((W, H), "#0E0F10", dept["dark"]).convert("RGBA")
    add_circuit_lines(card, dept["accent"], seed); add_holo(card, seed + 55, 55); add_sparkles(card, seed + 80, dept["accent"], 70); add_vignette(card, 200)
    draw = ImageDraw.Draw(card, "RGBA")
    font_title, font_big, font_med, font_small = safe_font(70, True), safe_font(50, True), safe_font(34, True), safe_font(28, False)
    draw.rounded_rectangle((44, 44, W - 44, H - 44), radius=72, outline=rgba(rarity["accent"], 255), width=10)
    draw.rounded_rectangle((72, 72, W - 72, H - 72), radius=56, outline=(255,245,218,180), width=3)
    cx, cy = W // 2, 330
    for r, a in [(230,45), (160,90), (90,140)]:
        draw.ellipse((cx-r, cy-r, cx+r, cy+r), outline=rgba(dept["accent"], a), width=6)
    draw.text((175, 110), "MISEOS ORCHESTRA", font=font_title, fill=(255,248,225,255))
    draw.text((180, 195), "Kitchen Chaos DevOps Universe", font=font_small, fill=(255,230,180,230))
    draw.text((cx-180, cy-35), "Mise", font=font_big, fill=(255,248,225,255)); draw.text((cx-8, cy-35), "OS", font=font_big, fill=rgba(rarity["accent"],255))
    box = (140, 610, W - 140, 1110)
    draw.rounded_rectangle(box, radius=46, fill=(255,255,255,205), outline=rgba(dept["accent"],230), width=4)
    draw.text((190, 660), "LORE", font=font_big, fill=(20,18,14,255))
    lore = agent.lore or agent.unique_trait or f"{agent.name} keeps the {agent.department} station in rhythm, turning chaos into service."
    draw.multiline_text((190, 735), wrap_text(lore, 72)[:650], font=font_small, fill=(35,35,35,255), spacing=13)
    meta = (140, 1190, W - 140, 1840)
    draw.rounded_rectangle(meta, radius=46, fill=(8,9,14,215), outline=(255,255,255,100), width=3)
    draw.text((190, 1240), "CHAIN-READY METADATA", font=font_big, fill=(255,238,190,255))
    fields = [("Name", agent.name), ("Role", agent.role), ("Department", agent.department), ("Rarity", agent.rarity), ("Standard", DEFAULT_TOKEN_STANDARD), ("Royalty", DEFAULT_ROYALTY_INTERFACE), ("Chain", DEFAULT_CHAIN), ("Refine Mode", str(agent.refine_only))]
    y = 1325
    for label, value in fields:
        draw.text((195, y), f"{label}:", font=font_med, fill=rgba(dept["accent"], 255))
        draw.text((520, y), str(value)[:48], font=font_small, fill=(245,245,245,235)); y += 58
    draw.rounded_rectangle((140, 1940, W - 140, 2075), radius=40, fill=rgba(rarity["accent"], 215))
    draw.multiline_text((200, 1978), wrap_text("EVERY AGENT HAS A ROLE. EVERY ROLE HAS PURPOSE. EVERY ACTION IS ORCHESTRATED.", 72), font=font_small, fill=(10,10,12,255), spacing=10)
    out = CARDS_DIR / "back" / f"{agent.slug}-back.png"; out.parent.mkdir(parents=True, exist_ok=True); card.save(out)
    return str(out)

def render_cards(agents: Sequence[Agent]) -> None:
    count = 0
    for agent in agents:
        if not agent.mint_eligible:
            continue
        front = render_card_front(agent); render_card_back(agent)
        if front:
            print(f"[card] {agent.name} -> {front}"); count += 1
    print(f"[card] rendered {count} mint-eligible cards")


def erc721_metadata(agent: Agent) -> Dict[str, Any]:
    attrs: List[Dict[str, Any]] = [
        {"trait_type": "Department", "value": agent.department}, {"trait_type": "Role", "value": agent.role},
        {"trait_type": "Rarity", "value": agent.rarity}, {"trait_type": "Refine Only", "value": str(agent.refine_only)},
        {"trait_type": "Mise Name", "value": agent.mise_name or "N/A"}, {"trait_type": "Codename", "value": agent.codename or "N/A"},
    ]
    attrs += [{"display_type": "number", "trait_type": k, "value": v} for k, v in stat_block(agent).items()]
    return {
        "name": agent.name,
        "description": f"{agent.name} is a {agent.rarity} MiseOS / Mise Orchestra collectible agent. Role: {agent.role}. Department: {agent.department}. Creator collectible metadata only; no investment, resale, or profit language.",
        "image": f"ipfs://REPLACE_WITH_CID/cards/png/{agent.slug}.png",
        "animation_url": f"ipfs://REPLACE_WITH_CID/sprites/sheets/{agent.slug}.png",
        "external_url": "https://miseos.dev",
        "attributes": attrs,
        "properties": {"token_standard": DEFAULT_TOKEN_STANDARD, "royalty_interface": DEFAULT_ROYALTY_INTERFACE, "recommended_chain": DEFAULT_CHAIN, "card_back": f"ipfs://REPLACE_WITH_CID/cards/back/{agent.slug}-back.png", "source_character": agent.slug, "command": agent.command, "synced_agents": agent.synced_agents, "blockscout": {"note": "Fill after contract deployment.", "chain": DEFAULT_CHAIN, "contract_address": "0xREPLACE_AFTER_DEPLOY", "token_id": agent.id, "explorer_url": "https://REPLACE-BLOCKSCOUT-INSTANCE/token/0xREPLACE_AFTER_DEPLOY/instance/REPLACE_TOKEN_ID"}},
    }

def write_mint_metadata(agents: Sequence[Agent]) -> None:
    rows = []
    for agent in agents:
        if not agent.mint_eligible:
            continue
        path = METADATA_DIR / f"{agent.slug}.json"
        json_write(path, erc721_metadata(agent))
        rows.append({"id": agent.id, "slug": agent.slug, "name": agent.name, "rarity": agent.rarity, "department": agent.department, "metadata_json": str(path), "card_png": str(CARDS_DIR / "png" / f"{agent.slug}.png"), "sprite_sheet": str(SPRITES_DIR / "sheets" / f"{agent.slug}.png")})
    json_write(MANIFESTS_DIR / "mint_collection_manifest.json", {"schema": "miseos.collection.v2", "created_at": now_iso(), "version": VERSION, "collection": "MiseOS / Mise Orchestra Agent Brigade", "chain_recommendation": DEFAULT_CHAIN, "token_standard": DEFAULT_TOKEN_STANDARD, "royalty_interface": DEFAULT_ROYALTY_INTERFACE, "total_mint_eligible": len(rows), "note": "Creator collectible metadata. No investment, resale, or profit language is included.", "cards": rows})
    print(f"[mint] wrote metadata for {len(rows)} agents")


def write_platform_manifests(agents: Sequence[Agent]) -> None:
    json_write(MANIFESTS_DIR / "catalyst_deployment_plan.json", {"schema": "miseos.catalyst.deployment-plan.v1", "created_at": now_iso(), "features": CATALYST_FEATURE_MAP, "suggested_layout": {"Web Client Hosting": "host preview gallery from output/preview", "Functions": "run image job coordinator / metadata API", "Filestore": "store card PNGs, sprite sheets, reference images", "API Gateway": "public API for roster, cards, jobs, health", "Webhooks": "receive image completion callbacks"}})
    json_write(MANIFESTS_DIR / "yepcode_webhook_plan.json", {"schema": "miseos.yepcode.webhook-plan.v1", "created_at": now_iso(), "env": ["MISEOS_IMAGE_WEBHOOK_URL", "MISEOS_IMAGE_WEBHOOK_TOKEN", "FAL_KEY", "FAL_API_KEY"], "payload_contract": {"prompt": "string", "negative_prompt": "string", "reference_images": "array", "output_path": "string", "style": "string", "mode": "generate|refine", "metadata": "object"}})
    json_write(MANIFESTS_DIR / "github_preview_plan.json", {"schema": "miseos.github.preview-plan.v1", "created_at": now_iso(), "recommended_paths": ["docs/README_REPLACEMENT.md", "public/miseos-agent-gallery/", "src/components/MiseAgentCard.tsx", "src/data/miseos-roster.json"], "note": "No GitHub write occurs from this script. Use generated files as a patch source."})
    json_write(MANIFESTS_DIR / "conductor_content_plan.json", {"schema": "miseos.conductor.content-plan.v1", "created_at": now_iso(), "seo_title": "MiseOS Agent Brigade — 112 Characters + 23 Registry Manifests", "description": "Interactive MiseOS DevOps brigade with 112 character cards, 23 registry manifests, shimeji sprites, collectible cards, and repo-safe agent workflows.", "keywords": ["MiseOS", "DevOps", "AI agents", "chibi", "shimeji", "collectible cards", "agent workflow"]})
    print("[platform] wrote Catalyst, YepCode, GitHub, Conductor manifests")


def render_preview_card(c: Dict[str, Any]) -> str:
    visual = f'<img src="{c["img"]}" alt="{c["name"]}"/>' if c["img"] else f'<div class="placeholder">{c["name"]}<br/>card pending</div>'
    mint = '<span class="badge">MINT ELIGIBLE</span>' if c["mint"] else ''
    return f'''<article class="card">{visual}<div class="name">{c["name"]}</div><div class="meta">{c["role"]} • {c["department"]} • {c["rarity"]}</div>{mint}</article>'''

def write_preview(agents: Sequence[Agent]) -> None:
    cards = []
    for a in agents:
        card_path = CARDS_DIR / "png" / f"{a.slug}.png"
        cards.append({"name": a.name, "slug": a.slug, "role": a.role, "department": a.department, "rarity": a.rarity, "img": f"../cards/png/{a.slug}.png" if card_path.exists() else "", "mint": a.mint_eligible})
    html = """<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>MiseOS Art Factory Preview</title><style>:root{--bg:#0E0F10;--gold:#D4AF37;--cream:#F6F1E7}body{margin:0;background:radial-gradient(circle at top,#1b1608,#0E0F10 48%,#050505);color:var(--cream);font-family:Inter,system-ui,Arial,sans-serif}header{padding:42px 5vw 20px;border-bottom:1px solid rgba(212,175,55,.25)}.kicker{color:var(--gold);letter-spacing:.28em;text-transform:uppercase;font-size:12px}h1{margin:.25rem 0;font-size:clamp(38px,6vw,86px)}p{max-width:900px;color:rgba(246,241,231,.72);line-height:1.5}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:22px;padding:36px 5vw 80px}.card{position:relative;padding:14px;border:1px solid rgba(212,175,55,.35);border-radius:22px;background:linear-gradient(145deg,rgba(255,255,255,.08),rgba(255,255,255,.02));overflow:hidden;min-height:340px;transform-style:preserve-3d;transition:.25s ease}.card:hover{transform:translateY(-8px) rotateX(4deg) rotateY(-4deg);border-color:var(--gold)}.card::before{content:"";position:absolute;inset:-40%;background:linear-gradient(115deg,transparent,rgba(255,255,255,.14),transparent);transform:translateX(-60%);transition:.6s ease}.card:hover::before{transform:translateX(60%)}.card img{width:100%;aspect-ratio:10/14;object-fit:cover;border-radius:16px;background:#111}.name{font-weight:800;margin-top:12px}.meta{color:rgba(246,241,231,.62);font-size:12px;margin-top:4px}.badge{display:inline-block;color:#111;background:var(--gold);border-radius:999px;padding:4px 8px;font-size:11px;margin-top:8px}.placeholder{height:300px;display:grid;place-items:center;text-align:center;border-radius:16px;background:radial-gradient(circle,rgba(212,175,55,.18),rgba(255,255,255,.03))}</style></head><body><header><div class="kicker">MiseOS Art Factory v2</div><h1>112 character cards. 23 registry manifests. 135 ecosystem items.</h1><p>Character-card pipeline preview. Registry manifests are product/package items and are written separately under output/manifests.</p></header><main class="grid">""" + "".join(render_preview_card(c) for c in cards) + "</main></body></html>"
    out = PREVIEW_DIR / "index.html"
    out.write_text(html, encoding="utf-8")
    print(f"[preview] {out}")


def write_report(agents: Sequence[Agent]) -> None:
    counts, rarities = {}, {}
    for a in agents:
        counts[a.department] = counts.get(a.department, 0) + 1
        rarities[a.rarity] = rarities.get(a.rarity, 0) + 1
    premium, refine = [a for a in agents if a.mint_eligible], [a for a in agents if a.refine_only]
    registry = load_registry_catalog()
    report = {"schema": "miseos.artfactory.report.v2", "created_at": now_iso(), "version": VERSION, "actual_loaded_agents": len(agents), "official_character_cards": OFFICIAL_CHARACTER_CARD_COUNT, "total_registry_manifests": len(registry), "official_ecosystem_items": OFFICIAL_CHARACTER_CARD_COUNT + len(registry), "department_counts": counts, "rarity_counts": rarities, "mint_eligible": len(premium), "strict_refine_only": len(refine), "fal_models": FAL_ENDPOINTS, "outputs": {"roster": str(ROSTER_OUT), "registry_catalog": str(MANIFESTS_DIR / "registry_catalog_manifest.json"), "jobs": str(JOBS_DIR), "cards": str(CARDS_DIR), "sprites": str(SPRITES_DIR), "manifests": str(MANIFESTS_DIR), "preview": str(PREVIEW_DIR / "index.html")}}
    json_write(LOGS_DIR / "art_factory_report.json", report)
    md = ["# MiseOS Art Factory v2 Report", "", f"- Version: `{VERSION}`", f"- Generated at: `{now_iso()}`", f"- Actual loaded agents: **{len(agents)}**", f"- Official character cards: **{OFFICIAL_CHARACTER_CARD_COUNT}**", f"- Registry manifests: **{len(registry)}**", f"- Total ecosystem items: **{OFFICIAL_CHARACTER_CARD_COUNT + len(registry)}**", f"- Mint eligible: **{len(premium)}**", f"- Strict refine only: **{len(refine)}**", "", "## Departments", ""]
    md += [f"- {k}: {v}" for k, v in sorted(counts.items())]
    md += ["", "## Rarities", ""]
    md += [f"- {k}: {v}" for k, v in sorted(rarities.items(), key=lambda item: theme_for_rarity(item[0])["rank"])]
    (LOGS_DIR / "ART_FACTORY_REPORT.md").write_text("\n".join(md), encoding="utf-8")


def cmd_prepare(args: argparse.Namespace) -> None:
    agents = load_roster(); jobs = build_jobs(agents, backend=args.backend); write_jobs(jobs); write_platform_manifests(agents); write_registry_catalog_manifest(); write_brand_docs(agents); write_report(agents)
    print(f"[prepare] agents={len(agents)} registry_manifests={len(load_registry_catalog())} official_ecosystem_items={OFFICIAL_CHARACTER_CARD_COUNT + len(load_registry_catalog())} backend={args.backend}")

def cmd_generate(args: argparse.Namespace) -> None:
    run_jobs(style=args.style, backend_name=args.backend, limit=args.limit)

def cmd_postprocess(args: argparse.Namespace) -> None:
    postprocess_refined(args.style, white_cutout=args.white_cutout)

def cmd_shimeji(args: argparse.Namespace) -> None:
    agents = load_roster(); build_shimejis(agents); write_report(agents)

def cmd_cards(args: argparse.Namespace) -> None:
    agents = load_roster(); render_cards(agents); write_mint_metadata(agents); write_preview(agents); write_report(agents)

def cmd_mint(args: argparse.Namespace) -> None:
    agents = load_roster(); write_mint_metadata(agents); write_report(agents)

def cmd_preview(args: argparse.Namespace) -> None:
    agents = load_roster(); write_preview(agents); write_report(agents)

def cmd_all(args: argparse.Namespace) -> None:
    agents = load_roster(); jobs = build_jobs(agents, backend=args.backend); write_jobs(jobs); write_platform_manifests(agents)
    if args.run_generation:
        for style in ["chibi", "kawaii", "shimeji", "card-front", "card-back"]:
            run_jobs(style=style, backend_name=args.backend, limit=args.limit)
    if args.white_cutout:
        for style in ["chibi", "kawaii", "shimeji"]:
            postprocess_refined(style, white_cutout=True)
    build_shimejis(agents); render_cards(agents); write_mint_metadata(agents); write_preview(agents); write_registry_catalog_manifest(); write_brand_docs(agents); write_report(agents)
    print(f"[all] complete agents={len(agents)} registry_manifests={len(load_registry_catalog())} official_ecosystem_items={OFFICIAL_CHARACTER_CARD_COUNT + len(load_registry_catalog())}")

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="MiseOS Art Factory v2 — single-file chibi/kawaii/shimeji/mint-card pipeline")
    sub = parser.add_subparsers(dest="command", required=True)
    p = sub.add_parser("prepare", help="Merge roster and build prompt/job manifests"); p.add_argument("--backend", default="local", choices=["local", "fal", "webhook", "yepcode", "catalyst", "photoshop"]); p.set_defaults(func=cmd_prepare)
    p = sub.add_parser("generate", help="Run one job style through a backend"); p.add_argument("--style", required=True, choices=["chibi", "kawaii", "shimeji", "card-front", "card-back"]); p.add_argument("--backend", default="local", choices=["local", "fal", "webhook", "yepcode", "catalyst", "photoshop"]); p.add_argument("--limit", type=int, default=None); p.set_defaults(func=cmd_generate)
    p = sub.add_parser("postprocess", help="Normalize refined images and optional white-background cutout"); p.add_argument("--style", required=True, choices=["chibi", "kawaii", "shimeji", "card-front", "card-back"]); p.add_argument("--white-cutout", action="store_true"); p.set_defaults(func=cmd_postprocess)
    p = sub.add_parser("shimeji", help="Build shimeji sprite sheets from refined images"); p.set_defaults(func=cmd_shimeji)
    p = sub.add_parser("cards", help="Render premium mint-card fronts/backs and metadata"); p.set_defaults(func=cmd_cards)
    p = sub.add_parser("mint", help="Write ERC-721 metadata and collection manifest only"); p.set_defaults(func=cmd_mint)
    p = sub.add_parser("preview", help="Write static preview gallery"); p.set_defaults(func=cmd_preview)
    p = sub.add_parser("all", help="Prepare everything; optionally run generation too"); p.add_argument("--backend", default="local", choices=["local", "fal", "webhook", "yepcode", "catalyst", "photoshop"]); p.add_argument("--run-generation", action="store_true"); p.add_argument("--limit", type=int, default=None); p.add_argument("--white-cutout", action="store_true"); p.set_defaults(func=cmd_all)
    return parser

def main() -> None:
    ensure_dirs(); parser = build_parser(); args = parser.parse_args(); args.func(args)

if __name__ == "__main__":
    main()

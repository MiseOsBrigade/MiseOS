from __future__ import annotations

import hashlib
import json
import logging
import mimetypes
import os
import re
from datetime import datetime, timezone
from typing import Any

import functions_framework
from cloudevents.http import CloudEvent
from google.cloud import storage, vision

LOGGER = logging.getLogger(__name__)
LOGGER.setLevel(logging.INFO)

storage_client = storage.Client()
vision_client = vision.ImageAnnotatorClient()

SOURCE_BUCKET = os.environ["SOURCE_BUCKET"]
PUBLIC_BUCKET = os.environ["PUBLIC_BUCKET"]
AUDIT_BUCKET = os.environ["AUDIT_BUCKET"]
PUBLIC_BASE_URL = os.environ["PUBLIC_BASE_URL"].rstrip("/")
COLLECTION_CONFIG_OBJECT = os.getenv("COLLECTION_CONFIG_OBJECT", "config/collection.json")
VISION_ENABLED = os.getenv("VISION_ENABLED", "true").lower() == "true"

FILENAME_RE = re.compile(
    r"^(?P<token_id>\d+)-(?P<slug>[a-z0-9]+(?:-[a-z0-9]+)*)\.(?P<ext>png|jpg|jpeg|webp|gif)$",
    re.IGNORECASE,
)


def _json_from_blob(bucket_name: str, object_name: str) -> dict[str, Any] | None:
    blob = storage_client.bucket(bucket_name).blob(object_name)
    if not blob.exists():
        return None
    return json.loads(blob.download_as_text())


def _load_collection_config() -> dict[str, Any]:
    config = _json_from_blob(SOURCE_BUCKET, COLLECTION_CONFIG_OBJECT)
    if config:
        return config
    return {
        "name": "MiseOS Brigade",
        "description": "MiseOS character agent",
        "external_url_base": "https://miseos.example/characters",
        "vision": {"maximum_labels": 8, "minimum_score": 0.75},
    }


def _detect_labels(gcs_uri: str, config: dict[str, Any]) -> list[dict[str, Any]]:
    if not VISION_ENABLED:
        return []
    image = vision.Image()
    image.source.image_uri = gcs_uri
    response = vision_client.label_detection(image=image)
    if response.error.message:
        raise RuntimeError(response.error.message)

    vision_config = config.get("vision", {})
    minimum = float(vision_config.get("minimum_score", 0.75))
    maximum = int(vision_config.get("maximum_labels", 8))

    labels = []
    for annotation in response.label_annotations:
        if float(annotation.score) >= minimum:
            labels.append({
                "trait_type": "Vision Label",
                "value": annotation.description,
                "confidence": round(float(annotation.score), 4),
            })
    return labels[:maximum]


def _normalize_attributes(raw: list[dict[str, Any]]) -> list[dict[str, Any]]:
    seen: set[tuple[str, str]] = set()
    output = []
    for item in raw:
        trait_type = str(item.get("trait_type", "")).strip()
        value = item.get("value")
        if not trait_type or value is None:
            continue
        key = (trait_type.lower(), str(value).lower())
        if key in seen:
            continue
        seen.add(key)
        cleaned = {"trait_type": trait_type, "value": value}
        if "display_type" in item:
            cleaned["display_type"] = item["display_type"]
        if "confidence" in item:
            cleaned["confidence"] = item["confidence"]
        output.append(cleaned)
    return output


def _write_json(bucket_name: str, object_name: str, value: dict[str, Any],
                cache_control: str, metadata: dict[str, str] | None = None) -> None:
    blob = storage_client.bucket(bucket_name).blob(object_name)
    blob.cache_control = cache_control
    blob.content_type = "application/json; charset=utf-8"
    blob.metadata = metadata or {}
    blob.upload_from_string(
        json.dumps(value, indent=2, sort_keys=True) + "\n",
        content_type="application/json; charset=utf-8",
    )


@functions_framework.cloud_event
def generate_metadata(cloud_event: CloudEvent) -> None:
    data = cloud_event.data
    bucket_name = data["bucket"]
    object_name = data["name"]
    generation = str(data.get("generation", ""))

    if bucket_name != SOURCE_BUCKET or not object_name.startswith("incoming/images/"):
        LOGGER.info("Ignoring unrelated object: gs://%s/%s", bucket_name, object_name)
        return

    filename = object_name.rsplit("/", 1)[-1]
    match = FILENAME_RE.match(filename)
    if not match:
        quarantine_name = f"quarantine/{filename}"
        storage_client.bucket(SOURCE_BUCKET).copy_blob(
            storage_client.bucket(SOURCE_BUCKET).blob(object_name),
            storage_client.bucket(SOURCE_BUCKET),
            quarantine_name,
        )
        raise ValueError(
            "Image filename must use <token-id>-<slug>.(png|jpg|jpeg|webp|gif)"
        )

    token_id = int(match.group("token_id"))
    token_padded = f"{token_id:03d}"
    slug = match.group("slug").lower()
    ext = match.group("ext").lower()
    source_blob = storage_client.bucket(SOURCE_BUCKET).blob(object_name)
    image_bytes = source_blob.download_as_bytes()
    sha256 = hashlib.sha256(image_bytes).hexdigest()

    config = _load_collection_config()
    sidecar_name = f"incoming/metadata-overrides/{token_padded}-{slug}.json"
    sidecar = _json_from_blob(SOURCE_BUCKET, sidecar_name) or {}

    public_image_name = f"images/v1/{token_padded}-{slug}.{ext}"
    public_blob = storage_client.bucket(PUBLIC_BUCKET).blob(public_image_name)
    public_blob.cache_control = "public, max-age=31536000, immutable"
    public_blob.content_type = (
        mimetypes.guess_type(filename)[0] or "application/octet-stream"
    )
    public_blob.metadata = {
        "miseos-token-id": str(token_id),
        "miseos-slug": slug,
        "miseos-sha256": sha256,
        "miseos-source-generation": generation,
        "miseos-record-kind": sidecar.get("record_kind", "character_card"),
    }
    public_blob.upload_from_string(image_bytes, content_type=public_blob.content_type)

    labels = _detect_labels(f"gs://{SOURCE_BUCKET}/{object_name}", config)
    attributes = _normalize_attributes(sidecar.get("attributes", []) + labels)

    image_url = f"{PUBLIC_BASE_URL}/{public_image_name}"
    metadata = {
        "name": sidecar.get("name", slug.replace("-", " ").title()),
        "description": sidecar.get(
            "description",
            config.get("description", "MiseOS digital utility artifact"),
        ),
        "image": image_url,
        "external_url": sidecar.get(
            "external_url",
            f"{config.get('external_url_base', '').rstrip('/')}/{slug}",
        ),
        "attributes": attributes,
        "properties": {
            "schema": "miseos.nft.metadata.v1",
            "token_id": token_id,
            "slug": slug,
            "sha256": sha256,
            "source_object": f"gs://{SOURCE_BUCKET}/{object_name}",
            "source_generation": generation,
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "record_kind": sidecar.get("record_kind", "character_card"),
        },
    }

    for optional in ("animation_url", "background_color", "youtube_url"):
        if sidecar.get(optional):
            metadata[optional] = sidecar[optional]

    metadata_name = f"metadata/v1/{token_id}.json"
    _write_json(
        PUBLIC_BUCKET,
        metadata_name,
        metadata,
        "no-store",
        {
            "miseos-token-id": str(token_id),
            "miseos-slug": slug,
            "miseos-sha256": sha256,
            "miseos-reveal-state": "draft",
        },
    )

    audit_event = {
        "event": "metadata.generated",
        "token_id": token_id,
        "slug": slug,
        "image_object": public_image_name,
        "metadata_object": metadata_name,
        "sha256": sha256,
        "source_generation": generation,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    date_path = datetime.now(timezone.utc).strftime("%Y/%m/%d")
    event_name = cloud_event["id"].replace("/", "_")
    _write_json(
        AUDIT_BUCKET,
        f"events/{date_path}/{event_name}.json",
        audit_event,
        "no-store",
    )
    LOGGER.info("Generated metadata for token %s (%s)", token_id, slug)

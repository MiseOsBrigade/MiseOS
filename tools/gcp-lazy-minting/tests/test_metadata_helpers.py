import importlib.util
from pathlib import Path


def load_module():
    path = Path("services/metadata-worker/main.py")
    spec = importlib.util.spec_from_file_location("metadata_worker", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_normalize_attributes_deduplicates(monkeypatch):
    monkeypatch.setenv("SOURCE_BUCKET", "source")
    monkeypatch.setenv("PUBLIC_BUCKET", "public")
    monkeypatch.setenv("AUDIT_BUCKET", "audit")
    monkeypatch.setenv("PUBLIC_BASE_URL", "https://example.com")
    module = load_module()
    value = module._normalize_attributes([
        {"trait_type": "Role", "value": "Writer"},
        {"trait_type": "role", "value": "writer"},
        {"trait_type": "Rarity", "value": "Genesis"},
    ])
    assert value == [
        {"trait_type": "Role", "value": "Writer"},
        {"trait_type": "Rarity", "value": "Genesis"},
    ]

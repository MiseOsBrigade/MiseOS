from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from observability.langsmith_pipeline import (  # noqa: E402
    LangSmithConfigurationError,
    format_prompt,
)


def test_missing_credentials_fail_closed(monkeypatch):
    monkeypatch.delenv("LANGSMITH_API_KEY", raising=False)
    try:
        format_prompt("foo")
    except LangSmithConfigurationError as exc:
        assert "LangSmith" in str(exc)
    else:
        raise AssertionError("traced execution should fail closed without configuration")

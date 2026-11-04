"""Traceable LLM pipeline primitives for MiseOS.

LangSmith is intentionally optional at import time so the repository's
non-LLM tooling and tests continue to work without telemetry credentials.
Install ``langsmith`` and configure LANGSMITH_API_KEY only for traced LLM use.

The actual model/provider call is injected into ``invoke_llm``. This keeps the
observability layer provider-neutral and prevents credentials or model choices
from being hard-coded into the repository.
"""
from __future__ import annotations

import os
from collections.abc import Callable, Sequence
from functools import wraps
from typing import Any, TypeVar, cast

try:
    from langsmith import traceable
except ImportError:  # pragma: no cover - exercised in minimal installations.
    traceable = None  # type: ignore[assignment]

Message = dict[str, str]
T = TypeVar("T")


class LangSmithConfigurationError(RuntimeError):
    """Raised when traced execution is requested without LangSmith installed/configured."""


def _require_traceable() -> Callable[..., Any]:
    if traceable is None:
        raise LangSmithConfigurationError(
            "LangSmith is not installed. Install the optional dependency with "
            "'pip install -r requirements-langsmith.txt'."
        )

    # LangSmith supports API-key based tracing through environment variables.
    if not os.getenv("LANGSMITH_API_KEY"):
        raise LangSmithConfigurationError(
            "LANGSMITH_API_KEY is required for LangSmith tracing."
        )
    return cast(Callable[..., Any], traceable)


def _traced(*, run_type: str | None = None) -> Callable[[Callable[..., T]], Callable[..., T]]:
    """Apply LangSmith tracing lazily, preserving import/test safety."""

    def decorator(function: Callable[..., T]) -> Callable[..., T]:
        @wraps(function)
        def wrapper(*args: Any, **kwargs: Any) -> T:
            tracer = _require_traceable()
            if run_type is None:
                traced_function = tracer(function)
            else:
                traced_function = tracer(function, run_type=run_type)
            return cast(Callable[..., T], traced_function)(*args, **kwargs)

        return wrapper

    return decorator


@_traced()
def format_prompt(subject: str) -> list[Message]:
    """Build a normalized chat prompt for a subject."""
    subject = subject.strip()
    if not subject:
        raise ValueError("subject must not be empty")

    return [
        {"role": "system", "content": "You are a helpful MiseOS assistant."},
        {
            "role": "user",
            "content": f"Explain the following subject clearly: {subject}",
        },
    ]


@_traced(run_type="llm")
def invoke_llm(
    messages: Sequence[Message],
    request: Callable[[Sequence[Message]], str],
) -> str:
    """Invoke an injected LLM request function inside an LLM trace span."""
    if not messages:
        raise ValueError("messages must not be empty")

    response = request(messages)
    if not isinstance(response, str) or not response.strip():
        raise ValueError("LLM request returned an empty or invalid response")
    return response


@_traced()
def parse_output(response: str) -> str:
    """Normalize an LLM response into the pipeline's public output."""
    return response.strip()


@_traced()
def run_pipeline(
    subject: str,
    request: Callable[[Sequence[Message]], str],
) -> str:
    """Run the complete traceable MiseOS LLM pipeline."""
    messages = format_prompt(subject)
    response = invoke_llm(messages, request)
    return parse_output(response)

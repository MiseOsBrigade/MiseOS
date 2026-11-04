"""Integrity guard for all future renderers and controlled mutations."""

from __future__ import annotations

from collections.abc import Callable
from typing import ParamSpec, TypeVar

from .integrity import assert_unchanged, snapshot
from .models import CanonicalCase

P = ParamSpec("P")
R = TypeVar("R")


def run_guarded_transform(
    case: CanonicalCase,
    transform: Callable[[CanonicalCase, *P.args], R],
    *args: P.args,
    **kwargs: P.kwargs,
) -> R:
    """Execute a transform and prove canonical state/oracle are unchanged afterward."""
    before = snapshot(case)
    result = transform(case, *args, **kwargs)
    assert_unchanged(before, case)
    return result

from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parents[1] / "apps" / "api"))
from app.execution import digest


def test_hash_is_canonical():
    assert digest({"b": 2, "a": 1}) == digest({"a": 1, "b": 2})

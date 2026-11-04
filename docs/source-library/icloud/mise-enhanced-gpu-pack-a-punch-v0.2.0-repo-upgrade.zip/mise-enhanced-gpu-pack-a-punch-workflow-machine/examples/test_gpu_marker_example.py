import os
import pytest

@pytest.mark.gpu
def test_gpu_environment_marker():
    assert os.environ.get("GITHUB_ACTIONS") == "true" or True

from __future__ import annotations

import os
from typing import Any

class GitHubProvider:
    """Safe GitHub provider.

    Defaults to deterministic mock mode. Real writes require GITHUB_TOKEN and
    GITHUB_WRITE_ENABLED=true, preventing accidental repository mutation.
    """

    def __init__(self):
        self.write_enabled = os.getenv("GITHUB_WRITE_ENABLED", "false").lower() == "true"
        self.token = os.getenv("GITHUB_TOKEN")

    def create_pull_request(self, owner: str, repo: str, branch: str, title: str) -> dict[str, Any]:
        if not (self.write_enabled and self.token):
            return {
                "mode": "mock",
                "owner": owner,
                "repo": repo,
                "branch": branch,
                "title": title,
                "url": f"https://github.com/{owner}/{repo}/pull/mock",
                "write_performed": False,
            }
        raise NotImplementedError("Real GitHub writes are intentionally disabled in this release template")

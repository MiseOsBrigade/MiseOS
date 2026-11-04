from mise_pr.analyzer import analyze_pull_request
from mise_pr.git import enrich_files
from mise_pr.models import ChangedFile, Policy, PullRequestContext


def test_green_docs_change() -> None:
    policy = Policy()
    files = enrich_files([ChangedFile("docs/readme.md", additions=12, deletions=2)], policy)
    packet = analyze_pull_request(
        files=files,
        context=PullRequestContext(title="docs: update README", body="Closes #1. Updates docs only." * 6),
        policy=policy,
    )
    assert packet.risk_level in {"green", "yellow"}
    assert not packet.blockers


def test_large_source_change_without_tests_warns() -> None:
    policy = Policy(max_files=3, max_churn=100)
    files = enrich_files(
        [
            ChangedFile("src/auth/login.py", additions=220, deletions=10),
            ChangedFile("src/payments/checkout.py", additions=100, deletions=30),
            ChangedFile("src/api.py", additions=60, deletions=30),
            ChangedFile("src/db.py", additions=80, deletions=20),
        ],
        policy,
    )
    packet = analyze_pull_request(
        files=files,
        context=PullRequestContext(title="big change", body="too short"),
        policy=policy,
    )
    assert packet.risk_level in {"amber", "red"}
    assert packet.blockers
    assert any("Source changed without test" in warning for warning in packet.warnings)

from __future__ import annotations

from pathlib import Path

import typer
from rich.console import Console

from .analyzer import analyze_pull_request
from .config import load_policy
from .git import collect_changed_files, enrich_files
from .models import PullRequestContext
from .render import render_json, render_markdown

app = typer.Typer(add_completion=False, help="Turn chaotic pull requests into review-ready packets.")
console = Console()


@app.command()
def analyze(
    base: str = typer.Option("origin/main", help="Base git ref for comparison."),
    head: str = typer.Option("HEAD", help="Head git ref for comparison."),
    title: str = typer.Option("", help="Pull request title."),
    body_file: Path | None = typer.Option(None, help="Path to a file containing the PR body."),
    repository: str = typer.Option("local", help="Repository name, e.g. owner/repo."),
    author: str = typer.Option("unknown", help="PR author."),
    policy_file: Path | None = typer.Option(None, help="Path to .mise-pr.yml policy file."),
    output: Path = typer.Option(Path("mise-pr-report.md"), help="Markdown report output path."),
    json_output: Path | None = typer.Option(None, help="Optional JSON output path."),
    fail_on: str = typer.Option("red", help="Fail on this risk level: green, yellow, amber, red, never."),
) -> None:
    """Analyze the current git diff and write a Review Packet."""
    policy = load_policy(policy_file)
    body = body_file.read_text(encoding="utf-8") if body_file and body_file.exists() else ""
    context = PullRequestContext(
        title=title,
        body=body,
        base_ref=base,
        head_ref=head,
        repository=repository,
        author=author,
    )
    raw_files = collect_changed_files(base, head)
    files = enrich_files(raw_files, policy)
    packet = analyze_pull_request(files=files, context=context, policy=policy)

    output.write_text(render_markdown(packet), encoding="utf-8")
    if json_output is not None:
        json_output.write_text(render_json(packet), encoding="utf-8")

    console.print(f"Mise PR: {packet.risk_level.upper()} risk, score {packet.risk_score}/100")
    console.print(f"Report written to {output}")

    if should_fail(packet.risk_level, fail_on):
        raise typer.Exit(code=1)


@app.callback(invoke_without_command=True)
def main(ctx: typer.Context) -> None:
    if ctx.invoked_subcommand is None:
        console.print(ctx.get_help())


def should_fail(risk_level: str, fail_on: str) -> bool:
    if fail_on == "never":
        return False
    order = {"green": 0, "yellow": 1, "amber": 2, "red": 3}
    return order[risk_level] >= order.get(fail_on, 3)


if __name__ == "__main__":
    app()

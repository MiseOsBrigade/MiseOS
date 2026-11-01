# Mise PR — Launch Now Command Center

Use this file as the exact launch cockpit.

## Recommended decision

Because Product Hunt runs on a Pacific-time daily cycle, do not press "Launch now" after the day has already started unless you already have active momentum. Publish the GitHub repo now, QA the product, upload assets, and schedule the Product Hunt post for the next 12:01 AM PT launch slot.

## 1. Publish GitHub repo

Desktop / terminal route:

```bash
unzip mise-pr-launch-now-v3.zip
cd mise-pr
bash scripts/create-and-push-github.sh
```

Expected URL:

```text
https://github.com/DeontewattsV1/mise-pr
```

Mobile/manual route:

1. Create a public GitHub repo named `mise-pr`.
2. Upload all files from this folder.
3. Set repo description: `Pull requests prepped before review.`
4. Add topics: `github-action`, `developer-tools`, `code-review`, `productivity`, `pull-requests`, `ai-agents`.
5. Pin the README hero and make sure images render.

## 2. Product Hunt exact fields

Product name:

```text
Mise PR
```

Tagline:

```text
Pull requests prepped before review.
```

URL:

```text
https://github.com/DeontewattsV1/mise-pr
```

Description, under 500 characters:

```text
Mise PR is a lightweight GitHub Action that turns chaotic pull requests into clean review packets before humans or AI agents review them. It checks size, churn, risky paths, missing tests, weak descriptions, and missing issue links, then outputs one Markdown packet for reviewers and one JSON packet for automation.
```

Pricing:

```text
Free
```

Launch tags:

```text
Developer Tools
Code Review Tools
Productivity
```

Shoutouts:

```text
GitHub
Python
Product Hunt
```

Thumbnail:

```text
docs/product-hunt/upload-ready/thumbnail-240x240.png
```

Gallery order:

```text
1. docs/product-hunt/upload-ready/01-cover-1270x760.png
2. docs/product-hunt/upload-ready/02-not-ai-reviewer-1270x760.png
3. docs/product-hunt/upload-ready/03-one-packet-1270x760.png
4. docs/product-hunt/upload-ready/mise-pr-demo.gif
5. docs/product-hunt/upload-ready/04-agentic-teams-1270x760.png
6. docs/product-hunt/upload-ready/05-enterprise-safe-1270x760.png
```

## 3. First maker comment

```md
Hey Product Hunt — I built Mise PR because the review bottleneck has moved.

AI agents can write code faster than teams can review it. But most tools jump straight into “AI code review,” which often adds more comments, more noise, and more trust problems.

Mise PR does something simpler:

It asks whether the PR is actually reviewable first.

Every PR gets a clean Review Packet:

- scope and churn
- risky paths touched
- missing tests
- weak descriptions
- missing issue/spec links
- estimated reviewer attention budget
- Markdown for humans
- JSON for AI agents and enterprise workflows

No LLM required. No code leaves your repo. One useful comment instead of a pile of bot noise.

The goal is to make PRs easier for humans and safer for agentic teams.

Would love feedback from maintainers, AI coding-agent users, and engineering leads: what makes a PR “reviewable” in your workflow?
```

## 4. Launch sequence

### T-minus now

- Publish GitHub repo.
- Confirm README image renders.
- Confirm `bash scripts/create-and-push-github.sh` works if using CLI.
- Upload Product Hunt draft.
- Schedule for 12:01 AM PT.
- Do not ask for upvotes. Ask for feedback.

### First 30 minutes after launch

- Post first maker comment if it was not included during scheduling.
- Reply to every serious comment.
- Share on X, LinkedIn, GitHub, Discord/Slack communities, and developer friends.
- Ask: “Would love feedback from maintainers and AI coding-agent users.”

### First 4 hours

- Stay online.
- Answer quickly.
- Keep replies specific and helpful.
- Post a short demo clip or GIF where relevant.
- Track objections: “AI reviewer?”, “security?”, “enterprise?”, “why now?”

## 5. Public posts

X / Threads:

```text
Launching Mise PR on Product Hunt.

The review bottleneck has moved.
AI agents can create more code, but teams still need clean PR context.

Mise PR turns chaotic pull requests into review-ready packets before humans or AI agents spend attention.

Would love feedback from maintainers and dev teams.
```

LinkedIn:

```text
I’m launching Mise PR: a lightweight GitHub Action that helps teams prepare pull requests before review.

Instead of acting like another AI code reviewer, Mise PR asks a simpler question: is this PR actually reviewable yet?

It checks scope, churn, risky paths, missing tests, weak descriptions, and missing issue/spec links, then produces one clear review packet for humans and one JSON packet for automation.

I’d love feedback from maintainers, engineering leads, and anyone using AI coding agents in real workflows.
```

Reddit / community version:

```text
I built a small GitHub Action that checks whether a PR is reviewable before people or AI reviewers spend time on it.

It does not judge code correctness. It checks PR shape: churn, risky paths, missing tests, weak descriptions, issue/spec links, and reviewer attention estimate.

Would appreciate blunt maintainer feedback: what signals make a PR easier or harder for you to review?
```

## 6. Reply bank

How is this different from AI code review?

```text
Mise PR is the step before AI code review. It does not guess if code is correct. It checks whether the PR has enough structure, tests, context, and risk visibility to be reviewed well.
```

Does code leave my repo?

```text
No. The default analyzer is deterministic and local inside GitHub Actions. It produces Markdown and JSON from repo metadata and diffs.
```

Who is this for?

```text
Open-source maintainers, small engineering teams, AI coding-agent users, and enterprises that want review hygiene without adding another noisy reviewer bot.
```

What is next?

```text
CODEOWNERS-aware routing, PR split suggestions, hosted GitHub App mode, Slack/Linear/Jira handoff, and enterprise policy packs.
```

## 7. Do not do this

- Do not buy votes.
- Do not DM strangers asking for upvotes.
- Do not use a shortened or UTM-heavy Product Hunt URL.
- Do not overclaim “AI-powered” if the MVP is deterministic.
- Do not launch before the GitHub repo is public and clean.

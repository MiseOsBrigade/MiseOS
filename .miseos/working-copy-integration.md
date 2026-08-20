# MiseOS + Working Copy Integration

Working Copy is the mobile Git edge for MiseOS on iPhone and iPad. MiseOS should use Working Copy URL schemes and x-callback-url as a controlled local automation surface rather than treating URL links as unrestricted credentials.

## Operating model

```text
MiseOS / Shortcuts / ChatGPT
        |
        | working-copy://
        v
Working Copy
        |
        +--> local repository state
        +--> Textastic / Swift Playgrounds / Files
        +--> signed commit
        |
        v
GitHub
        |
        +--> Actions / PRs / releases
```

## Opening a repository

Use `working-copy://open` for deterministic navigation:

```text
working-copy://open?repo=MiseOS&path=README.md&mode=content
working-copy://open?repo=MiseOS&path=README.md&mode=preview
working-copy://open?repo=MiseOS&commit=<commit-prefix>&mode=status
working-copy://open?repo=MiseOS&branch=main
```

Only one of `path`, `commit`, or `branch` should be supplied. Encode spaces as `%20`; do not use `+` for spaces.

## Clone/show

For a known remote:

```text
working-copy://clone?remote=https%3A%2F%2Fgithub.com%2FMiseOsBrigade%2FMiseOS.git
```

For an idempotent open-or-clone experience:

```text
working-copy://show?remote=https%3A%2F%2Fgithub.com%2FMiseOsBrigade%2FMiseOS.git
```

## Security boundary

Commands that read or change repository data use Working Copy's per-device callback key. **Never commit, publish, embed, or copy a real callback key into this repository, documentation examples, Shortcuts exports, source code, or public URLs.** Treat it as a password.

The repository should only contain placeholders such as:

```text
<WORKING_COPY_CALLBACK_KEY>
```

Prefer user-mediated approval for destructive or broad operations. Do not design MiseOS automation around wildcard pushes or unrestricted repository writes.

## Safe MiseOS command tiers

### Read/navigation

Useful commands include:

- `open`
- `repos`
- `status`
- `log`
- `branches`
- `read`

### Controlled mutation

Use explicit repository and path scopes:

- `write`
- `move`
- `checkout`
- `commit`
- `fetch`
- `pull`
- `merge`

For commits, use a narrow `path` and an explicit `limit` so an agent cannot accidentally commit unrelated working-tree changes.

### Release/publish

Treat these as high-risk operations:

- `push`
- branch deletion
- merge completion
- release preparation

MiseOS should require an explicit human approval boundary before publishing changes unless a repository-specific policy explicitly authorizes the operation.

## Recommended agent workflow

```text
1. MiseOS identifies repository + task
2. Working Copy opens the relevant file/commit
3. Agent reads only the required files
4. Agent writes a bounded patch
5. Working Copy shows Changes/Status
6. Human reviews the diff
7. Working Copy creates a signed commit
8. Human or approved policy triggers push
9. GitHub Actions validates the pushed revision
10. MiseOS reports the result
```

## Textastic handoff

A read callback can return URL-encoded file content to another app through `x-success`. This enables a controlled Working Copy -> Textastic flow. When nesting callbacks, URL encoding is applied at each callback layer.

Example pattern:

```text
working-copy://x-callback-url/read/?repo=MiseOS&path=README.md&x-success=<URL-ENCODED-TEXTASTIC-CALLBACK>
```

Do not place secrets in the callback URL. Prefer the Working Copy key only where the command requires it, and keep the key outside source control.

## Chain operations

Working Copy's `chain` command is useful for bounded sequences such as:

```text
working-copy://x-callback-url/chain?repo=MiseOS&command=fetch&command=status
```

A higher-risk sequence such as commit + push should remain behind an explicit approval step in MiseOS.

## iPad Pro workflow

```text
Files
  -> Working Copy clone
  -> Textastic edit
  -> Working Copy diff/status
  -> signed commit
  -> push to GitHub
  -> GitHub Actions
  -> Swift Playground / preview / validation
```

Working Copy can also expose repository content through the Files/document-provider workflow, allowing Swift Playgrounds and editors to work against the same local Git workspace without making the iPad the CI server.

## MiseOS implementation rule

Working Copy is the **mobile Git edge**, not the policy authority. MiseOS owns task intent and approval policy; Working Copy owns local Git operations; GitHub owns remote source-of-truth, CI, pull requests, and release automation.

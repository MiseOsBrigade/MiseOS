# MiseOS Working Copy Shortcut Recipes

These recipes intentionally omit the Working Copy callback key. Configure the key locally in Working Copy and keep it out of source control.

## 1. Open MiseOS README

```text
working-copy://open?repo=MiseOS&path=README.md&mode=content
```

## 2. Open current changes

```text
working-copy://open?repo=MiseOS&mode=status
```

## 3. Refresh and inspect status

Conceptual Shortcut sequence:

```text
Open Working Copy
  -> fetch MiseOS
  -> status MiseOS
  -> open MiseOS status screen
```

For x-callback automation, use the device-local callback key and pass the repository explicitly.

## 4. Agent patch handoff

```text
MiseOS task
  -> identify path
  -> write bounded file change
  -> open file in Changes mode
  -> human review
```

Use `write` with `mode=safe` by default. Use `mode=overwrite` only when the user or repository policy explicitly authorizes replacing an uncommitted file.

## 5. Commit one intended file

```text
working-copy://x-callback-url/commit/?repo=MiseOS&path=README.md&limit=1&message=docs%3A%20update%20MiseOS%20workflow
```

The real callback key must be added locally when invoking the command.

## 6. Publish after approval

```text
working-copy://x-callback-url/push/?repo=MiseOS
```

This should be a separate approval step for agent-driven workflows.

## 7. Bounded chain

A low-risk chain can combine refresh and inspection:

```text
working-copy://x-callback-url/chain?repo=MiseOS&command=fetch&command=status
```

Avoid building autonomous `commit -> push` chains unless the repository policy explicitly permits them.

## 8. Textastic handoff

Working Copy can return file content through `x-success`. The callback target must be URL-encoded, and nested parameters require another level of encoding.

Conceptual form:

```text
working-copy://x-callback-url/read/?repo=MiseOS&path=README.md&x-success=<ENCODED-TEXTASTIC-CALLBACK>
```

## 9. Swift Playground / Files workflow

```text
Working Copy
    |
    +--> Files/document provider
              |
              +--> Swift Playgrounds
              |
              +--> inspect / prototype / validate
```

Use Working Copy as the Git authority for the local checkout. Keep build and release validation in GitHub Actions where practical.

## 10. Secret handling

Never place these in Shortcuts exports, repository files, issue comments, README examples, or public links:

- Working Copy callback keys
- GitHub PATs
- SSH private keys
- signing private keys
- cloud credentials

Store credentials in their intended secure stores and configure automation locally.

# Release Checklist

## Before tagging

- [ ] All CI checks passing on the commit being released
- [ ] CHANGELOG updated with user-facing changes (not raw commit log)
- [ ] Version bumped per semver: MAJOR.MINOR.PATCH
  - MAJOR: breaking change
  - MINOR: new functionality, backward-compatible
  - PATCH: bug fix, backward-compatible
- [ ] No error-budget-affecting incidents currently open (see SRE starter checklist)

## Tagging

- [ ] Tag format: `vX.Y.Z` (consistent with repo history — don't introduce a new scheme mid-project)
- [ ] Tag is signed/annotated, not lightweight, if the repo already does this elsewhere

## Publishing

Pick the right registry for the ecosystem — GitHub Packages doesn't cover everything:

| Ecosystem | Typical registry |
|---|---|
| npm | npm registry (or GitHub Packages) |
| Python | PyPI |
| Rust | crates.io |
| Go | proxy.golang.org (via module path, no explicit publish step) |
| Java | Maven Central (or GitHub Packages) |
| .NET | NuGet.org (or GitHub Packages) |
| PHP | Packagist |
| Ruby | RubyGems.org |
| Dart/Flutter | pub.dev |

- [ ] Package published to the correct registry
- [ ] GitHub Release created with notes linking the CHANGELOG entry

## After release

- [ ] Verify install works from a clean environment (not just local cache)
- [ ] Rollback plan documented in case the release needs to be pulled
- [ ] Announce if the release includes breaking changes

# Scope Migration: `@miseos` to `@mise-os`

The recommended npm scope is now:

```txt
@mise-os
```

Use this when publishing from the `Mise-OS` GitHub organization.

Keep `@miseos` only if that exact GitHub owner/scope exists and owns the packages.

## Checklist

- `registry/index.json` uses `namespaces.npm = @mise-os`
- npm package names use `@mise-os/*`
- `.github/workflows/publish-npm.yml` uses `scope: '@mise-os'`
- `.npmrc` maps `@mise-os` to GitHub Packages
- `pnpm scope:check` passes

# AID-1 IETF Publication Package

This directory contains the publication candidate for the AID-1 Internet-Draft family.

## Included artifact

`aid1-ietf-ci-package.zip` contains:

- `ietf/draft-watts-ai-identity-00.xml`
- `ietf/draft-watts-ai-identity-conformance-00.xml`
- RFCXML validation/render script
- GitHub Actions workflow source
- Makefile
- SHA-256 manifest

## Frozen architecture

The package preserves these boundaries:

- `Identity != Authority != Action Evidence`
- signature validity does not imply identity proof
- identity proof does not imply delegation
- delegation does not imply authorization
- authorization does not imply execution attestation
- execution attestation does not imply artifact truth
- artifact integrity does not imply semantic correctness
- `INDETERMINATE != ALLOW`
- R5: `AID-1 VALID / downstream D6 REJECT`

## Publication gate

The repository workflow `.github/workflows/ietf-aid1-publication.yml` extracts the package, installs the current pinned IETF authoring toolchain used by this candidate, validates both RFCXML files, renders `.txt` and `.html`, and runs submission-mode `idnits`.

Do not describe either Internet-Draft as submission-ready unless that workflow passes.

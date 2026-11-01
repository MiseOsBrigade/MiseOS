# Architecture

The monorepo uses four bounded contexts: Studio, Pack Pipeline, Runtime, and Mint Bridge. Only the Mint system outside this repository may perform storage pinning, rights attestation, wallet signing, or blockchain publication.

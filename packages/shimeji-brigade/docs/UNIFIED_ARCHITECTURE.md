# Unified Architecture

## Runtime lane

The package loads registry-driven sprite packs, validates frame contracts, builds runtime bundles, and exports clean metadata.

## Studio lane

The Character Studio workflow covers reference upload, crop, background cleanup, canonical 128×128 approval, frame derivation, live validation, and export.

## Validation lane

A declared frame count requires every expected PNG to exist and match the 128×128 contract.

## Provenance lane

Shimeji Mint remains separate. It handles rights attestation, storage, IPFS pinning, and optional Polygon publishing. No wallet or minting logic is included here.

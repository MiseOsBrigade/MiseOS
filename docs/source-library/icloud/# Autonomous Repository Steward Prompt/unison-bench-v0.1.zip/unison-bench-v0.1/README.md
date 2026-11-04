# UNISON-Bench v0.1

UNISON-Bench evaluates whether an AI system preserves explicitly defined invariants across representation changes, provenance/authority conflicts, missing evidence, and state transitions.

## Frozen constitutional core

A canonical invariant is typed as:

`I_k = (value, epistemic_status, provenance, authority)`

UNISON keeps three properties distinct:

- **Consistency**: outputs agree across representations.
- **Correctness**: outputs agree with the deterministic oracle.
- **State preservation**: outputs do not collapse distinct operational or epistemic states.

The Non-Collapse Principle is first-class:

`A -> B -> C` does **not** imply `A => C` unless required transition evidence exists.

`False != Unknown` is enforced as an epistemic invariant.

## v0.1 implementation gate

This artifact implements the first gate only:

- immutable canonical models and typed epistemic state
- provenance/authority/evidence/transition types
- deterministic oracle derivation
- state-collapse detection
- canonical/oracle integrity hashing
- S01 capability-authorization fixture
- S06 energy-resilience-readiness fixture
- first non-collapse and integrity tests

Renderer, mutation, task, and analysis packages are scaffolded but intentionally not implemented yet. They come after this gate passes.

## Install and run

```bash
python -m pip install -e '.[dev]'
pytest
```

## Constitutional invariant

Renderer and mutation code may transform an **evidence view** in future gates. They may never mutate canonical state or the canonical oracle.

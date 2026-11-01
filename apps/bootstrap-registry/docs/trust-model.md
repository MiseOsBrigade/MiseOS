# MiseOS Trust Model

MiseOS treats registry entries as operational capabilities, not loose package references.

## Non-negotiables

- Missing metadata fails closed.
- Permission expansion requires human review.
- Major version updates require human review.
- Security policy changes require human review.
- Network surface changes require human review.
- Agent execution contracts must explicitly declare whether autonomous execution is safe.

## Trust gates

| Gate | Meaning |
|---|---|
| License required | Every capability must declare a legal usage basis |
| SBOM required | Every release should be traceable to its dependency graph |
| Provenance required | Every artifact should be tied back to a known source |
| Signed release required | Release identity must be verifiable |
| Human review required | High-risk changes must not execute silently |

## Agent rule

Agents should never infer missing permissions, missing ownership, missing registry location, or missing safety status. Missing fields are unsafe by default.

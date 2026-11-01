# @miseos/policy-engine

Governance layer for MiseOS registry safety.

Initial checks:

- No missing trust metadata
- No unreviewed major changes
- No silent permission expansion
- No autonomous network access without explicit contract

By default, reports are advisory. Use `miseos-policy --enforced` to fail on high-risk entries.

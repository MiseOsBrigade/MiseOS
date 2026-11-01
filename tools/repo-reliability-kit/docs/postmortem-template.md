# Postmortem: [Incident Title]

**Date:** [date] · **Author:** [name] · **Status:** [draft / final]

This is blameless. The goal is to understand the system, not assign fault. Assume
everyone involved made reasonable decisions given what they knew at the time.

## Summary

[2-3 sentences: what happened, user impact, how long it lasted]

## Impact

- **Duration:** [start] → [end] ([total duration])
- **Users affected:** [number/percentage/description]
- **Error budget consumed:** [if applicable]

## Timeline

| Time (UTC) | Event |
|---|---|
| | First signal / alert |
| | Incident declared |
| | Root cause identified |
| | Mitigation applied |
| | Resolved |

## Root cause

[The actual technical/process cause — go past the first symptom. "The server crashed"
is not a root cause. "Why did it crash" is where the real answer lives.]

## What went well

[Don't skip this section. What safeguards worked? What made detection or mitigation
faster than it could have been?]

## What went wrong

[Gaps in detection, process, tooling, or documentation — framed as system gaps, not
individual mistakes.]

## Action items

| Action | Owner | Due date | Status |
|---|---|---|---|
| | | | |

Every action item should prevent this *class* of failure, not just patch this
specific instance.

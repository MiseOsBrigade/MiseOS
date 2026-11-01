# SRE Starter Checklist

The minimum viable reliability system for a team with no dedicated SRE. Don't try to
do all of this at once — pick the SLO first, everything else follows from it.

## 1. Pick one SLO

Not five. One. The metric your users would actually notice if it slipped.

- Service: [name]
- SLI: [e.g. "% of requests completing in <500ms" or "% of successful checkouts"]
- SLO target: [e.g. 99.5%]
- Measurement window: [e.g. rolling 30 days]

## 2. Calculate the error budget

`Error budget = 1 − SLO`

| SLO | Allowed downtime / month |
|---|---|
| 99.0% | ~7.3 hours |
| 99.5% | ~3.6 hours |
| 99.9% | ~43 minutes |
| 99.95% | ~22 minutes |
| 99.99% | ~4.3 minutes |

When the budget is spent, feature work pauses and reliability work takes priority.
Write this rule down somewhere visible — it only works if everyone agreed to it before
the budget was spent, not after.

## 3. Incident checklist (use during an incident, not after)

- [ ] Declare the incident — don't debug silently, tell someone
- [ ] Assign an incident commander (one person owns the decision-making, not everyone at once)
- [ ] Note the start time
- [ ] Post a status update within 15 minutes, even if it's "still investigating"
- [ ] Mitigate first, root-cause later — stop the bleeding before you understand it fully
- [ ] Note the resolution time
- [ ] Schedule the postmortem within 48 hours while memory is fresh

## 4. Postmortem (see `docs/postmortem-template.md`)

Blameless. The question is "how do we prevent this class of failure," not "who broke it."

## 5. Release-risk policy

- [ ] Define what triggers a release freeze (e.g. error budget exhausted, active incident)
- [ ] Define who can override the freeze and under what conditions
- [ ] Document the rollback procedure before you need it, not during an incident

## Keep toil under control

If more than half your team's time goes to repetitive manual work (deploys, manual
provisioning, repeat troubleshooting of the same class of issue), that's the next
thing to automate — before adding more monitoring or more process.

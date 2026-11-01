# Shimeji Brigade UI writing system

## Principles

1. Lead with the observable action.
2. Name the station or character, not an opaque subsystem.
3. Expose state and certainty separately.
4. Treat fallback as a healthy degraded mode.
5. Keep safety language direct and non-alarmist.

## Labels

| Technical state | UI label |
|---|---|
| validated | Ready for service |
| fallback | Procedural chibi |
| missing state | Missing station |
| invalid PNG | Frame rejected |
| unknown certainty | Needs proof |
| blocked action | Human approval needed |

Buttons use verbs: **Validate pack**, **Preview roam**, **Inspect station**, **Export pack**. Toasts state the result first, then the next action.

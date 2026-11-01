---
name: Mise Orchestra chat backend
description: Decisions behind the Live Agent Chat backend (AES-256-GCM at rest + Slack mirror) for the dashboard artifact.
---

# Live Agent Chat — backend decisions

## Scope: only operator broadcasts are real
The "Kitchen Comms" feed has two kinds of messages: synthetic agent chatter
(client-side simulation from a static pool) and operator broadcasts (what a human
types). Only **operator broadcasts** are persisted (encrypted) and mirrored to
Slack. The agent chatter stays client-only ambiance.
**Why:** the agent stream fires every ~5s; persisting/mirroring it would flood
Postgres and spam Slack with fake messages. Operator broadcasts are the genuine
"chat." This is a deliberate product call, not an oversight.
**How to apply:** if asked to make "every visible bubble" real, the agent
simulation must be moved server-side (backend generates + posts them) rather than
persisting the client loop.

## Encryption
AES-256-GCM, 12-byte random IV per message, separate auth tag; ciphertext/iv/authTag
stored base64 in `chat_messages`. Key from `CHAT_ENCRYPTION_KEY` (64 hex chars).
No plaintext body is ever stored. crypto.ts has a "hash any string to 32 bytes"
fallback for non-hex keys — fine for dev, but a real 32-byte hex key is preferred.

## POST ordering
Insert the encrypted row FIRST (postedToSlack=false), THEN attempt the Slack
mirror and update the flag on success.
**Why:** mirroring before insert can produce a Slack-only message that isn't
recorded at rest if the DB insert fails.

## Slack channel safety
Only ever post to a channel the bot is a member of (`is_member`), or an explicit
`SLACK_CHANNEL_ID`. Never fall back to an arbitrary channel.
**Why:** falling back to "first public channel" can leak messages to the wrong
channel; posting to a non-member channel fails anyway. Slack mirror degrades
gracefully (returns false) when the connector isn't authorized yet.

## API auth posture
The entire api-server (`/api/*`: jobs, approvals, characters, webhooks, chat) is
**unauthenticated by design** — this is a demo/portfolio platform with no user
accounts. Architect flagged chat GET/POST as unauthenticated; that is consistent
with the rest of the API, so auth was intentionally NOT added (would be scope creep
and inconsistent). Revisit only if the whole API gains auth.

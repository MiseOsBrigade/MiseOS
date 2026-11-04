# MiseOS Supermemory Character Core

Production-ready memory project for governance, 112 canonical character-agent records, roster, factions, visual guides, registry separation, conversations, proposals, conflicts, and archives. The current source catalog contains 112 characters. The repository registry catalog contains 23 non-character manifests, producing 135 current ecosystem items. The broader character-project target remains 155.

## Copy/paste setup

```bash
cd supermemory
cp .env.example .env
# edit .env and set SUPERMEMORY_API_KEY
set -a && source .env && set +a
npm run validate
npm run ingest:dry
npm run ingest
npm run profile -- "What are the official character and registry totals?"
```

## Ingestion order
1. Governance policies
2. Canonical character records
3. Character roster
4. Factions and relationships
5. Visual guides
6. Registry separation records
7. Working conversations
8. Proposed changes
9. Conflict records
10. Archived versions

## Canon workflow
- Conversations default to UNKNOWN/working.
- Proposals default to PROPOSED/pending.
- Conflicts default to CONFLICT/pending.
- Canon records require validation and explicit approval.
- Old versions are archived, never silently destroyed.

## MCP config
Copy `mcp.config.example.json` into the MCP client configuration and replace `${SUPERMEMORY_API_KEY}` or use OAuth without the Authorization header.

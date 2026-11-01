# MiseOS Lineage Editor v2 and Billing

## Product

MiseOS Lineage Editor is a trust-native word processor that turns writing into a traceable family tree of ideas, sources, rights, evidence, and publishing decisions.

The browser application is located at `apps/lineage-editor/index.html` and runs without a build step. It includes drag-and-drop outline nodes, local autosave, Markdown and JSON exports, rights review, source and attachment fields, AI-content labels, misinformation risk analysis, publishing readiness, and ECTI/STL/CSM/KAQ/GMI scoring.

## Local use

```bash
python3 -m http.server 8080
# Open http://localhost:8080/apps/lineage-editor/
```

Run its package check:

```bash
npm run lineage:check
```

## Commercial plans

Canonical plan configuration lives at `services/billing/config/plans.json`:

- Community: free local/static tools
- Pro: $29/month
- Team: $99/month
- Enterprise: contact sales

Prices are product defaults, not active charges. Live checkout requires Stripe Price IDs and deployment secrets.

## Stripe setup

1. Create recurring Stripe Products for Pro and Team.
2. Copy `services/billing/.env.example` into the deployment provider's secret manager.
3. Set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_PRO_MONTHLY`, and `STRIPE_PRICE_TEAM_MONTHLY`.
4. Never commit real secret values.
5. Configure the webhook endpoint to process the events declared in `services/billing/config/plans.json`.
6. Gate paid capabilities using verified subscription state from the server, never from browser-only flags.

The repository intentionally contains configuration and validation only. It cannot create a live Stripe account, accept legal terms, connect a bank, or activate charges without the account owner completing those external steps.

## Validation

```bash
npm run billing:check
npm run validate:static
```

GitHub Actions workflow `.github/workflows/lineage-editor.yml` runs these checks on changes. The Pages workflow publishes the editor under `/apps/lineage-editor/`.

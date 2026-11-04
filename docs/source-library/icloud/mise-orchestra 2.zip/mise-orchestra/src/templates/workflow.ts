/**
 * Renders .github/workflows/mise-orchestra.yml.
 *
 * Honesty note: `mise-org/mise-orchestra-action` is the composite action
 * the wider Mise DevOps Orchestra plan calls for, but it has not been
 * published yet — only this init CLI has shipped so far. The step below
 * is written with `continue-on-error: true` specifically so that, until
 * the action exists, an "unable to resolve action" failure cannot turn
 * into a red check or block anything. The moment the action is published
 * this file works as-is with no edits required.
 */
export function renderWorkflow(): string {
  return `name: Mise DevOps Orchestra

# Advisory mode only. This workflow can comment on pull requests; it
# cannot block a merge. Switching to enforced mode is a separate,
# deliberate change made directly in mise.yaml, never by editing this
# file.

on:
  pull_request:
  push:
    branches: [main, master]
  workflow_dispatch:

jobs:
  mise-orchestra:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
      checks: write
    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Run Mise Orchestra (advisory mode)
        # continue-on-error: true is intentional — see file header.
        continue-on-error: true
        uses: mise-org/mise-orchestra-action@v1
        with:
          config_path: mise.yaml
          mode: advisory
`;
}

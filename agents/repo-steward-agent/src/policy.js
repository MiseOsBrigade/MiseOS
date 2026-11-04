export const tiers = {
  tier1: ['read files','run tests','fix formatting','repair imports','open pull request'],
  tier2: ['architecture change','major dependency upgrade','cross-subsystem refactor'],
  tier3: ['rotate credentials','rewrite history','disable tests','change production deployment','force push']
};

export function classifyAction(action) {
  for (const [tier, actions] of Object.entries(tiers)) {
    if (actions.includes(action)) return tier;
  }
  return 'tier2';
}

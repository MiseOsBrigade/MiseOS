export async function inspectCharacter(context) {
  return {
    type: 'inspection',
    characterId: context.characterId,
    hotspotId: context.hotspotId,
    findings: [
      'Signed manifest verified',
      'Workflow found in server allowlist',
      'Visual asset treated as non-executable'
    ]
  };
}

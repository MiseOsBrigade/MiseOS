export async function openRegistry(context) {
  return {
    type: 'navigation',
    route: `/registry/characters/${encodeURIComponent(context.characterId)}`
  };
}

export const SHIMEJI_REGISTRY = Object.freeze([
  {
    id: "mizu",
    name: "Mizu",
    role: "Ticket Alchemist",
    squad: "Linkers",
    personality: Object.freeze({ energy: 0.62, curiosity: 0.82, patience: 0.68, bravery: 0.56, sociability: 0.88, clumsiness: 0.18 }),
    spriteRoot: "assets/sprites/mizu",
    referenceSource: "IMG_5944 2(2).pdf page 1"
  },
  {
    id: "kurogami",
    name: "Kurogami",
    role: "Chef Sentinel",
    squad: "Sentinels",
    personality: Object.freeze({ energy: 0.58, curiosity: 0.44, patience: 0.88, bravery: 0.74, sociability: 0.51, clumsiness: 0.12 }),
    spriteRoot: "assets/sprites/kurogami",
    referenceSource: "IMG_5944 2(2).pdf page 2"
  }
]);

export function getCharacter(id) {
  return SHIMEJI_REGISTRY.find((character) => character.id === id) ?? null;
}

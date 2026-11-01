// MiseOS Brigade Card Metadata
// Customer-facing collectible metadata generated from the original workflow-card profiles.
// Rarity and score fields describe gameplay/workflow utility only, not market or investment value.

import { BRIGADE_CARD_PROFILES, type BrigadeCardProfile } from "./brigade-card-system";

export interface CardMetadataAttribute {
  trait_type: string;
  value: string | number;
  display_type?: "number" | "boost_number" | "boost_percentage";
}

export interface CardInteractiveMedia {
  image: string;
  animation: string;
  model3d: string;
  audio: string;
  ar: string;
}

export interface MiseOsCardMetadata {
  name: string;
  description: string;
  external_url: string;
  image: string;
  animation_url: string;
  attributes: CardMetadataAttribute[];
  miseos: {
    cardId: string;
    slug: string;
    brigade: string;
    role: string;
    lore: string;
    singlePlayerAction: string;
    soloCommand: string;
    passiveAbility: string;
    activeAbility: string;
    ultimateMove: string;
    deploymentUse: string;
    interactiveMedia: CardInteractiveMedia;
    licenseNote: string;
  };
}

function levelFor(card: BrigadeCardProfile): number {
  const values = Object.values(card.stats);
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.max(1, Math.min(100, Math.round(avg)));
}

function imagePath(card: BrigadeCardProfile): string {
  return `ipfs://miseos-brigade-cards/images/${card.slug}.png`;
}

function animationPath(card: BrigadeCardProfile): string {
  return `ipfs://miseos-brigade-cards/animations/${card.slug}.mp4`;
}

function modelPath(card: BrigadeCardProfile): string {
  return `ipfs://miseos-brigade-cards/models/${card.slug}.glb`;
}

function audioPath(card: BrigadeCardProfile): string {
  return `ipfs://miseos-brigade-cards/audio/${card.slug}.mp3`;
}

function arPath(card: BrigadeCardProfile): string {
  return `ipfs://miseos-brigade-cards/ar/${card.slug}.usdz`;
}

export function toMiseOsCardMetadata(card: BrigadeCardProfile): MiseOsCardMetadata {
  const level = levelFor(card);

  return {
    name: `MiseOS Card - ${card.name}`,
    description: `${card.profile} Rarity and stats describe workflow/game utility only, not financial value.`,
    external_url: `https://mise-os.github.io/cards/${card.slug}`,
    image: imagePath(card),
    animation_url: animationPath(card),
    attributes: [
      { trait_type: "Card ID", value: card.id },
      { trait_type: "Rarity", value: card.rarity },
      { trait_type: "Level", value: level, display_type: "number" },
      { trait_type: "Brigade", value: card.brigadeName },
      { trait_type: "Role", value: card.role },
      { trait_type: "Element", value: card.element },
      { trait_type: "Workflow Focus", value: card.workflowFocus },
      { trait_type: "Primary Tool", value: card.primaryTool },
      { trait_type: "Temperament", value: card.temperament },
      { trait_type: "Orchestration", value: card.stats.orchestration, display_type: "number" },
      { trait_type: "Build", value: card.stats.build, display_type: "number" },
      { trait_type: "Runtime", value: card.stats.runtime, display_type: "number" },
      { trait_type: "Security", value: card.stats.security, display_type: "number" },
      { trait_type: "Insight", value: card.stats.insight, display_type: "number" },
      { trait_type: "Stamina", value: card.stats.stamina, display_type: "number" },
    ],
    miseos: {
      cardId: card.id,
      slug: card.slug,
      brigade: card.brigadeName,
      role: card.role,
      lore: `${card.name} carries the ${card.workflowFocus.toLowerCase()} station inside the MiseOS kitchen. Their job is to make the work visible, safe, and ready for handoff.`,
      singlePlayerAction: card.singlePlayerAction,
      soloCommand: card.soloCommand,
      passiveAbility: card.passiveAbility,
      activeAbility: card.activeAbility,
      ultimateMove: card.ultimateMove,
      deploymentUse: card.deploymentUse,
      interactiveMedia: {
        image: imagePath(card),
        animation: animationPath(card),
        model3d: modelPath(card),
        audio: audioPath(card),
        ar: arPath(card),
      },
      licenseNote: "Original MiseOS character and card-frame metadata. No third-party franchise assets or trade dress.",
    },
  };
}

export const BRIGADE_CARD_METADATA: MiseOsCardMetadata[] = BRIGADE_CARD_PROFILES.map(toMiseOsCardMetadata);

export function getCardMetadataBySlug(slug: string): MiseOsCardMetadata | undefined {
  return BRIGADE_CARD_METADATA.find((metadata) => metadata.miseos.slug === slug);
}

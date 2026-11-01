import { z } from "zod";

/**
 * The "Master Franchise Roster" — a separate 75-card system from the
 * MO-001..MO-072 Brigade dataset in brigade.ts. Different naming scheme
 * (Alko, Bruno, Lila...), different structure (Departments + rarity tiers
 * instead of Brigades + tools), sourced from
 * `Mise_Orchestra_Master_Roster.pdf`.
 *
 * Kept as parallel types/data/components rather than merged into
 * BrigadeCardSchema — forcing one schema to serve two unrelated lore
 * systems would mean a pile of mutually-exclusive optional fields on every
 * card. Two small schemas beat one contorted one.
 */

export const RaritySchema = z.enum(["common", "rare", "epic", "legendary", "genesis-founder", "mythic"]);
export type Rarity = z.infer<typeof RaritySchema>;

/**
 * Rarity is tier-scoped, not per-card: the source roadmap page ("Collectibility
 * & Culinary Roadmap") defines one frame color and star rating per tier, not
 * per character. Individual card art shows some variance in rendered stars,
 * but treating rarity as the single source of truth for both color and star
 * count is the more defensible model than transcribing per-card star counts
 * off stylized card images.
 */
export const RARITY_META: Readonly<Record<Rarity, { label: string; stars: number; color: string; frame: string }>> =
  Object.freeze({
    common: { label: "Common", stars: 2, color: "#9CA3AF", frame: "Silver Frame" },
    rare: { label: "Rare", stars: 3, color: "#3B82F6", frame: "Blue Frame" },
    epic: { label: "Epic", stars: 4, color: "#A855F7", frame: "Purple Frame" },
    legendary: { label: "Legendary", stars: 5, color: "#F5B301", frame: "Gold Frame" },
    "genesis-founder": { label: "Genesis Founder", stars: 5, color: "#D4AF37", frame: "Black/Gold — Original 15" },
    mythic: { label: "Mythic", stars: 5, color: "#F43F5E", frame: "Animated/Serialized" },
  });

export const DepartmentSchema = z
  .object({
    id: z.number().int().min(1).max(5),
    name: z.string().min(1),
    motto: z.string().min(1),
    headquarters: z.string().min(1),
    leader: z.string().optional(),
    range: z.tuple([z.number().int(), z.number().int()]),
    themeColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  })
  .strict();
export type Department = z.infer<typeof DepartmentSchema>;

export const MasterRosterCardSchema = z
  .object({
    /** Catalog id distinct from the MO-XXX series to avoid cross-dataset collisions. */
    id: z.string().regex(/^MRC-\d{3}$/),
    /** 1-75 position, matches the PDF's numbered roster. */
    number: z.number().int().min(1).max(75),
    name: z.string().min(1),
    role: z.string().min(1),
    rarity: RaritySchema,
    departmentId: z.number().int().min(1).max(5),
    slug: z.string().regex(/^[a-z0-9-]+$/),
  })
  .strict();
export type MasterRosterCard = z.infer<typeof MasterRosterCardSchema>;

/**
 * The Command Node (Kurogami Senpai, Orchestra Core, and the four "Prime"
 * satellites) sits above the numbered 1-75 roster as a leadership layer —
 * it is not itself part of that count, and Orchestra Core's rarity
 * ("Serialized Mythic ORC-000") is a one-of-one designation, not a tier
 * any of the 75 cards share.
 */
export const CommandNodeMemberSchema = z
  .object({
    name: z.string().min(1),
    role: z.string().min(1),
    artifact: z.string().optional(),
    quote: z.string().optional(),
    /** e.g. "Serialized Mythic ORC-000" for Orchestra Core — free text, not the RaritySchema enum. */
    designation: z.string().optional(),
    /** For the four satellite Primes (Tensho/COO, Scale Oni Prime/Infra, etc.) */
    domain: z.string().optional(),
  })
  .strict();
export type CommandNodeMember = z.infer<typeof CommandNodeMemberSchema>;

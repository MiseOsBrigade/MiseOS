import { z } from 'zod'

export const RARITY_VALUES = ['rare', 'epic', 'legendary', 'mythic', 'genesis-founder'] as const
export type Rarity = (typeof RARITY_VALUES)[number]

export const DepartmentSchema = z.object({
  id: z.number().int().min(1).max(5),
  slug: z.string().min(1),
  name: z.string().min(1),
  motto: z.string().min(1),
  headquarters: z.string().min(1),
  color: z.string().min(4),
  count: z.number().int().positive(),
}).strict()

export const MasterRosterCardSchema = z.object({
  number: z.number().int().min(1).max(75),
  id: z.string().regex(/^MR-\d{3}$/),
  slug: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  rarity: z.enum(RARITY_VALUES),
  rarityRaw: z.string().min(1),
  departmentId: z.number().int().min(1).max(5),
  departmentSlug: z.string().min(1),
  command: z.string().min(1),
  soloPrompt: z.string().min(1),
  registryCapability: z.string().min(1),
}).strict()

export type Department = z.infer<typeof DepartmentSchema>
export type MasterRosterCard = z.infer<typeof MasterRosterCardSchema>

export interface RarityMeta {
  label: string
  color: string
  stars: number
  tier: number
}

export const RARITY_META: Record<Rarity, RarityMeta> = {
  rare: { label: 'Rare', color: '#38bdf8', stars: 3, tier: 3 },
  epic: { label: 'Epic', color: '#a855f7', stars: 4, tier: 4 },
  legendary: { label: 'Legendary', color: '#f59e0b', stars: 5, tier: 5 },
  mythic: { label: 'Mythic', color: '#f0abfc', stars: 6, tier: 6 },
  'genesis-founder': { label: 'Legendary Genesis', color: '#f2c94c', stars: 7, tier: 7 },
}

export interface MasterRosterFilterState {
  query: string
  department: 'All' | string
  rarity: 'All' | Rarity
}

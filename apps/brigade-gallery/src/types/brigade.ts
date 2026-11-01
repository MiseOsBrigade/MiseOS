import { z } from "zod";

/**
 * Schema for a single MiseOS Brigade profile card.
 *
 * `.strict()` on purpose — same convention as MiseConfigSchema in
 * mise-yaml.ts. An unrecognized field on a roster entry is far more likely
 * to be a transcription typo than an intentional new column, so we want a
 * parse failure, not silent passthrough.
 */
export const BrigadeCardSchema = z
  .object({
    /** Stable catalog id, e.g. "MO-001". Not guaranteed contiguous. */
    id: z.string().regex(/^MO-\d{3}$/),
    name: z.string().min(1),
    brigade: z.string().min(1),
    role: z.string().min(1),
    focus: z.string().min(1),
    tool: z.string().min(1),
    /** kebab-case identifier used in `mise card run <slug>`. */
    slug: z.string().regex(/^[a-z0-9-]+$/),
    /** kebab-case `--mode` value for the solo command. */
    mode: z.string().regex(/^[a-z0-9-]+$/),
    /** Brigade trim color as a hex string, e.g. "#D4AF37". */
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  })
  .strict();

export type BrigadeCard = z.infer<typeof BrigadeCardSchema>;

/** Narrow filter state shared by the gallery and its controls. */
export interface BrigadeFilterState {
  query: string;
  brigade: string | "All";
}

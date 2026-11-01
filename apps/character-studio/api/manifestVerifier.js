import crypto from 'node:crypto';
import fs from 'node:fs';
import { z } from 'zod';
import { config } from './config.js';

const Shape = z.discriminatedUnion('type', [
  z.object({ type: z.literal('circle'), x: z.number(), y: z.number(), r: z.number().positive() }),
  z.object({ type: z.literal('rect'), x: z.number(), y: z.number(), w: z.number().positive(), h: z.number().positive() }),
  z.object({
    type: z.literal('poly'),
    points: z.array(z.tuple([z.number(), z.number()])).min(3)
  })
]);

export const ManifestSchema = z.object({
  schemaVersion: z.literal('1.0'),
  character: z.object({
    id: z.string().regex(/^[a-z0-9][a-z0-9._-]{2,63}$/),
    name: z.string().min(1).max(120),
    version: z.string().regex(/^\d+\.\d+\.\d+$/)
  }),
  asset: z.object({
    pngPath: z.string().min(1),
    sha256: z.string().regex(/^[a-f0-9]{64}$/)
  }),
  hotspots: z.array(z.object({
    id: z.string().regex(/^[a-z0-9._-]+$/),
    name: z.string().min(1).max(100),
    actionId: z.string().regex(/^[a-z0-9._-]+$/),
    requiresSession: z.boolean().default(true),
    requiresNft: z.boolean().default(false),
    shape: Shape
  })).max(100),
  issuedAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  keyId: z.string().min(1),
  signature: z.string().min(20)
}).superRefine((manifest, ctx) => {
  if (new Date(manifest.expiresAt) <= new Date(manifest.issuedAt)) {
    ctx.addIssue({ code: 'custom', path: ['expiresAt'], message: 'expiresAt must follow issuedAt' });
  }
});

export function canonicalManifestPayload(manifest) {
  const { signature, ...unsigned } = manifest;
  return Buffer.from(JSON.stringify(sortObject(unsigned)));
}

function sortObject(value) {
  if (Array.isArray(value)) return value.map(sortObject);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, sortObject(value[key])])
    );
  }
  return value;
}

export function verifyManifest(input) {
  const manifest = ManifestSchema.parse(input);
  const now = Date.now();
  if (Date.parse(manifest.issuedAt) > now + 60_000) throw new Error('Manifest issued in the future');
  if (Date.parse(manifest.expiresAt) <= now) throw new Error('Manifest expired');

  const publicKey = fs.readFileSync(config.publicKeyPath, 'utf8');
  const valid = crypto.verify(
    null,
    canonicalManifestPayload(manifest),
    publicKey,
    Buffer.from(manifest.signature, 'base64url')
  );
  if (!valid) throw new Error('Manifest signature invalid');
  return manifest;
}

export function manifestId(manifest) {
  return crypto
    .createHash('sha256')
    .update(canonicalManifestPayload(manifest))
    .digest('hex');
}

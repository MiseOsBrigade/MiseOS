import crypto from 'node:crypto';
import sharp from 'sharp';
import JSZip from 'jszip';
import { fileTypeFromBuffer } from 'file-type';
import { z } from 'zod';
import { config } from './config.js';
import { uploadStore } from './stores.js';

const CropSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  width: z.number().positive().max(1),
  height: z.number().positive().max(1)
});

const UploadSchema = z.object({
  imageData: z.string().min(1),
  filename: z.string().min(1).max(255).optional(),
  characterId: z.string().regex(/^[a-z0-9][a-z0-9._-]{2,63}$/)
});

function decodeDataUrl(value) {
  const match = value.match(/^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/s);
  if (!match) throw new Error('Expected an image data URL');
  const buffer = Buffer.from(match[1], 'base64');
  if (buffer.length > config.maxImageBytes) throw new Error('Image exceeds size limit');
  return buffer;
}

async function validateImage(buffer) {
  const type = await fileTypeFromBuffer(buffer);
  const allowed = new Set(['image/png', 'image/jpeg', 'image/webp']);
  if (!type || !allowed.has(type.mime)) throw new Error('Unsupported image format');

  const metadata = await sharp(buffer, { limitInputPixels: 20_000_000 }).metadata();
  if (!metadata.width || !metadata.height) throw new Error('Image dimensions unavailable');
  return { type, metadata };
}

export async function storeUpload(input) {
  const value = UploadSchema.parse(input);
  const original = decodeDataUrl(value.imageData);
  const details = await validateImage(original);
  const id = crypto.randomUUID();

  uploadStore.set(id, {
    id,
    characterId: value.characterId,
    filename: value.filename ?? 'reference.png',
    original,
    current: original,
    stage: 'uploaded',
    details
  }, 60 * 60 * 1000);

  return { uploadId: id, width: details.metadata.width, height: details.metadata.height };
}

export async function cropUpload(uploadId, cropInput) {
  const record = uploadStore.get(uploadId);
  if (!record) throw new Error('Upload not found or expired');
  const crop = CropSchema.parse(cropInput);
  const metadata = await sharp(record.current).metadata();

  const left = Math.floor(crop.x * metadata.width);
  const top = Math.floor(crop.y * metadata.height);
  const width = Math.max(1, Math.floor(crop.width * metadata.width));
  const height = Math.max(1, Math.floor(crop.height * metadata.height));

  if (left + width > metadata.width || top + height > metadata.height) {
    throw new Error('Crop exceeds image bounds');
  }

  record.current = await sharp(record.current)
    .extract({ left, top, width, height })
    .png()
    .toBuffer();
  record.stage = 'cropped';
  uploadStore.set(uploadId, record, 60 * 60 * 1000);
  return toDataUrl(record.current);
}

export async function cleanupUpload(uploadId, fuzz = 18) {
  const record = uploadStore.get(uploadId);
  if (!record) throw new Error('Upload not found or expired');

  // Conservative corner-color removal. This is not semantic segmentation.
  const { data, info } = await sharp(record.current)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const corners = [
    pixel(data, info.width, 0, 0),
    pixel(data, info.width, info.width - 1, 0),
    pixel(data, info.width, 0, info.height - 1),
    pixel(data, info.width, info.width - 1, info.height - 1)
  ];
  const bg = average(corners);
  const limit = Math.max(0, Math.min(100, Number(fuzz))) * 4.42;

  for (let i = 0; i < data.length; i += 4) {
    const distance = Math.hypot(data[i] - bg[0], data[i + 1] - bg[1], data[i + 2] - bg[2]);
    if (distance <= limit) data[i + 3] = 0;
  }

  record.current = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 }
  }).png().toBuffer();
  record.stage = 'cleaned';
  uploadStore.set(uploadId, record, 60 * 60 * 1000);
  return toDataUrl(record.current);
}

export async function canonicalizeUpload(uploadId) {
  const record = uploadStore.get(uploadId);
  if (!record) throw new Error('Upload not found or expired');

  record.canonical = await sharp(record.current)
    .resize(104, 104, { fit: 'inside', withoutEnlargement: true })
    .extend({
      top: 12,
      bottom: 12,
      left: 12,
      right: 12,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .resize(128, 128, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  record.stage = 'canonicalized';
  uploadStore.set(uploadId, record, 60 * 60 * 1000);
  return toDataUrl(record.canonical);
}

export async function generateFrames(uploadId) {
  const record = uploadStore.get(uploadId);
  if (!record?.canonical) throw new Error('Canonical image required');

  const states = { idle: 6, walk: 8, climb: 6, fall: 4, drag: 3, interact: 6, perch: 4 };
  record.frames = {};

  for (const [state, count] of Object.entries(states)) {
    record.frames[state] = [];
    for (let i = 0; i < count; i++) {
      const phase = i / count;
      const dy = state === 'idle' ? Math.round(Math.sin(phase * Math.PI * 2) * 2) : 0;
      const dx = state === 'walk' ? Math.round(Math.sin(phase * Math.PI * 2) * 4) : 0;
      const rotate = state === 'fall' ? -6 + phase * 12 : 0;

      const frame = await sharp({
        create: { width: 128, height: 128, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
      })
        .composite([{
          input: await sharp(record.canonical)
            .rotate(rotate, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .toBuffer(),
          left: dx,
          top: dy
        }])
        .png()
        .toBuffer();

      record.frames[state].push(frame);
    }
  }

  record.stage = 'frames-generated';
  uploadStore.set(uploadId, record, 60 * 60 * 1000);

  return Object.fromEntries(
    Object.entries(record.frames).map(([state, frames]) => [
      state,
      frames.map(toDataUrl)
    ])
  );
}

export async function exportPack(uploadId, characterDraft, validationReport = {}) {
  const record = uploadStore.get(uploadId);
  if (!record?.frames) throw new Error('Generated frames required');

  const zip = new JSZip();
  const states = Object.fromEntries(
    Object.entries(record.frames).map(([state, frames]) => [state, frames.length])
  );

  const manifest = {
    schemaVersion: '1.0',
    id: characterDraft.id,
    name: characterDraft.name,
    role: characterDraft.role ?? 'operator',
    squad: characterDraft.squad ?? 'brigade',
    version: characterDraft.version ?? '1.0.0',
    frameSize: { width: 128, height: 128 },
    states,
    source: {
      filename: record.filename,
      sha256: crypto.createHash('sha256').update(record.original).digest('hex'),
      canonicalMaster: 'source/canonical-128.png'
    },
    runtime: {
      engine: 'miseos-character-runtime',
      fallbackAllowed: true,
      behaviorSource: 'signed-external-manifest'
    }
  };

  zip.file('manifest.json', JSON.stringify(manifest, null, 2));
  zip.file('validation-report.json', JSON.stringify(validationReport, null, 2));
  zip.file('source/canonical-128.png', record.canonical);

  for (const [state, frames] of Object.entries(record.frames)) {
    frames.forEach((frame, index) => {
      zip.file(`sprites/${state}/${String(index).padStart(2, '0')}.png`, frame);
    });
  }

  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
}

function toDataUrl(buffer) {
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

function pixel(data, width, x, y) {
  const i = (y * width + x) * 4;
  return [data[i], data[i + 1], data[i + 2]];
}

function average(colors) {
  return [0, 1, 2].map((channel) =>
    Math.round(colors.reduce((sum, color) => sum + color[channel], 0) / colors.length)
  );
}

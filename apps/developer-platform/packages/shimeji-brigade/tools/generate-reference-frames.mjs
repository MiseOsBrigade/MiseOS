import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import zlib from 'node:zlib';

const ROOT = new URL('../', import.meta.url).pathname;
const SPRITES = join(ROOT, 'assets/sprites');
const REPORTS = join(ROOT, 'reports');
const SIZE = 128;
const STATES = { idle: 6, walk: 8, climb: 6, fall: 4, drag: 3, interact: 6, perch: 4 };

const characters = [
  {
    id: 'mizu',
    name: 'Mizu',
    role: 'Ticket Alchemist',
    referenceSource: 'IMG_5944 2.pdf page 1 — blue-haired ticket alchemist reference',
    prop: 'ticket',
    p: { skin: [250, 208, 166, 255], hair: [42, 139, 205, 255], hair2: [18, 72, 124, 255], coat: [18, 24, 36, 255], trim: [235, 184, 72, 255], accent: [90, 210, 255, 255], paper: [250, 238, 200, 255] }
  },
  {
    id: 'kurogami',
    name: 'Kurogami',
    role: 'Chef Sentinel',
    referenceSource: 'IMG_5944 2.pdf page 2 — chef character reference',
    prop: 'ladle',
    p: { skin: [244, 200, 160, 255], hair: [16, 18, 24, 255], hair2: [0, 0, 0, 255], coat: [10, 12, 16, 255], trim: [226, 174, 64, 255], accent: [255, 196, 74, 255], paper: [246, 241, 231, 255] }
  }
];

function canvas() { return new Uint8ClampedArray(SIZE * SIZE * 4); }
function at(x, y) { return (y * SIZE + x) * 4; }
function px(c, x, y, col) {
  x = Math.round(x); y = Math.round(y);
  if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return;
  const i = at(x, y); const a = col[3] / 255; const ia = 1 - a; const da = c[i + 3] / 255;
  c[i] = Math.round(col[0] * a + c[i] * ia);
  c[i + 1] = Math.round(col[1] * a + c[i + 1] * ia);
  c[i + 2] = Math.round(col[2] * a + c[i + 2] * ia);
  c[i + 3] = Math.round(255 * (a + da * ia));
}
function ellipse(c, cx, cy, rx, ry, col) {
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
    const dx = (x - cx) / rx, dy = (y - cy) / ry;
    if (dx * dx + dy * dy <= 1) px(c, x, y, col);
  }
}
function rect(c, x, y, w, h, col) { for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) px(c, xx, yy, col); }
function line(c, x0, y0, x1, y1, col, w = 2) {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1) * 2;
  for (let i = 0; i <= n; i++) { const t = i / n; ellipse(c, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, w / 2, w / 2, col); }
}
function crc32(buf) { let c = 0xffffffff; for (const b of buf) { c ^= b; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); } return (c ^ 0xffffffff) >>> 0; }
function chunk(type, data = Buffer.alloc(0)) { const t = Buffer.from(type); const out = Buffer.alloc(12 + data.length); out.writeUInt32BE(data.length, 0); t.copy(out, 4); data.copy(out, 8); out.writeUInt32BE(crc32(Buffer.concat([t, data])), 8 + data.length); return out; }
function png(c) {
  const raw = Buffer.alloc((SIZE * 4 + 1) * SIZE);
  for (let y = 0; y < SIZE; y++) { const row = y * (SIZE * 4 + 1); raw[row] = 0; for (let x = 0; x < SIZE; x++) { const s = at(x, y), d = row + 1 + x * 4; raw[d] = c[s]; raw[d + 1] = c[s + 1]; raw[d + 2] = c[s + 2]; raw[d + 3] = c[s + 3]; } }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(SIZE, 0); ihdr.writeUInt32BE(SIZE, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND')]);
}
function motion(state, i, count) {
  const wave = Math.sin((i / count) * Math.PI * 2), alt = i % 2 ? -1 : 1;
  return {
    idle: [wave, -Math.abs(wave) * 2, wave * 4, 0], walk: [alt * 3, -Math.abs(wave) * 3, alt * 7, alt * 4], climb: [alt * 2, -4 + wave * 2, alt * 9, -alt * 4], fall: [wave * 2, 4 + i * 2, -8, 2], drag: [-5 + i * 2, 8, -12, -3], interact: [wave, -Math.abs(wave) * 3, 11 * Math.sin((i / count) * Math.PI), 0], perch: [0, 7 + wave, 1, 0]
  }[state] || [0, 0, 0, 0];
}
function hat(c, cx, cy) { ellipse(c, cx - 15, cy, 13, 13, [250,250,248,255]); ellipse(c, cx, cy - 5, 17, 16, [250,250,248,255]); ellipse(c, cx + 16, cy, 13, 13, [250,250,248,255]); rect(c, cx - 24, cy + 4, 48, 14, [250,250,248,255]); }
function draw(character, state, i, count) {
  const c = canvas(), p = character.p, [mx, my, arm, step] = motion(state, i, count), cx = 64 + mx, by = 76 + my;
  ellipse(c, 64, 113, state === 'drag' ? 28 : 22, 6, [0,0,0,55]);
  line(c, cx - 8, by + 25, cx - 12 + step, by + 47, p.coat, 8); line(c, cx + 9, by + 25, cx + 13 - step, by + 47, p.coat, 8);
  ellipse(c, cx - 13 + step, by + 50, 8, 4, [8,9,12,255]); ellipse(c, cx + 14 - step, by + 50, 8, 4, [8,9,12,255]);
  rect(c, cx - 19, by - 4, 38, 38, p.coat); line(c, cx - 17, by + 2, cx + 17, by + 2, p.trim, 2); line(c, cx, by - 3, cx, by + 33, p.trim, 2); rect(c, cx - 20, by + 31, 40, 5, p.trim);
  line(c, cx - 18, by + 2, cx - 34, by + 21 - arm * .3, p.coat, 8); line(c, cx + 18, by + 2, cx + 35, by + 20 - arm, p.coat, 8); ellipse(c, cx - 35, by + 22 - arm * .3, 5, 5, p.skin); ellipse(c, cx + 35, by + 20 - arm, 5, 5, p.skin);
  if (character.prop === 'ticket') { rect(c, cx + 35, by + 4 - arm, 18, 26, p.paper); line(c, cx + 38, by + 12 - arm, cx + 50, by + 12 - arm, p.accent, 1); line(c, cx + 38, by + 20 - arm, cx + 48, by + 20 - arm, p.trim, 1); } else { line(c, cx + 28, by + 21 - arm, cx + 54, by - 9 - arm, p.trim, 4); ellipse(c, cx + 59, by - 14 - arm, 10, 8, p.trim); }
  if (character.id === 'kurogami') hat(c, cx, by - 50);
  ellipse(c, cx, by - 28, 27, 26, p.skin);
  ellipse(c, cx, by - 42, 30, 22, p.hair2); ellipse(c, cx - 5, by - 45, 26, 20, p.hair);
  for (let k = 0; k < 8; k++) line(c, cx - 23 + k * 7, by - 55, cx - 30 + k * 8, by - 30 + (k % 2) * 4, p.hair, 4);
  ellipse(c, cx - 10, by - 29, 4, 6, [12,14,20,255]); ellipse(c, cx + 10, by - 29, 4, 6, [12,14,20,255]); line(c, cx - 8, by - 15, cx + 8, by - 15, [80,42,42,255], 2);
  for (let k = 0; k < 7; k++) { const a = (i + k) * .83; ellipse(c, cx + Math.cos(a) * (32 + k % 4), by - 22 + Math.sin(a) * (26 + k % 5), 1.5, 1.5, [p.accent[0], p.accent[1], p.accent[2], 160]); }
  if (state === 'climb') line(c, 100, 18, 100, 105, [255,255,255,80], 2); if (state === 'perch') rect(c, 36, 112, 56, 5, p.trim);
  return c;
}
async function manifest(character) { await writeFile(join(SPRITES, character.id, 'manifest.json'), JSON.stringify({ id: character.id, name: character.name, version: '0.8.0', role: character.role, frameSize: { width: SIZE, height: SIZE }, states: STATES, plannedStates: STATES, fallbackSafe: true, referenceBacked: true, referenceSource: character.referenceSource, derivation: { method: 'procedural-reference-backed-transform-v1', note: 'First-pass generated frames preserve color, role cues, silhouette, and state timing until hand-drawn animation frames are approved.' } }, null, 2) + '\n'); }
await mkdir(REPORTS, { recursive: true });
const report = [];
for (const character of characters) {
  let total = 0; await mkdir(join(SPRITES, character.id), { recursive: true });
  for (const [state, count] of Object.entries(STATES)) { const dir = join(SPRITES, character.id, state); await rm(dir, { recursive: true, force: true }); await mkdir(dir, { recursive: true }); for (let i = 0; i < count; i++) { await writeFile(join(dir, `frame_${String(i + 1).padStart(3, '0')}.png`), png(draw(character, state, i, count))); total++; } }
  await manifest(character); report.push({ id: character.id, name: character.name, frames: total, states: STATES, referenceSource: character.referenceSource }); console.log(`GENERATED ${character.id} (${total} frames)`);
}
await writeFile(join(REPORTS, 'reference-frame-generation.json'), JSON.stringify({ schema: 'shimeji.reference-frame-generation.v1', generatedAt: new Date().toISOString(), characters: report }, null, 2) + '\n');

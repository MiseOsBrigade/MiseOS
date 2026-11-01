#!/usr/bin/env node
// Builds animated Shimeji-style "repo pet" strips for the root README.
// Output: assets/repo-pets/walk-*.svg. Each SVG is self-contained (frames are
// embedded as data URIs) because GitHub blocks external images inside SVGs.
// Usage: node tools/repo-pet/scripts/build-readme-pets.mjs [--root=.] [--seed=miseos] [--rotate]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = Object.fromEntries(process.argv.slice(2).map((a) => {
  const [k, v] = a.replace(/^--/, '').split('=');
  return [k, v ?? true];
}));
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(args.root ?? path.join(here, '..', '..', '..'));
const petsDir = path.join(root, 'assets', 'repo-pets');
const seedText = args.rotate ? new Date().toISOString().slice(0, 10) : String(args.seed ?? 'miseos');

function rng(text) {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}
const rand = rng(seedText);
const shuffle = (list) => list.map((v) => [rand(), v]).sort((a, b) => a[0] - b[0]).map(([, v]) => v);
const dataUri = (file) => `data:image/png;base64,${fs.readFileSync(file).toString('base64')}`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const names = new Map();
const charactersFile = path.join(root, 'data', 'characters.json');
if (fs.existsSync(charactersFile)) for (const c of JSON.parse(fs.readFileSync(charactersFile, 'utf8'))) names.set(c.slug, c.name);

const cutoutDir = path.join(petsDir, 'cutouts');
const cutouts = fs.readdirSync(cutoutDir).filter((f) => f.endsWith('.png')).sort().map((f) => {
  const slug = f.slice(0, -4);
  return { slug, name: names.get(slug) ?? slug, href: dataUri(path.join(cutoutDir, f)) };
});
const spriteDir = path.join(petsDir, 'sprites');
const sprites = fs.existsSync(spriteDir) ? fs.readdirSync(spriteDir).sort().map((id) => {
  const states = {};
  for (const state of fs.readdirSync(path.join(spriteDir, id))) {
    const frames = fs.readdirSync(path.join(spriteDir, id, state)).filter((f) => f.endsWith('.png')).sort();
    states[state] = frames.map((f) => dataUri(path.join(spriteDir, id, state, f)));
  }
  return { id, states };
}) : [];
if (cutouts.length < 3) throw new Error('need at least 3 character cutouts in assets/repo-pets/cutouts');

const W = 960;
let uid = 0;
const css = [];

function framesGroup(frames, size, fps) {
  const id = `f${uid++}`;
  const dur = frames.length / fps;
  css.push(`@keyframes ${id}{0%,${(100 / frames.length).toFixed(3)}%{opacity:1}${(100 / frames.length + 0.001).toFixed(3)}%,100%{opacity:0}}`);
  return frames.map((href, i) => `<image href="${href}" width="${size}" height="${size}" style="opacity:0;animation:${id} ${dur}s ${(-(frames.length - i) * dur / frames.length).toFixed(3)}s infinite"/>`).join('');
}

// One walker: walks the floor left<->right, flips to face its direction, and bobs.
function walker({ body, size, y, speed, offset, label }) {
  const travel = W + size;
  const dur = (travel * 2) / speed;
  const id = `w${uid++}`;
  css.push(`@keyframes ${id}m{0%{transform:translateX(${-size}px)}50%{transform:translateX(${W}px)}100%{transform:translateX(${-size}px)}}`);
  css.push(`@keyframes ${id}f{0%,49.99%{transform:scaleX(1)}50%,100%{transform:scaleX(-1)}}`);
  const delay = (-offset * dur).toFixed(2);
  return `<g style="animation:${id}m ${dur.toFixed(2)}s linear ${delay}s infinite"><g style="transform-box:fill-box;transform-origin:center;animation:${id}f ${dur.toFixed(2)}s linear ${delay}s infinite"><g class="bob" transform="translate(0 ${y})"><title>${esc(label)}</title>${body}</g></g></g>`;
}

function cutoutBody(c, size) {
  return `<g class="waddle" style="transform-origin:${size / 2}px ${size}px"><ellipse cx="${size / 2}" cy="${size - 2}" rx="${size / 3}" ry="4" fill="#000" opacity=".18"/><image href="${c.href}" width="${size}" height="${size}" preserveAspectRatio="xMidYMax meet"/></g>`;
}

function strip({ file, title, height, walkers, extras = '' }) {

  const body = walkers.join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${height}" width="${W}" height="${height}" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title>
<style>
.bob{animation:bob .45s ease-in-out infinite alternate}
@keyframes bob{from{translate:0 0}to{translate:0 -5px}}
.waddle{animation:waddle .9s ease-in-out infinite alternate}
@keyframes waddle{from{rotate:-4deg}to{rotate:4deg}}
${css.join('\n')}
@media (prefers-reduced-motion: reduce){*{animation-play-state:paused!important}}
</style>
<rect x="0" y="${height - 6}" width="${W}" height="3" rx="1.5" fill="#D4AF37" opacity=".55"/>
${extras}${body}
</svg>
`;
  fs.writeFileSync(path.join(petsDir, file), svg);
  return { file, bytes: Buffer.byteLength(svg), walkers: walkers.length };
}

const order = shuffle(cutouts);
const pick = (n) => order.splice(0, Math.min(n, order.length));
const results = [];
const floor = (h, size) => h - 6 - size + 2;

// Header: a parade of the brigade.
{
  css.length = 0;
  const h = 130, size = 96;
  const ws = pick(6).map((c, i) => walker({ body: cutoutBody(c, size), size, y: floor(h, size), speed: 38 + rand() * 30, offset: i / 6 + rand() * 0.05, label: c.name }));
  for (const s of sprites.filter((s) => s.states.walk)) ws.push(walker({ body: framesGroup(s.states.walk, 96, 10), size: 96, y: floor(h, 96) + 6, speed: 45 + rand() * 20, offset: rand(), label: `${s.id} (shimeji sprite)` }));
  results.push(strip({ file: 'walk-header.svg', title: 'MiseOS brigade walking across the repository', height: h, walkers: ws }));
}
// Middle: walkers plus a shimeji perched on the section edge.
{
  css.length = 0;
  const h = 120, size = 84;
  const ws = pick(5).map((c, i) => walker({ body: cutoutBody(c, size), size, y: floor(h, size), speed: 30 + rand() * 30, offset: i / 5 + rand() * 0.1, label: c.name }));
  const perch = sprites.find((s) => s.states.perch);
  const extras = perch ? `<g transform="translate(${W - 120} ${h - 6 - 92})"><title>${esc(perch.id)} perched on the edge</title>${framesGroup(perch.states.perch, 96, 4)}</g>` : '';
  results.push(strip({ file: 'walk-kitchen.svg', title: 'MiseOS repo pets on patrol', height: h, walkers: ws, extras }));
}
// Footer: remaining characters plus a shimeji climbing the wall.
{
  css.length = 0;
  const h = 150, size = 88;
  const ws = pick(6).map((c, i) => walker({ body: cutoutBody(c, size), size, y: floor(h, size), speed: 34 + rand() * 30, offset: i / 6 + rand() * 0.1, label: c.name }));
  const climber = sprites.find((s) => s.states.climb && s.id !== 'kurogami') ?? sprites.find((s) => s.states.climb);
  let extras = '';
  if (climber) {
    css.push(`@keyframes climbup{0%{transform:translateY(${h - 100}px)}45%,55%{transform:translateY(-10px)}100%{transform:translateY(${h - 100}px)}}`);
    extras = `<rect x="${W - 14}" y="0" width="6" height="${h}" rx="3" fill="#D4AF37" opacity=".35"/><g transform="translate(${W - 92} 0)"><g style="animation:climbup 9s ease-in-out infinite"><title>${esc(climber.id)} climbing the repository wall</title>${framesGroup(climber.states.climb, 84, 8)}</g></g>`;
  }
  results.push(strip({ file: 'walk-footer.svg', title: 'MiseOS repo pets climbing and walking', height: h, walkers: ws, extras }));
}

fs.writeFileSync(path.join(petsDir, 'roster.json'), `${JSON.stringify({ seed: seedText, strips: results }, null, 2)}\n`);
for (const r of results) console.log(`${r.file}: ${r.walkers} walkers, ${(r.bytes / 1024).toFixed(0)} KB`);

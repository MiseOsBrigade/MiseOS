#!/usr/bin/env python3
"""Rebuild player-card images from the highest-resolution original.

For every card in data/player-cards.json, the original (`source`) and every listed duplicate are
resolved to a repository copy via data/source-files.json (or $MISEOS_SOURCES as a fallback). The
largest real original (by pixel area) is used; nothing is upscaled.
  full image : native resolution of that original, WebP q95 (method 6)
  thumbnail  : THUMB_W px wide (2x the largest on-page display width, 240px), Lanczos + light unsharp, WebP q92;
               never wider than the original.
Writes `best_original`, `best_original_size`, `full_size` and `thumb_size` back to the index.
"""
import json, os, sys
from PIL import Image, ImageFilter
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..')); os.chdir(ROOT)
SRC = os.environ.get('MISEOS_SOURCES', '/workspace/miseos')
THUMB_W = 480
idx = json.load(open('data/player-cards.json'))
sf = {r['original']: r.get('repo_path') for r in json.load(open('data/source-files.json'))['files']}
def resolve(s):
    k = s.replace(':', '/', 1)
    for p in (sf.get(k), os.path.join(SRC, k)):
        if p and os.path.isfile(p): return p, k
    return None, k
low = []
for c in idx['cards']:
    best = None
    for s in [c.get('source')] + c.get('duplicates', []):
        if not s: continue
        p, k = resolve(s)
        if not p: continue
        try:
            with Image.open(p) as im: sz = im.size
        except Exception: continue
        if not best or sz[0] * sz[1] > best[2][0] * best[2][1]: best = (p, k, sz)
    if not best: print('no original for', c['file'], file=sys.stderr); continue
    p, k, sz = best
    im = Image.open(p); im.load()
    im = im.convert('RGBA') if im.mode in ('RGBA', 'LA', 'P') else im.convert('RGB')
    im.save(c['file'], 'WEBP', quality=95, method=6)
    w = min(THUMB_W, im.width); h = round(im.height * w / im.width)
    th = im.resize((w, h), Image.LANCZOS) if w < im.width else im.copy()
    if w < im.width: th = th.filter(ImageFilter.UnsharpMask(radius=0.6, percent=40, threshold=2))
    th.save(c['thumbnail'], 'WEBP', quality=92, method=6)
    c['best_original'] = k; c['best_original_size'] = list(sz); c['full_size'] = list(im.size); c['thumb_size'] = [w, h]
    if sz[0] < THUMB_W: low.append((c['file'], sz))
with open('data/player-cards.json', 'w', encoding='utf-8') as f: json.dump(idx, f, indent=2, ensure_ascii=False); f.write('\n')
print(f"rebuilt {len(idx['cards'])} cards; originals narrower than {THUMB_W}px: {len(low)}")
for f, sz in low: print('  low-res original:', f, sz)

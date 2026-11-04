#!/usr/bin/env python3
"""Rebuild card-art cutouts in assets/repo-pets/cutouts/ at the card's native resolution.

assets/repo-pets/cutouts/cutouts.json records, per character, the native-resolution trading card
and the crop box of the character. The crop is taken from the original card and its background is
removed at full resolution with rembg (isnet-anime model), so both colour and outline are native
detail. Pixels outside the recorded box are never used and nothing is upscaled.
Requires: pip install "rembg[cpu]" pillow
"""
import json, os
import numpy as np
from PIL import Image
from rembg import new_session, remove
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..')); os.chdir(ROOT)
cfg = json.load(open('assets/repo-pets/cutouts/cutouts.json'))
session = new_session(cfg.get('matting_model', 'isnet-anime'))
for slug, r in cfg['cutouts'].items():
    card = Image.open(r['card']).convert('RGB')
    x0, y0, x1, y1 = r['box']; pad = round((y1 - y0) * 0.04)
    big = card.crop((max(0, x0 - pad), max(0, y0 - pad), min(card.width, x1 + pad), min(card.height, y1 + pad)))
    cut = remove(big, session=session, post_process_mask=True)
    a = np.array(cut.getchannel('A'))
    # keep only the recorded character box (the padding just gives the matting model context)
    ox, oy = x0 - max(0, x0 - pad), y0 - max(0, y0 - pad)
    keep = np.zeros_like(a); keep[oy:oy + (y1 - y0), ox:ox + (x1 - x0)] = 1
    cut.putalpha(Image.fromarray((a * keep).astype('uint8')))
    bb = cut.getbbox(); cut = cut.crop(bb)
    cut.save(f'assets/repo-pets/cutouts/{slug}.png', optimize=True)
    r['output_size'] = list(cut.size)
    print(slug, cut.size)
cfg['matting_model'] = cfg.get('matting_model', 'isnet-anime'); cfg.pop('height', None)
cfg['note'] = 'Native-resolution crops from the trading cards; alpha from rembg isnet-anime at full resolution.'
with open('assets/repo-pets/cutouts/cutouts.json', 'w') as f: json.dump(cfg, f, indent=2); f.write('\n')

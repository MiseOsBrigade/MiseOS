#!/usr/bin/env python3
"""Rebuild card-art cutouts in assets/repo-pets/cutouts/ at full resolution.

assets/repo-pets/cutouts/cutouts.json records, per character, the native-resolution trading card
and the crop box of the character. The current cutout's alpha channel is used as the mask (resized
to the crop); colour pixels always come from the original card. Output height is capped at
`height` (2x the largest strip display size); images are never upscaled.
"""
import json, os
from PIL import Image
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..')); os.chdir(ROOT)
cfg = json.load(open('assets/repo-pets/cutouts/cutouts.json'))
for slug, r in cfg['cutouts'].items():
    path = f'assets/repo-pets/cutouts/{slug}.png'
    mask = Image.open(path).getchannel('A')
    crop = Image.open(r['card']).convert('RGB').crop(tuple(r['box']))
    crop.putalpha(mask.resize(crop.size, Image.LANCZOS))
    H = cfg['height']
    if crop.height > H: crop = crop.resize((round(crop.width * H / crop.height), H), Image.LANCZOS)
    crop.save(path, optimize=True)
    print(slug, crop.size)

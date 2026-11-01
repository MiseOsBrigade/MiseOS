#!/usr/bin/env python3
from __future__ import annotations
import json, re, sys
from pathlib import Path
import yaml

ROOT=Path(__file__).resolve().parents[1]
errors=[]

for p in sorted((ROOT/'templates/workflows').glob('*.yml')):
    try:
        d=yaml.load(p.read_text(encoding='utf-8'), Loader=yaml.BaseLoader)
        if not isinstance(d, dict): raise ValueError('top-level mapping required')
        for key in ('name','on','jobs'):
            if not d.get(key): errors.append(f'{p.relative_to(ROOT)}: missing {key}')
        if 'permissions' not in d: errors.append(f'{p.relative_to(ROOT)}: explicit permissions required')
    except Exception as e:
        errors.append(f'{p.relative_to(ROOT)}: invalid YAML: {e}')

for p in sorted((ROOT/'actions').glob('*/action.yml')):
    try:
        d=yaml.load(p.read_text(encoding='utf-8'), Loader=yaml.BaseLoader)
        if not d.get('name') or not d.get('runs'): errors.append(f'{p.relative_to(ROOT)}: invalid action metadata')
    except Exception as e: errors.append(f'{p.relative_to(ROOT)}: {e}')

catalog=json.loads((ROOT/'catalog/devops-assets.json').read_text(encoding='utf-8'))
if catalog.get('asset_count',0) < 1: errors.append('harvest catalog is empty')

secret_patterns=[
    re.compile(r'-----BEGIN (?:RSA|OPENSSH|EC|DSA) PRIVATE KEY-----'),
    re.compile(r'gh[pousr]_[A-Za-z0-9]{20,}'),
    re.compile(r'AKIA[0-9A-Z]{16}'),
    re.compile(r'sk-[A-Za-z0-9]{20,}'),
]
for p in ROOT.rglob('*'):
    if not p.is_file() or p.name in {'devops-assets.json','devops-assets.csv'}: continue
    try: text=p.read_text(encoding='utf-8')
    except UnicodeDecodeError: continue
    for pat in secret_patterns:
        if pat.search(text): errors.append(f'{p.relative_to(ROOT)}: potential embedded secret material')

if errors:
    for e in errors: print('ERROR:',e,file=sys.stderr)
    raise SystemExit(1)
print('MiseOS DevOps Foundry validation passed.')

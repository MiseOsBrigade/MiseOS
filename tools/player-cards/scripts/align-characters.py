#!/usr/bin/env python3
"""Align player cards with registry characters, registry manifests and card-defined chefs.

Reads only repository sources and writes data/characters/<slug>.json plus link fields
in data/player-cards.json. OCR text comes from data/player-cards-ocr.json (RapidOCR run
over every card image; regenerate with --ocr if rapidocr_onnxruntime is installed).
No field is invented: missing facts are written as UNDEFINED and every fact records its
source path in `sources`.
"""
import csv, glob, json, os, re, subprocess, sys
from collections import OrderedDict

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
os.chdir(ROOT)
UNDEF = 'Not yet defined in the source material'
n = lambda s: re.sub(r'[^a-z0-9]', '', (s or '').lower())
slugify = lambda s: re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', s.lower())).strip('-')

def rcsv(p): return list(csv.DictReader(open(p, encoding='utf-8-sig')))
def rjson(p): return json.load(open(p, encoding='utf-8'))

CARDS_P = 'data/player-cards.json'; OCR_P = 'data/player-cards-ocr.json'
INV_P = 'data/imports/miseos_character_master_inventory_001_300.csv'
MERGED_P = 'data/imports/merged_roster.json'
ORCH_P = 'data/imports/mise_orchestra_cards.csv'
MASTER_P = 'data/imports/master-roster-cards.csv'
PHOTO_P = 'data/imports/photo-alignment.csv'
CANON_P = 'docs/canon/MiseOS-Canon-Bible-v1.0.pdf'
MANI_DIR = 'apps/registry-platform/registry/manifests'
HANDLERS_P = 'apps/registry-platform/packages/core/src/handlers.ts'

cards_doc = rjson(CARDS_P)
if '--ocr' in sys.argv:
    from rapidocr_onnxruntime import RapidOCR
    eng = RapidOCR(); ocr = {}
    for c in cards_doc['cards']:
        r, _ = eng(c['file']); ocr[c['file']] = [x[1] for x in (r or [])]
    json.dump(ocr, open(OCR_P, 'w'), indent=1, ensure_ascii=False)
ocr = rjson(OCR_P)

registry = rjson('data/characters.json')
inv = {r['slug']: r for r in rcsv(INV_P)}
merged = {r['slug']: r for r in rjson(MERGED_P)}
orch = {n(r['name']): r for r in rcsv(ORCH_P)}
master = rcsv(MASTER_P)
photo = rcsv(PHOTO_P)
try:
    canon = subprocess.run(['pdftotext', '-layout', CANON_P, '-'], capture_output=True, text=True).stdout
except FileNotFoundError:
    canon = ''
canon_lines = canon.splitlines()
handler_lines = open(HANDLERS_P, encoding='utf-8').read().splitlines()

# ---------- entities ----------
ents = OrderedDict()
def new(slug, name, kind):
    ents[slug] = {'schema': 'miseos.character-detail.v1', 'slug': slug, 'name': name, 'kind': kind,
                  'aliases': [], 'sources': {}}
    return ents[slug]

for c in registry:
    e = new(c['slug'], c['name'], 'registry_character'); e['sources']['name'] = 'data/characters.json'
    e['registry'] = {'number': c['number'], 'profile': c['profile'], 'metadata': c['metadata'], 'avatar': c.get('avatar')}
for f in sorted(glob.glob(MANI_DIR + '/*.manifest.json')):
    m = rjson(f); slug = m['registry_id'].replace('.', '-')
    e = new(slug, m['name'], 'registry_manifest'); e['manifest'] = m; e['manifest_path'] = f
    e['sources']['name'] = f
# card-defined chefs: photo-alignment rows that are visual_reference_only
for r in photo:
    if r['alignment_status'] == 'visual_reference_only':
        slug = slugify(r['canonical_name'])
        if slug not in ents:
            e = new(slug, r['canonical_name'], 'card_character'); e['sources']['name'] = PHOTO_P
            e['photo_alignment'] = []
        ents[slug].setdefault('photo_alignment', []).append({'page': r['page'], 'status': r['alignment_status'], 'source_file': r['source_file']})

# aliases (title variants printed on cards / catalogue names)
ALIASES = {
    'steam-whisper': ['Whisper', 'Whisper Steam'], 'veg-virtuoso': ['Virtuoso'], 'citrus-zest': ['Zest'],
    'legacy-keeper': ['Legacy'], 'miseos-release-sentinel': ['MISEOSRELEASESENTINEL', 'MISEOS RELEASE SENTINEL'],
    'miseos-nuget-client': ['MiseOSNuGetClient'], 'miseos-workflow-linter': ['MISEOS WORKFLOW LINTER'],
    'miseos-orchestra-theme': ['Mise Orchestra Theme'], 'miseos-workflow-pack': ['MiseOsWorkflowPack'],
    'reserve-rune': ['Reserve'], 'vacuum-vesper': ['Vesper'], 'preview-yuki': ['Preview'],
    'queue-quartz': ['Queue'], 'orchestra-core': ['aCore', 'Orchestra Core'], 'ivun-cache': ['Ivun Cache'],
}
for s, al in ALIASES.items():
    if s in ents: ents[s]['aliases'] += [a for a in al if a != ents[s]['name']]
for s, e in ents.items():
    if e['aliases']: e['sources']['aliases'] = 'card titles / OCR in ' + OCR_P

# ---------- match cards ----------
keys = []
for s, e in ents.items():
    for nm in [e['name']] + e['aliases']:
        keys.append((n(nm), s))
keys.sort(key=lambda x: -len(x[0]))
SHEETS = {'character-building', 'icloud-screens'}  # multi-character sheets: no blob matching
before = sum(1 for c in cards_doc['cards'] if c.get('character_slug'))
for c in cards_doc['cards']:
    lines = [n(x) for x in ocr.get(c['file'], [])]; blob = ''.join(lines); t = n(c['title'])
    hit = how = None
    if c.get('character_slug') in ents: hit, how = c['character_slug'], c.get('match_method', 'existing-index')
    if not hit:
        for k, s in keys:
            if k and t == k: hit, how = s, 'title'; break
    if not hit and c['collection'] not in SHEETS:
        for k, s in keys:
            if len(k) >= 4 and k in lines: hit, how = s, 'ocr-line'; break
    if not hit and c['collection'] not in SHEETS:
        # name printed across two OCR lines (e.g. 'Reserve' + 'Rune')
        pairs = [lines[i] + lines[i + 1] for i in range(len(lines) - 1)]
        for k, s in keys:
            if len(k) >= 6 and k in pairs: hit, how = s, 'ocr-line-pair'; break
    if not hit and c['collection'] not in SHEETS:
        for k, s in keys:
            if len(k) >= 9 and k in blob: hit, how = s, 'ocr-text'; break
    c['entity_slug'] = hit; c['match_method'] = how
    c['page'] = f'docs/characters/{hit}.md' if hit else f"docs/cards/{c['collection']}--{os.path.splitext(os.path.basename(c['file']))[0]}.md"
    if hit and ents[hit]['kind'] == 'registry_character': c['character_slug'] = hit
after = sum(1 for c in cards_doc['cards'] if c['entity_slug'])
cards_doc['matched_entity_slugs'] = sorted({c['entity_slug'] for c in cards_doc['cards'] if c['entity_slug']})
cards_doc['matched_character_slugs'] = sorted({c['character_slug'] for c in cards_doc['cards'] if c.get('character_slug')})
cards_doc['alignment'] = {'cards_matched_before': before, 'cards_matched_after': after,
                          'script': 'tools/player-cards/scripts/align-characters.py', 'ocr': OCR_P}
json.dump(cards_doc, open(CARDS_P, 'w'), indent=2, ensure_ascii=False); open(CARDS_P, 'a').write('\n')

# ---------- code / docs references ----------
files = subprocess.run(['git', 'ls-files'], capture_output=True, text=True).stdout.split('\n')
SKIP = re.compile(r'^(data|characters|assets|docs/characters|docs/cards)/|node_modules|^README\.md$|^tools/player-cards/')
CODE_EXT = ('.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.py', '.sh', '.yml', '.yaml', '.sol', '.go', '.rs')
DOC_EXT = ('.md', '.mdx', '.txt', '.html')
texts = {}
for f in files:
    if not f or SKIP.search(f) or not f.endswith(CODE_EXT + DOC_EXT + ('.json', '.csv')): continue
    try:
        if os.path.getsize(f) > 2_000_000: continue
        texts[f] = open(f, encoding='utf-8', errors='ignore').read()
    except OSError: pass
def refs(terms, exts):
    out = []
    pats = [re.compile(r'(?<![A-Za-z0-9])' + re.escape(t) + r'(?![A-Za-z0-9])') for t in terms if t and len(t) >= 4]
    for f, txt in texts.items():
        if not f.endswith(exts): continue
        for p in pats:
            mm = p.search(txt)
            if mm:
                out.append({'path': f, 'line': txt.count('\n', 0, mm.start()) + 1, 'term': p.pattern.split(re.escape('(?<![A-Za-z0-9])'))[-1][len('(?<![A-Za-z0-9])'):-len('(?![A-Za-z0-9])')].replace('\\', '')})
                break
    return sorted(out, key=lambda r: r['path'])

def stations(r):
    return {k: r[k] for k in ('department', 'department_mission') if r.get(k)}

TOOL_DIRS = {'miseos-repo-pet': 'tools/repo-pet', 'miseos-repo-reliability-kit': 'tools/repo-reliability-kit'}
slug_by_name = {n(e['name']): s for s, e in ents.items()}

for s, e in ents.items():
    src = e['sources']
    e['cards'] = [{'file': c['file'], 'thumbnail': c['thumbnail'], 'collection': c['collection'], 'title': c['title'],
                   'match_method': c['match_method']} for c in cards_doc['cards'] if c['entity_slug'] == s]
    e['collections'] = sorted({c['collection'] for c in e['cards']})
    if e['cards']: src['cards'] = CARDS_P
    e['card_text'] = [{'file': c['file'], 'printed_text': ocr.get(c['file'], [])} for c in e['cards'] if ocr.get(c['file'])]
    if e['card_text']: src['card_text'] = OCR_P + ' (OCR of the card image)'
    printed = ' '.join(' '.join(x['printed_text']) for x in e['card_text']).upper()
    rar = [w for w in ('ULTRA MYTHIC', 'MYTHIC', 'LEGENDARY', 'EPIC', 'RARE', 'GENESIS') if w in printed or w.replace(' ', '') in printed.replace(' ', '')]
    e['card_rarity_printed'] = rar[0].title() if rar else UNDEF
    if rar: src['card_rarity_printed'] = OCR_P
    stars = max([x.count('★') for t in e['card_text'] for x in t['printed_text']] + [0])
    e['card_stars_printed'] = stars or UNDEF
    if stars: src['card_stars_printed'] = OCR_P
    pct = sorted({x.strip() for t in e['card_text'] for x in t['printed_text'] if re.fullmatch(r'\s*\d{1,3}(\.\d)?%\s*', x)})
    e['card_meters_printed'] = pct or UNDEF
    if pct: src['card_meters_printed'] = OCR_P

    role = dept = mission = rarity = lore = phrase = UNDEF
    workflow = {'summary': UNDEF, 'inputs': UNDEF, 'outputs': UNDEF, 'proof_gate': UNDEF}
    actions = []; stats = UNDEF; related = []; ids = {}
    md = None
    if e['kind'] == 'registry_character':
        md = rjson(e['registry']['metadata'])
        ids['registry_id'] = md.get('id'); src['ids.registry_id'] = e['registry']['metadata']
        role = md.get('agent_function', UNDEF); src['role'] = e['registry']['metadata']
        dept = md.get('department', UNDEF); src['department'] = e['registry']['metadata']
        rarity = md.get('rarity', UNDEF); src['rarity'] = e['registry']['metadata']
        wf = md.get('workflow') or {}
        for k in workflow:
            if wf.get(k): workflow[k] = wf[k]; src['workflow.' + k] = e['registry']['metadata']
        r = inv.get(s)
        if r:
            mission = r.get('department_mission') or UNDEF; src['department_mission'] = INV_P
            ids['character_id'] = r['character_id']; ids['card_id'] = r['card_id']; ids['codename'] = r['codename']
            src['ids.character_id'] = src['ids.card_id'] = src['ids.codename'] = INV_P
            if r.get('command'): actions.append({'command': r['command'], 'source': INV_P})
            st = {k: int(r[k]) for k in ('power', 'precision', 'speed', 'resilience', 'intelligence', 'teamwork') if r.get(k, '').isdigit()}
            if st: stats = st; src['stats'] = INV_P + ' (roster stats, not OCR)'
            if r.get('level'): e['level'] = int(r['level']); src['level'] = INV_P
            related += [x.strip() for x in r.get('synced_agents', '').split('|') if x.strip()]
            if related: src['related'] = INV_P
        mr = merged.get(s)
        if mr:
            if mr.get('lore'): lore = mr['lore']; src['lore'] = MERGED_P
            if mr.get('signature_phrase'): phrase = mr['signature_phrase']; src['signature_phrase'] = MERGED_P
            if mr.get('unique_trait'): e['unique_trait'] = mr['unique_trait']; src['unique_trait'] = MERGED_P
            if mr.get('mise_name'): actions.append({'command': mr['command'], 'mise_name': mr['mise_name'], 'source': MERGED_P})
            if mr.get('role_category'): e['role_category'] = mr['role_category']; src['role_category'] = MERGED_P
            for x in mr.get('synced_agents') or []:
                if x not in related: related.append(x); src['related'] = src.get('related', '') + ' ' + MERGED_P
        for row in master:
            if n(row['name'] + row['role']) == n(e['name']) or n(row['name'] + ' ' + row['role']) == n(e['name']):
                actions.append({'command': row['command'], 'roster_id': row['id'], 'source': MASTER_P})
                ids['master_roster_id'] = row['id']; src['ids.master_roster_id'] = MASTER_P
        o = orch.get(n(e['name']))
        if o:
            e['orchestra_card'] = {k: o[k] for k in ('role', 'department', 'function', 'rarity', 'tier', 'element', 'ability', 'lore')}
            src['orchestra_card'] = ORCH_P
            e['abilities'] = [o['ability']]; src['abilities'] = ORCH_P
            if lore == UNDEF and o.get('lore'): lore = o['lore']; src['lore'] = ORCH_P
        e['profile_doc'] = e['registry']['profile']
    elif e['kind'] == 'registry_manifest':
        m = e['manifest']; mp = e['manifest_path']
        ids['registry_id'] = m['registry_id']; src['ids.registry_id'] = mp
        role = m.get('type', UNDEF); src['role'] = mp + ' (type)'
        workflow['summary'] = m['capability']['description']; src['workflow.summary'] = mp + ' (capability.description)'
        actions.append({'operation': m['capability']['operation'], 'handler': m['runtime']['handler'], 'source': mp})
        e['runtime'] = m.get('runtime'); e['permissions'] = m.get('permissions'); e['distribution'] = m.get('distribution')
        e['marketplace'] = m.get('marketplace'); e['compatibility'] = m.get('compatibility'); e['pricing'] = m.get('pricing')
        for k in ('runtime', 'permissions', 'distribution', 'marketplace', 'compatibility', 'pricing'): src[k] = mp
        e.pop('manifest')
    else:
        # card-defined chef: role is the subtitle printed under the name on the card
        subs = []
        for t in e['card_text']:
            L = [x.strip() for x in t['printed_text']]
            for i, x in enumerate(L):
                if n(x) in [n(e['name'])] + [n(a) for a in e['aliases']] and i + 1 < len(L):
                    subs.append(L[i + 1]); break
                if i + 2 < len(L) and n(x + L[i + 1]) in [n(e['name'])] + [n(a) for a in e['aliases']]:
                    subs.append(L[i + 2]); break
        subs = [x for x in dict.fromkeys(subs) if x]
        if subs: role = ' / '.join(subs); src['role'] = OCR_P + ' (subtitle printed under the name)'
        e['catalogue_status'] = 'visual_reference_only'; src['catalogue_status'] = PHOTO_P

    # canon bible mentions
    cl = [{'line': i + 1, 'text': ' '.join(L.split())} for i, L in enumerate(canon_lines) if e['name'] in L]
    if cl: e['canon_bible'] = {'path': CANON_P, 'mentions': cl[:5]}; src['canon_bible'] = CANON_P + ' (pdftotext)'

    # implementation
    terms = [e['name']] + ([s] if '-' in s else [])
    if e['kind'] == 'registry_manifest': terms += [ids['registry_id'], e['runtime']['handler']]
    code = refs(terms, CODE_EXT)
    code = [r for r in code if not r['path'].endswith(('.json', '.csv'))]
    data_refs = refs(terms, ('.json', '.csv'))
    doc = refs(terms, DOC_EXT)
    impl = {'code_refs': code[:15], 'code_ref_count': len(code), 'data_refs': data_refs[:10], 'doc_refs': doc[:10]}
    if e['kind'] == 'registry_manifest':
        h = e['runtime']['handler']
        for i, L in enumerate(handler_lines):
            if re.search(r'export const ' + re.escape(h) + r'\b', L):
                impl['handler'] = {'path': HANDLERS_P, 'line': i + 1, 'name': h}; break
        if s in TOOL_DIRS: impl['tool_dir'] = TOOL_DIRS[s]
    DATA_LIKE = re.compile(r'/data/|/types/|\.generated\.|/test/|\.test\.')
    impl['app_code_refs'] = [r for r in code if not DATA_LIKE.search(r['path'])][:15]
    if impl.get('handler') or impl.get('tool_dir'):
        impl['status'] = 'implemented_in_code'
    elif impl['app_code_refs']:
        impl['status'] = 'referenced_in_app_code'
    elif workflow['summary'] != UNDEF or doc or e.get('profile_doc'):
        impl['status'] = 'described_in_docs_only'
    else:
        impl['status'] = 'not_defined'
    impl['note'] = ('implemented_in_code = a dedicated capability handler or tool directory exists; referenced_in_app_code = the entity is used by '
                    'application source (e.g. repo-pet sprites, CLI) but has no dedicated handler. code_refs are files that reference this entity by name/slug/handler (grep), not a guarantee of a dedicated runtime; '
                    'registry handler links point at the actual capability function.')
    e['implementation'] = impl; src['implementation'] = 'git ls-files grep + ' + (HANDLERS_P if impl.get('handler') else 'repo')

    e.update({'ids': ids, 'role': role, 'department': dept, 'department_mission': mission, 'rarity': rarity, 'lore': lore,
              'signature_phrase': phrase, 'workflow': workflow, 'actions': actions or UNDEF, 'stats': stats})
    if not actions: pass
    e['related'] = [{'name': x, 'slug': slug_by_name.get(n(x))} for x in related] or UNDEF
    helps = {'station': dept if dept != UNDEF else (role if e['kind'] == 'card_character' and role != UNDEF else UNDEF),
             'mission': mission, 'problem': workflow['summary'], 'proof_gate': workflow['proof_gate']}
    if e['kind'] == 'registry_manifest':
        helps['station'] = 'Registry (' + str(e['marketplace'].get('category')) + ')'; helps['problem'] = workflow['summary']
        src['helps.station'] = e['manifest_path'] + ' (marketplace.category)'
    e['helps'] = helps
    if e['kind'] != 'registry_manifest' and helps['station'] != UNDEF: src['helps.station'] = src.get('department', src.get('role'))

os.makedirs('data/characters', exist_ok=True)
for f in glob.glob('data/characters/*.json'): os.remove(f)
for s, e in ents.items():
    json.dump(e, open(f'data/characters/{s}.json', 'w'), indent=2, ensure_ascii=False); open(f'data/characters/{s}.json', 'a').write('\n')
print(json.dumps({'entities': len(ents), 'cards_matched_before': before, 'cards_matched_after': after,
                  'entities_with_cards': sum(1 for e in ents.values() if e['cards']),
                  'status': {k: sum(1 for e in ents.values() if e['implementation']['status'] == k) for k in ('implemented_in_code', 'referenced_in_app_code', 'described_in_docs_only', 'not_defined')}}, indent=1))

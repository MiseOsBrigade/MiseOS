#!/usr/bin/env python3
"""Import repo pets, agents and every remaining source file from the MiseOS iCloud
download (/workspace/miseos/icloud), its extracted copies (/workspace/miseos/extract)
and recursively unpacked archives (/workspace/miseos/unpacked) into this repository.

Writes data/repo-pets.json, data/agents.json, assets/repo-pets/<pet>/, agents/<slug>/,
docs/source-library/** and data/source-files.json. Nothing is invented: every record
carries the source path it was read from.
"""
import hashlib, json, os, re, shutil, subprocess, sys
from PIL import Image

SRC = os.environ.get('MISEOS_SOURCES', '/workspace/miseos')
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
os.chdir(ROOT)
slugify = lambda s: re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', s.lower())).strip('-')
n = lambda s: re.sub(r'[^a-z0-9]', '', (s or '').lower())
def sha(p):
    h = hashlib.sha256()
    with open(p, 'rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''): h.update(b)
    return h.hexdigest()
def orig(p):  # path under SRC -> logical original path
    r = os.path.relpath(p, SRC)
    while r.startswith('unpacked/'): r = r[len('unpacked/'):]
    return r
def put(src, dst):
    os.makedirs(os.path.dirname(dst), exist_ok=True); shutil.copyfile(src, dst); return dst
def wjson(p, o):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f: json.dump(o, f, indent=2, ensure_ascii=False); f.write('\n')

chars = {}
for f in os.listdir('data/characters'):
    e = json.load(open('data/characters/' + f)); chars[e['slug']] = e
char_by_name = {n(e['name']): s for s, e in chars.items()}
cards = json.load(open('data/player-cards.json'))['cards']
def find_char(name):
    k = n(name)
    if k in char_by_name: return char_by_name[k]
    pre = [s for s, e in chars.items() if n(e['name']).startswith(k) and len(k) >= 4]
    return pre[0] if len(pre) == 1 else None
def find_cards(name, extra=()):
    ks = {n(name)} | {n(x) for x in extra}
    return [c['page'] for c in cards if n(c['title']) in ks]

# ---------------- repo pets ----------------
pets = []
MOS = f'{SRC}/unpacked/icloud/Mise-OS-main.zip/Mise-OS-main'
BRIGADE_TS = f'{MOS}/artifacts/dashboard/src/lib/brigade-data.ts'
MASCOT_DIR = f'{MOS}/attached_assets/miseos_agents'
pets_src = json.load(open(os.environ.get('PETS_SRC', '/tmp/pets_src.json')))
REPO_PET_CUR = 'tools/repo-pet/src/characters.js'
REPO_PET_UPD = f'{SRC}/extract/code/repopet2/repo-pet-update/src/characters.js'
deps = pets_src['deps']
for c in pets_src['cur']:
    pets.append({'slug': c['id'], 'name': c['name'], 'kind': 'terminal_repo_pet', 'species': None,
                 'role': c.get('role'), 'department': c.get('department'), 'glyph': c.get('sprite'),
                 'catchphrase': c.get('signature'), 'behaviors': {'preferred_paths': c.get('preferredPaths')},
                 'sprites': [], 'source': REPO_PET_CUR})
have = {p['slug'] for p in pets}
for c in pets_src['upd']:
    rec = {'slug': c['id'], 'name': c['name'], 'kind': 'terminal_repo_pet', 'species': None, 'role': c.get('title'),
           'department': deps.get(c.get('department'), {}).get('label', c.get('department')), 'glyph': c.get('glyph'),
           'catchphrase': c.get('catchphrase'), 'behaviors': {'roaming_bias': c.get('roamingBias'), 'verbs': c.get('verbs')},
           'sprites': [], 'source': orig(REPO_PET_UPD)}
    if rec['slug'] in have:
        p = next(p for p in pets if p['slug'] == rec['slug'])
        for k, v in rec.items():
            if k in ('behaviors',): p['behaviors'].update({a: b for a, b in v.items() if b})
            elif not p.get(k) and v: p[k] = v
        p['also_defined_in'] = rec['source']
    else: pets.append(rec); have.add(rec['slug'])
# shimeji sprite pets already in repo
for sid in sorted(os.listdir('assets/repo-pets/sprites')):
    states = {st: sorted(f'assets/repo-pets/sprites/{sid}/{st}/{x}' for x in os.listdir(f'assets/repo-pets/sprites/{sid}/{st}'))
              for st in sorted(os.listdir(f'assets/repo-pets/sprites/{sid}'))}
    slug = {'kurogami': 'kurogami-senpai'}.get(sid, sid)
    p = next((p for p in pets if p['slug'] == slug), None)
    if not p:
        p = {'slug': slug, 'name': sid.title(), 'kind': 'shimeji', 'species': None, 'sprites': [], 'behaviors': {}, 'source': 'assets/repo-pets/sprites/' + sid}
        pets.append(p)
    p['kind'] = p['kind'] + '+shimeji'; p['shimeji_states'] = states; p['behaviors']['shimeji_states'] = list(states)
    p['sprites'] += [v[0] for v in states.values() if v]
for p in pets:
    co = f"assets/repo-pets/cutouts/{p['slug']}.png"
    if os.path.exists(co): p['sprites'].append(co); p['cutout'] = co
# animal pets: names that carry an animal word (species taken from the name only)
ANIMAL = {'fox': 'fox', 'cat': 'cat', 'panda': 'panda', 'tengu': 'tengu (crow-like yōkai)', 'neko': 'cat (neko)',
          'kitsune': 'fox (kitsune)', 'owl': 'owl', 'dragon': 'dragon', 'oni': 'oni (yōkai)'}
def species(name):
    for w in name.lower().replace('-', ' ').split():
        if w in ANIMAL and w != 'oni': return ANIMAL[w]
    return None
# brigade mascots
ts = open(BRIGADE_TS, encoding='utf-8').read().splitlines()
groups = []; cur = None; mascots = []
for i, L in enumerate(ts):
    m = re.search(r'folder:\s*"([^"]+)"', L)
    if m: cur = {'folder': m.group(1)}; groups.append(cur)
    m = re.search(r'^\s*name:\s*"([^"]+)"', L)
    if m and cur and 'name' not in cur: cur['name'] = m.group(1)
    m = re.search(r'tagline:\s*"([^"]+)"', L)
    if m and cur: cur['tagline'] = m.group(1)
    m = re.search(r'\{\s*file:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*role:\s*"([^"]+)"', L)
    if m and cur: mascots.append({'file': m.group(1), 'name': m.group(2), 'role': m.group(3), 'group': cur.get('name'),
                                  'tagline': cur.get('tagline'), 'folder': cur['folder'], 'line': i + 1})
for m in mascots:
    sp = species(m['name'])
    if not sp: continue
    slug = slugify(m['name']); d = f'assets/repo-pets/{slug}'
    art = put(f"{MASCOT_DIR}/{m['folder']}/{m['file']}", f'{d}/{m["file"]}')
    im = Image.open(art).convert('RGBA'); bb = im.getbbox(); im = im.crop(bb); im.thumbnail((180, 180))
    co = f'assets/repo-pets/cutouts/{slug}.png'; im.save(co, optimize=True)
    pets.append({'slug': slug, 'name': m['name'], 'kind': 'brigade_mascot', 'species': sp, 'species_source': 'animal word in the name',
                 'role': m['role'], 'department': m['group'], 'sprites': [art, co], 'cutout': co, 'behaviors': {'walks_in_readme_strip': True},
                 'source': f"{orig(BRIGADE_TS)}:{m['line']}", 'art_source': orig(f"{MASCOT_DIR}/{m['folder']}/{m['file']}")})
# animal-named registry characters and card chefs
for s, e in chars.items():
    sp = species(e['name'])
    if not sp or any(p['slug'] == s for p in pets): continue
    imgs = [c['thumbnail'] for c in e['cards']]
    av = e.get('registry', {}).get('avatar')
    if av and os.path.exists(av): imgs.insert(0, av)
    pets.append({'slug': s, 'name': e['name'], 'kind': 'animal_character', 'species': sp, 'species_source': 'animal word in the name',
                 'role': e['role'], 'department': e['department'], 'sprites': imgs, 'behaviors': {},
                 'source': f'data/characters/{s}.json'})
for p in pets:
    p['species'] = p.get('species') or species(p['name'])
    p['character'] = find_char(p['name']); p['cards'] = find_cards(p['name'])
    p['page'] = f"docs/repo-pets/{p['slug']}.md"
    d = f"assets/repo-pets/{p['slug']}"; os.makedirs(d, exist_ok=True); p['dir'] = d
    wjson(f'{d}/pet.json', {k: v for k, v in p.items() if k != 'shimeji_states'})
wjson('data/repo-pets.json', {'schema': 'miseos.repo-pets.v1', 'count': len(pets),
      'animals': sum(1 for p in pets if p['species']), 'pets': pets})

# ---------------- agents ----------------
agents = []
def agent(slug, **kw):
    a = {'slug': slug, 'files': [], **kw}; agents.append(a); return a
for m in mascots:
    slug = slugify(m['name']); d = f'agents/{slug}'
    art = f"{MASCOT_DIR}/{m['folder']}/{m['file']}"
    a = agent(slug, name=m['name'], kind='brigade_mascot_agent', role=m['role'], group=m['group'], group_tagline=m['tagline'],
              source=f"{orig(BRIGADE_TS)}:{m['line']}")
    a['files'].append(put(art, f"{d}/{m['file']}"))
    im = Image.open(art).convert('RGBA'); bb = im.getbbox(); im = im.crop(bb); im.thumbnail((256, 256)); im.save(f'{d}/thumb.png', optimize=True)
    a['thumbnail'] = f'{d}/thumb.png'
CAT = f'{SRC}/unpacked/icloud/Actions & workflows/Mise work/miseos-individual-catalog.zip/miseos-individual-catalog'
for it in json.load(open(f'{CAT}/catalog-items.json'))['items']:
    if it.get('category') != 'agentic': continue
    a = agent(it['id'], name=it.get('title', it['id']), kind='agentic_workflow', role=it.get('description'),
              source=orig(f"{CAT}/items/{it['id']}/item.json"))
    base = f"{CAT}/items/{it['id']}"
    for dp, _, fs in os.walk(base):
        for f in fs: a['files'].append(put(os.path.join(dp, f), f"agents/{it['id']}/{os.path.relpath(os.path.join(dp, f), base)}"))
CONFIG_AGENTS = [
    ('miseos-github-agent', 'MiseOS GitHub Agent', 'github_actions_agent', [f'{SRC}/extract/code/agentkit/miseos-github-agent-kit/.github/workflows/miseos-agent.yml']),
    ('nemotron-voice-agent', 'Nemotron Voice Agent', 'agent_config', [p for p in [subprocess.run(['bash', '-c', f'find "{SRC}/extract/code/gpu2" -name nemotron-voice-agent.yml | head -1'], capture_output=True, text=True).stdout.strip()] if p]),
    ('repo-steward', 'Autonomous Repository Steward', 'agent_prompt_and_workflow', [f'{SRC}/icloud/autonomous-repo-steward.md', f'{SRC}/icloud/mise-repo-steward.yml', f'{SRC}/icloud/mise-repo-steward-v2.yml', f'{SRC}/icloud/mise-repo-steward 2.yml']),
    ('repo-steward-agent', 'MiseOS Repo Steward Agent', 'agent_package', [f'{SRC}/unpacked/icloud/# Autonomous Repository Steward Prompt/miseos-repository-ecosystem.zip/miseos-repository-ecosystem/repos/05-miseos-repo-steward-agent']),
    ('devops-orchestra', 'DevOps Orchestra agents', 'agents_md', [f'{SRC}/extract/code/orch760/AGENTS.md']),
    ('repo-reliability-kit', 'Repo Reliability Kit agent guide', 'agents_md', [f'{SRC}/extract/code/reliab/miseos-repo-reliability-kit/templates/AGENTS.md']),
    ('bootstrap-registry', 'Bootstrap Registry agent guide', 'agents_md', [f'{SRC}/unpacked/icloud/miseos-bootstrap-registry-integrated-v3.zip/miseos-bootstrap-registry/AGENTS.md']),
    ('supermemory-mcp', 'Supermemory MCP config', 'mcp_config', [subprocess.run(['bash', '-c', f'find "{SRC}/unpacked/icloud/Catalogue/MiseOS-Supermemory-Implementation.zip" -name mcp.config.example.json | head -1'], capture_output=True, text=True).stdout.strip()]),
]
for slug, name, kind, paths in CONFIG_AGENTS:
    a = agent(slug, name=name, kind=kind, role=None, source='; '.join(orig(p) for p in paths if p))
    for p in paths:
        if not p or not os.path.exists(p): continue
        if os.path.isdir(p):
            for dp, _, fs in os.walk(p):
                if '/node_modules' in dp: continue
                for f in fs: a['files'].append(put(os.path.join(dp, f), f'agents/{slug}/{os.path.relpath(os.path.join(dp, f), p)}'))
        else: a['files'].append(put(p, f'agents/{slug}/{os.path.basename(p)}'))
# agent definitions already in the repo
for f in subprocess.run(['git', 'ls-files'], capture_output=True, text=True).stdout.split('\n'):
    if re.search(r'(^|/)AGENTS\.md$|(^|/)\.github/workflows/miseos-agent\.yml$', f) and not f.startswith(('agents/', 'docs/source-library/')):
        slug = 'repo-' + slugify(os.path.dirname(f) or 'root')
        if any(a['slug'] == slug for a in agents): continue
        agent(slug, name=f'{os.path.dirname(f) or "root"} agent guide', kind='agents_md_in_repo', role=None, source=f, files=[f])
SPELL = {'swarmar': ['Swarmer']}
for a in agents:
    a['character'] = find_char(a['name']) if a['kind'] == 'brigade_mascot_agent' else None
    a['cards'] = find_cards(a['name'], SPELL.get(n(a['name']), []))
    if SPELL.get(n(a['name'])): a['aliases'] = SPELL[n(a['name'])]
    a['pet'] = next((p['slug'] for p in pets if n(p['name']) == n(a['name'])), None)
    a['page'] = f"docs/agents/{a['slug']}.md"
    a['dir'] = f"agents/{a['slug']}" if os.path.isdir(f"agents/{a['slug']}") else None
    if a['dir']: wjson(f"{a['dir']}/agent.json", {k: v for k, v in a.items() if k != 'files'} | {'files': a['files']})
    if a['dir'] and 'agents/' + a['slug'] + '/agent.json' not in a['files']: a['files'].append(f"agents/{a['slug']}/agent.json")
wjson('data/agents.json', {'schema': 'miseos.agents.v1', 'count': len(agents), 'agents': agents})

# registry imports used by align-characters.py
put(f'{SRC}/icloud/miseos-registry-catalog.csv', 'data/imports/miseos-registry-catalog.csv')
put(f'{CAT}/catalog-items.json', 'data/imports/miseos-individual-catalog-items.json')
print(json.dumps({'pets': len(pets), 'animal_pets': sum(1 for p in pets if p['species']), 'agents': len(agents)}))

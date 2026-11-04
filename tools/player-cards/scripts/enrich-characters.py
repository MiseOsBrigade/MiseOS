#!/usr/bin/env python3
"""Fill every remaining empty field on character records and unmatched-card records.

Runs after align-characters.py and before build-character-pages.mjs (see `npm run cards:enrich`).
Two passes, both recorded in each record's `sources` map:
  1. repo-sourced: values found in repository / source-library material
     (canon-bible asset-registry crosswalk, data/agents.json, data/repo-pets.json, card OCR,
     department missions already defined on registry characters).
  2. authored: values written for the card design and derived from the card's own printed text,
     role and kitchen theme. Their source always starts with `authored:` so they can never be
     mistaken for repository facts.
Deterministic: no randomness, no network. Implementation status is never upgraded: entries with
no code are marked `designed_not_implemented` and carry a proposed handler/command spec.
"""
import csv, glob, hashlib, json, os, re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
os.chdir(ROOT)
U = 'Not yet defined in the source material'
XW = ('docs/source-library/icloud/Catalogue/All images/Mise/MiseOS Bible/'
      'MiseOS-Canon-Bible-v1.0-package.zip/miseos_canon_bible_v1_0/registry/asset-registry.csv')
AUTH = 'authored: card design'
CONV = 'data/imports/master-roster-cards.csv (mise roster run command convention)'

def h(s, n):
    return int(hashlib.sha1(s.encode()).hexdigest(), 16) % n

def pick(seed, xs):
    return xs[h(seed, len(xs))]

def empty(x):
    return x is None or x == U or x == '' or (isinstance(x, (list, dict)) and not x)

def kebab(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

def camel(s):
    p = [w for w in re.split(r'[^A-Za-z0-9]+', s) if w]
    return (p[0].lower() + ''.join(w.capitalize() for w in p[1:])) if p else 'handler'

# ---------------------------------------------------------------- themes (authored design vocabulary)
# Each theme: keywords (matched against name/role/OCR), department, workflow, gate, problem, verbs,
# ability seeds, closest agents / repo pets, lore motif, signature lines.
T = {
 'supply': dict(kw='supply inventory stock pantry provision provisioner route reserve sourcing harvest forager grain herb spice ingredient crate courier traceable',
   dept='Operations Kitchen', verb='scouts inbound supply, checks stock levels against par and secures the route for every ingredient the line depends on',
   inputs=['stock levels vs. par', 'supplier routes', 'delivery manifests', 'freshness / quality grades'],
   outputs=['scout report', 'reserve status (ready / low / out)', 'reorder list', 'traceability record'],
   gate='Traceability check: every item in the report maps to a named supplier route and a quality grade; nothing is marked ready without both.',
   problem='Stations stall mid-service when an ingredient (or dependency) runs out or arrives without provenance.',
   verbs=['scout', 'reserve', 'trace'], agents=['steward-prime', 'prepbot', 'storage'], pets=['mise-sommelier', 'mizu'],
   motif='the loading dock before dawn', lines=['If it is on the line, I know where it came from.', 'Par is a promise. I keep it.', 'Nothing arrives untraced.']),
 'sauce': dict(kw='sauce saucier glaze broth stock umami flavor reduction emulsion miso kombu oil',
   dept='Platform Kitchen', verb='builds the base flavours other stations depend on: reductions, stocks and mother sauces that must taste the same every time',
   inputs=['base recipe / spec', 'ingredient batch', 'taste targets (salt, acid, umami)', 'station order'],
   outputs=['finished base batch', 'tasting note', 'batch label with date and allergens'],
   gate='Taste-and-label check: a batch only ships to stations after it matches the spec on taste and carries a dated allergen label.',
   problem='Every dish downstream drifts when the shared base (or shared library) changes without anyone tasting it.',
   verbs=['reduce', 'taste', 'label'], agents=['umami-code', 'api-gateway', 'architect'], pets=['umami-code', 'mise-sauce'],
   motif='the back burner where the stockpots never go cold', lines=['The base decides the dish.', 'Taste twice, ship once.', 'Low and slow, never sloppy.']),
 'heat': dict(kw='sear roast grill char smoke ash ashen fire heat flame wok pan crisp grillardin rotisseur burn',
   dept='Reliability Kitchen', verb='runs the high-heat line: controls flame, timing and doneness so pressure never turns into burn',
   inputs=['ticket with doneness target', 'heat / load reading', 'timer', 'protein or batch on the pass'],
   outputs=['cooked-to-spec item', 'doneness check', 'heat log', 'escalation if the line runs hot'],
   gate='Doneness gate: nothing leaves the station without a probe/timer reading inside the target band; overheated runs are pulled, not served.',
   problem='Under load, the hottest station is where quality collapses first (outages, burnt releases).',
   verbs=['sear', 'probe', 'cool-down'], agents=['kaji', 'scale-oni', 'perf-chef'], pets=['kaji', 'scale-oni'],
   motif='the flat-top at the peak of Friday service', lines=['Heat is a tool, not a mood.', 'Hot pan, calm hands.', 'Pull it at the line, not past it.']),
 'cold': dict(kw='cold zero temp temperature chill frozen ice freeze steam tamer thermal',
   dept='Reliability Kitchen', verb='keeps every item inside its safe temperature band and flags drift before it becomes spoilage',
   inputs=['probe / sensor readings', 'storage map', 'HACCP limits', 'hold times'],
   outputs=['temperature log', 'drift alert', 'discard / re-chill decision'],
   gate='Temperature gate: readings outside the safe band for longer than the hold limit force a discard or re-chill; no override without a logged reason.',
   problem='Silent drift (heat, latency, resource pressure) spoils work long before anyone notices.',
   verbs=['probe', 'chill', 'log-temp'], agents=['observatory', 'alarmer', 'sre-chef'], pets=['mise-runtime', 'null-chan'],
   motif='the walk-in, humming at three degrees', lines=['Stay in the band.', 'Cold logic, safe food.', 'Drift is caught, never discovered.']),
 'ferment': dict(kw='ferment fermenta pickle brine cure culture miso koji preserve preservation vinegar aging',
   dept='Data & Insight Kitchen', verb='manages slow processes (ferments, cures, brines) by tracking time, salinity and cultures until they are proven ready',
   inputs=['batch start date', 'salinity / pH readings', 'culture lineage', 'target profile'],
   outputs=['batch readiness verdict', 'culture log', 'shelf-life label'],
   gate='Readiness gate: a batch is released only when pH/salinity readings and elapsed time both meet the recipe; lineage must be recorded.',
   problem='Long-running work (experiments, data jobs) gets released before it has actually finished maturing.',
   verbs=['start-batch', 'measure', 'release-batch'], agents=['database', 'logger', 'observatory'], pets=['mise-apprentice', 'mise-lattice'],
   motif='a shelf of labelled jars that each tell a story', lines=['Time is an ingredient.', 'Patience, measured.', 'Nothing rushes the culture.']),
 'blade': dict(kw='slice slicer butcher blade knife cut boucher swift portion trim dice',
   dept='Pipeline Kitchen', verb='breaks large work down into clean, consistent portions so every downstream station gets exactly what it needs',
   inputs=['whole product / large task', 'portion spec', 'yield target'],
   outputs=['portioned units', 'yield report', 'trim / waste count'],
   gate='Yield gate: portions are weighed against spec; out-of-tolerance cuts are re-trimmed or logged as waste before they reach a station.',
   problem='Oversized, uneven work items jam the line and waste effort.',
   verbs=['portion', 'weigh', 'yield'], agents=['dispatcher', 'automator', 'iron-hashi'], pets=['iron-hashi', 'flash-riku'],
   motif='a freshly honed edge and a cutting board ruled in centimetres', lines=['Clean cuts, clean handoffs.', 'One motion, no waste.', 'Measure, then cut.']),
 'plate': dict(kw='plate plating plater garnish zen poet presentation sweet pastry dessert cacao architect visual style finish',
   dept='Platform Kitchen', verb='finishes and presents the work: composition, garnish and a final visual check at the pass',
   inputs=['cooked components', 'plating spec / style guide', 'ticket'],
   outputs=['plated dish', 'pass photo / visual check', 'send-back note when something is off'],
   gate='Pass inspection: each plate is compared to the spec image before it leaves; mismatches go back, never out.',
   problem='Good work loses its value when the last step (UI, docs, release notes) is sloppy.',
   verbs=['plate', 'inspect', 'send'], agents=['ux-chef', 'devrel', 'doc-writer'], pets=['yume', 'mise-garde'],
   motif='the pass under warm lights, tweezers in hand', lines=['The last touch is the first impression.', 'Calm hands, clean plate.', 'If it is not right, it goes back.']),
 'clean': dict(kw='sanitation sanitize clean hygiene wash plongeur waste no-waste ninja compost recycle',
   dept='Security Kitchen', verb='keeps the kitchen clean and the waste stream honest: sanitising surfaces, logging waste and closing contamination risks',
   inputs=['station checklist', 'waste log', 'sanitiser concentration readings', 'incident reports'],
   outputs=['sanitation sign-off', 'waste report', 'contamination alert'],
   gate='Sanitation sign-off: a station reopens only after its checklist is complete and readings are in range; any contamination opens an incident.',
   problem='Residue (stale secrets, dead code, waste) quietly contaminates everything it touches.',
   verbs=['sanitize', 'audit-waste', 'sign-off'], agents=['compliance', 'scanner', 'token-monk'], pets=['mise-locker', 'kuro-guard'],
   motif='a steel counter wiped until it reflects the ceiling lights', lines=['Clean is a habit, not an event.', 'Nothing wasted, nothing hidden.', 'A clean station is a safe station.']),
 'time': dict(kw='shift sentinel conductor kitchen-conductor schedule scheduler timer pulse captain order orderly owl energy keeper legacy menu maestro dispatcher expediter tempo rhythm',
   dept='Operations Kitchen', verb='holds the rhythm of service: sequencing tickets, staffing and timing so every station fires at the right moment',
   inputs=['open tickets', 'station capacity', 'shift roster', 'service timeline'],
   outputs=['fire order / run sheet', 'shift handoff note', 'bottleneck alert'],
   gate='Expo check: a course is fired only when every component reports ready; handoffs require a written note.',
   problem='Without a conductor, stations fire out of sequence and work arrives cold or late.',
   verbs=['fire', 'handoff', 'rebalance'], agents=['conductor', 'scheduler', 'tensho'], pets=['tensho', 'mise-maestro'],
   motif='the ticket rail at full stretch, every slip in order', lines=['On my count.', 'Every ticket, on time.', 'Rhythm before speed.']),
 'code': dict(kw='code coder byte hacker flavor-hacker implementation compile build developer dev engineer debug',
   dept='Pipeline Kitchen', verb='turns a plan into working code through a plan, code, test, deploy loop',
   inputs=['task / issue', 'repository context', 'acceptance criteria'],
   outputs=['commit / pull request', 'test results', 'deploy status'],
   gate='CI gate: no merge without green tests and a reviewed diff.',
   problem='Ideas stall between plan and production.',
   verbs=['plan', 'build', 'ship'], agents=['coder', 'build-kun', 'debugger'], pets=['build-kun', 'mise-bootstrap'],
   motif='a terminal glowing beside the prep list', lines=['Code. Compile. Cuisine.', 'Plan it, prove it, ship it.', 'Clean code, perfect dish.']),
 'security': dict(kw='security secure guard firewall encrypt encryptor vault compliance gatekeeper audit auditor policy pen-tester shield protect',
   dept='Security Kitchen', verb='guards the perimeter of the kitchen: access, secrets and policy, with an audit trail for every exception',
   inputs=['access requests', 'policy set', 'scan findings', 'secret inventory'],
   outputs=['allow / deny decision', 'audit record', 'remediation ticket'],
   gate='Policy gate: no access or release without a policy match and a recorded approver.',
   problem='Unchecked access and leaked secrets turn one mistake into an incident.',
   verbs=['scan', 'enforce', 'audit'], agents=['kuro-guard', 'firewall', 'security-auditor'], pets=['kuro-guard', 'mise-locker'],
   motif='the locked dry store and the keyring that never leaves the belt', lines=['Trust, then verify. Every time.', 'No key, no entry.', 'Guard. Audit. Comply.']),
 'quality': dict(kw='test tester review reviewer quality inspector taste canary qa grade verify validator',
   dept='Reliability Kitchen', verb='tastes and tests before anything is served: reviews, checks and canaries against the spec',
   inputs=['candidate change / dish', 'spec / acceptance tests', 'previous results'],
   outputs=['pass / send-back verdict', 'review notes', 'test evidence'],
   gate='Taste gate: a change ships only with recorded evidence that it meets the spec.',
   problem='Defects reach the guest when nobody tastes before serving.',
   verbs=['taste', 'review', 'verdict'], agents=['reviewer', 'tester', 'quality-guard'], pets=['mise-garde', 'mise-brigadier'],
   motif='a spoon in every pot', lines=['Tasted before served.', 'Evidence or it goes back.', 'Quality is checked, not assumed.']),
 'data': dict(kw='data insight analytics metric metrics seeker scholar oracle analyze trust graph sbom index',
   dept='Data & Insight Kitchen', verb='reads the numbers behind service (covers, waste, timings) and turns them into the next improvement',
   inputs=['service metrics', 'logs', 'historic baselines'],
   outputs=['insight report', 'trend alert', 'recommended change'],
   gate='Evidence gate: every recommendation cites the metric and time window it came from.',
   problem='Kitchens repeat the same mistakes when nobody reads the data.',
   verbs=['measure', 'analyze', 'recommend'], agents=['observatory', 'prometheus', 'risk-oracle'], pets=['flag-fox', 'mise-lattice'],
   motif='a clipboard of tally marks that becomes a chart by morning', lines=['Learn. Optimize. Evolve.', 'The numbers taste honest.', 'Measure what matters.']),
 'bread': dict(kw='knead bread dough boulanger bake baker grain rise proof',
   dept='Pipeline Kitchen', verb='runs the bake: mixing, proofing and baking on a fixed schedule so the line always has fresh builds',
   inputs=['dough / build recipe', 'proof timer', 'oven schedule'],
   outputs=['baked batch', 'bake log', 'reject count'],
   gate='Proof gate: a batch goes in the oven only when proofing is complete; underproofed batches are held.',
   problem='Rushed builds come out half-baked.',
   verbs=['mix', 'proof', 'bake'], agents=['build-kun', 'pipeline', 'automator'], pets=['build-kun', 'yume'],
   motif='the oven light at 4 a.m.', lines=['Proof before bake.', 'Rise, then rise again.', 'Fresh every run.']),
 'veg': dict(kw='veg vegetable virtuoso citrus zest garden green herb produce',
   dept='Operations Kitchen', verb='works through the produce: washing, prepping and seasoning vegetables at peak freshness',
   inputs=['produce delivery', 'prep list', 'freshness grades'],
   outputs=['prepped produce', 'prep-list completion', 'freshness discard log'],
   gate='Freshness gate: produce below grade is composted, not prepped; prep list items are ticked only when done.',
   problem='Prep falls behind and stale produce sneaks onto plates.',
   verbs=['prep', 'grade', 'season'], agents=['prepbot', 'mizu', 'steward-prime'], pets=['mizu', 'mise-apprentice'],
   motif='crates of produce under cold running water', lines=['Peak freshness, every plate.', 'Prep is the quiet half of service.', 'Bright, clean, ready.']),
 'platform': dict(kw='sdk package container runner schema template registry plugin client theme platform primitive devcontainer tooling cli',
   dept='Platform Kitchen', verb='provides a shared platform building block other kitchens install and build on',
   inputs=['consumer repository', 'manifest / configuration', 'version pin'],
   outputs=['installed capability', 'version record', 'compatibility report'],
   gate='Golden-path gate: consumers install only pinned, signed versions that pass the registry schema.',
   problem='Every team reinvents the same foundations differently.',
   verbs=['install', 'pin', 'verify'], agents=['architect', 'terraformer', 'docker'], pets=['mise-bootstrap', 'mise-brigadier'],
   motif='the stainless steel shelving every station is bolted to', lines=['Golden paths, stable floors.', 'Build once, serve every kitchen.', 'Pin it, sign it, ship it.']),
 'pipeline': dict(kw='workflow action release ci deploy pipeline preflight governance publish pages codeql dependency merge',
   dept='Pipeline Kitchen', verb='runs an automated gate in the delivery pipeline',
   inputs=['pull request or tag', 'workflow configuration', 'repository state'],
   outputs=['check run / status', 'annotations', 'release artefact or block'],
   gate='Pipeline gate: the job exits non-zero and blocks the merge or release when its checks fail.',
   problem='Manual release steps are skipped under pressure.',
   verbs=['check', 'gate', 'publish'], agents=['pipeline', 'github-chef', 'argo-chef'], pets=['tensho', 'mise-brigadier'],
   motif='a conveyor of tickets moving through the pass', lines=['Build. Test. Deploy. Repeat.', 'Green or it waits.', 'The gate never sleeps.']),
}
ORDER = ['supply', 'sauce', 'ferment', 'cold', 'heat', 'blade', 'bread', 'veg', 'clean', 'security', 'quality', 'code',
         'data', 'plate', 'time', 'platform', 'pipeline']
ROLE = {'supply': 'Économe (stores & supply)', 'sauce': 'Saucier', 'heat': 'Grillardin', 'cold': 'Garde-manger (cold & temperature)',
        'ferment': 'Fermentation cook', 'blade': 'Boucher (portioning)', 'plate': 'Dresseur (plating & finish)', 'clean': 'Plongeur (sanitation)',
        'time': 'Aboyeur (expediter)', 'code': 'Implementation cook', 'security': 'Kitchen steward (access & security)', 'quality': 'Taster (quality control)',
        'data': 'Kitchen analyst', 'bread': 'Boulanger', 'veg': 'Légumier', 'platform': 'Station builder (platform)', 'pipeline': 'Line runner (pipeline)'}
DEPT_THEME = {'Operations Kitchen': 'time', 'Pipeline Kitchen': 'pipeline', 'Platform Kitchen': 'platform',
              'Reliability Kitchen': 'quality', 'Security Kitchen': 'security', 'Data & Insight Kitchen': 'data'}

def theme_of(text, dept=None):
    t = text.lower()
    best, score = None, 0
    for k in ORDER:
        s = sum(1 for w in T[k]['kw'].split() if re.search(r'\b' + re.escape(w), t))
        if s > score: best, score = k, s
    if best: return best
    return DEPT_THEME.get(dept, 'time')

# ---------------------------------------------------------------- data
ents = {os.path.basename(f)[:-5]: json.load(open(f)) for f in sorted(glob.glob('data/characters/*.json'))}
by_name = {e['name'].lower(): s for s, e in ents.items()}
cards_doc = json.load(open('data/player-cards.json'))
ocr = json.load(open('data/player-cards-ocr.json'))
AG = json.load(open('data/agents.json'))['agents']; AGS = {a['slug']: a for a in AG}
PE = json.load(open('data/repo-pets.json'))['pets']; PES = {p['slug']: p for p in PE}
missions = {}
for e in ents.values():
    if not empty(e.get('department')) and not empty(e.get('department_mission')):
        missions.setdefault(e['department'], (e['department_mission'], e['sources'].get('department_mission')))
xwalk = {}
if os.path.exists(XW):
    for r in csv.DictReader(open(XW, encoding='utf-8')):
        m = re.search(r'Visible card title: ([^.]+)', r['notes'])
        if m and r['canonical_name'] and m.group(1).lower() != r['canonical_name'].lower():
            xwalk.setdefault(m.group(1).strip().lower(), (r['canonical_name'], r['match_status'], r['confidence']))

# OCR word segmentation (glued words like INBOUNDSUPPLY)
vocab = set()
for v in ocr.values():
    for s in v:
        ws = re.findall(r'[A-Za-z]+', s)
        for w in ws:
            if 2 <= len(w) <= 7 or (len(ws) >= 2 and len(w) <= 12): vocab.add(w.lower())
for f in sorted(glob.glob('data/imports/*.csv')) + sorted(glob.glob('data/imports/*.json')):
    for w in re.findall(r'[A-Za-z]+', open(f, encoding='utf-8', errors='ignore').read()):
        if 3 <= len(w) <= 12 and not (w.isupper() and len(w) > 7): vocab.add(w.lower())
vocab |= set('alchemical luster maximum downtime chocolate arts mirror finish safe defaults stable output zero downtime gilded truffle we don just protect trust response flow cache hit fry crispness index flavor yield cve severity orchestrate orchestration anomaly outlier baseline drift index score potage recipe scrolls umami ember precision perfect skill cut inbound supply inventory level route secured scout report ready reserve code execution commit quality deploy status build flow clean perfect dish plan test scale running implementation building excellence system health'.split())

def seg(tok):
    w = tok.lower()
    if len(w) < 8 or not w.isalpha() or w in vocab: return tok
    best = [None] * (len(w) + 1); best[0] = []
    for i in range(1, len(w) + 1):
        for j in range(max(0, i - 12), i):
            if best[j] is not None and w[j:i] in vocab and len(w[j:i]) >= 2:
                c = best[j] + [w[j:i]]
                if best[i] is None or len(c) < len(best[i]): best[i] = c
    return ' '.join(best[-1]).upper() if best[-1] and len(best[-1]) <= 4 else tok

STOP = set('optimal active ready online success fresh complete approved verified status level ok stable max high a+ mise orchestra miseos mo miseorchestra mise-os the and of a an v s ultra ultr tier type role id'.split())
RAR = ['ULTRA MYTHIC', 'MYTHIC', 'LEGENDARY', 'EPIC', 'RARE', 'UNCOMMON', 'COMMON', 'GENESIS']

def labels(lines, name, role):
    out, seen = [], set()
    skip = {name.lower(), (role or '').lower()}
    for raw in lines:
        s = re.sub(r'^[^A-Za-z0-9]+|[^A-Za-z0-9+%)]+$', '', raw.strip())
        s = ' '.join(seg(t) for t in s.split())
        k = s.lower()
        if not s or k in seen or k in skip or k in STOP or '★' in raw: continue
        if re.fullmatch(r'[\d.%+\-/ :x]+', s) or len(re.sub(r'[^A-Za-z]', '', s)) < 4: continue
        if len(s.split()) > 4 or any(c.islower() for c in s[1:]) and len(s.split()) > 2: continue
        if any(r.lower() in k for r in RAR + ['ULTR']) or re.search(r'[()]', s) or len(s) > 28 or any(len(w) > 14 for w in s.split()): continue
        seen.add(k); out.append(s)
    return out

def sentences(lines):
    return [l.strip() for l in lines if len(l.split()) >= 5 and sum(c.islower() for c in l) > 10 and len(l) < 220]

def meters(lines):
    res, prev = [], None
    for raw in lines:
        s = raw.strip()
        m = re.fullmatch(r'1?(\d{1,3})\s*%', s)
        if m and prev:
            v = int(m.group(1));
            if 0 < v <= 100: res.append((prev, v))
        elif re.search(r'[A-Za-z]{3}', s) and not s.startswith('>') and s.lower() not in STOP:
            prev = ' '.join(seg(t) for t in re.sub(r'[^A-Za-z ]', ' ', s).split())
    return res

AX = ['power', 'precision', 'speed', 'resilience', 'intelligence', 'teamwork']
AXKW = {'precision': 'quality precision accuracy grade clean taste freshness', 'speed': 'speed efficiency fast latency time flow deploy',
        'resilience': 'reliability stability uptime secure secured safe health integrity', 'intelligence': 'insight analysis data intelligence knowledge scan',
        'teamwork': 'harmony sync team orchestra inventory level reserve route', 'power': 'power heat scale capacity strength execution'}
THEME_AX = {'supply': 'teamwork', 'sauce': 'precision', 'heat': 'power', 'cold': 'resilience', 'ferment': 'intelligence', 'blade': 'speed',
            'plate': 'precision', 'clean': 'resilience', 'time': 'teamwork', 'code': 'speed', 'security': 'resilience', 'quality': 'precision',
            'data': 'intelligence', 'bread': 'resilience', 'veg': 'speed', 'platform': 'resilience', 'pipeline': 'speed'}

def stats_for(slug, stars, ms, th):
    base = 52 + (stars or 3) * 7
    st = {a: max(35, min(97, base + h(slug + a, 17) - 8)) for a in AX}
    st[THEME_AX[th]] = min(99, st[THEME_AX[th]] + 8)
    basis, used = [], set()
    for lab, val in ms:
        l = lab.lower(); ax = next((a for a in AX if a not in used and any(w in l for w in AXKW[a].split())), None)
        ax = ax or next((a for a in [THEME_AX[th], 'resilience', 'precision', 'speed', 'intelligence', 'teamwork', 'power'] if a not in used), None)
        if not ax: break
        used.add(ax)
        st[ax] = val; basis.append(f'{ax}←{lab.title()} {val}%')
    return st, basis

def stars_of(lines):
    for l in lines:
        if '★' in l: return l.count('★')
    return None

def rarity_of(lines):
    j = ' '.join(lines).upper()
    for r in RAR:
        if re.search(r'\b' + r + r'\b', j): return r.title()
    return None

STAR_RAR = {5: 'Legendary', 4: 'Epic', 3: 'Rare', 2: 'Uncommon', 1: 'Common'}

# ---------------------------------------------------------------- authored text
PERSON = re.compile(r'(er|or|ist|ian|chef|cook|sage|master|keeper|guard|captain|scout|lead|steward|monk|samurai|ninja|poet|oracle|doc|star|sentinel|maestro|alchemist|virtuoso|whisperer|seeker|scholar|baron|commander|coach|phantom|tamer|maven|swift|blade|owl|zest|zero|byte|one|fermenta)s?\b', re.I)
def lore_for(e, th, labs, dept, counterpart):
    n, r, t = e['name'], e.get('role') or 'cook', T[th]
    r = r if PERSON.search(r.split()[-1] if r.split() else '') else f'specialist for {r.lower()}'
    hook = (', '.join(x.title() for x in labs[:3])) if labs else None
    v = [f"Picture {t['motif']}: that is where {n} is happiest. As {dept}'s {r}, {n} {t['verb']}.",
         f"Most of the brigade only notices {n} when something is missing, which is exactly the point. {n} {t['verb']}; the image the crew uses for it is {t['motif']}.",
         f"Ask the brigade about {n} and they describe {t['motif']}. As {dept}'s {r}, {n} {t['verb']}, and the rest of the kitchen plans service around that rhythm."]
    s = pick(e['slug'], v)
    if hook: s += f" The card calls out {hook}: the checks {n} runs before calling anything ready."
    if counterpart: s += f" In the canon crosswalk this card is a provisional match for {counterpart}."
    return s

def phrase_for(e, th, labs):
    t = T[th]; lines = list(t['lines'])
    out = t['outputs'][h(e['slug'] + 'o', len(t['outputs']))]
    lines += [f"Every {out.split(' (')[0]} accounted for.", f"{t['verbs'][0].replace('-', ' ').capitalize()} first, then service."]
    if labs:
        l1 = labs[h(e['slug'] + 'l', len(labs))].title()
        lines += [f"{l1}, then everything else.", f"No {l1.lower()} left to chance.", f"{l1}: checked, not assumed."]
    return pick(e['slug'] + 'p', lines)

def summary_for(e, th):
    return f"{e['name']} {T[th]['verb']}."

def actions_for(e, th, dept):
    s = e['slug']; d = kebab(dept)
    a = [{'command': f'mise roster run {s} --dept {d} --solo --emit report', 'status': 'proposed', 'source': f'authored: follows {CONV}'}]
    t = T[th]
    for i, vb in enumerate(t['verbs']):
        a.append({'command': f'mise {s} {vb}', 'reads': t['inputs'][min(i, len(t['inputs']) - 1)], 'emits': t['outputs'][-1] if i == len(t['verbs']) - 1 else t['outputs'][min(i, len(t['outputs']) - 1)],
                  'status': 'proposed', 'source': f'{AUTH} (theme "{th}")'})
    return a

def abilities_for(e, th, labs):
    if not labs and e.get('kind') in ('registry_character', 'registry_manifest', 'catalog_item') and e.get('role'):
        ab = [e['role']] + [v.replace('-', ' ').title() for v in T[th]['verbs']]
        return ab, f'role from {e["sources"].get("role", "record")} + {AUTH} (workflow steps for theme "{th}")'
    if labs:
        return [x.title() for x in labs[:6]], 'data/player-cards-ocr.json (printed card labels, glued OCR words segmented)'
    verbs = T[th]['verbs']
    return [v.replace('-', ' ').title() for v in verbs] + [T[th]['outputs'][0].title()], f'{AUTH} (no text printed; from role and theme "{th}")'

# ---------------------------------------------------------------- enrich one record
stats = {'repo': 0, 'authored': 0}

def setf(e, key, val, src, path=None):
    cur = e
    keys = (path or key).split('.')
    for k in keys[:-1]: cur = cur[k]
    if not empty(cur.get(keys[-1])): return False
    cur[keys[-1]] = val
    e['sources'][path or key] = src
    stats['authored' if src.startswith('authored') else 'repo'] += 1
    return True

def ocr_lines(e):
    out = []
    for t in e.get('card_text', []): out += t['printed_text']
    return out

def enrich(e):
    e.setdefault('sources', {}); e.setdefault('helps', {}); e.setdefault('workflow', {})
    lines = ocr_lines(e)
    labs = labels(lines, e['name'], e.get('role'))
    cw = xwalk.get(e['name'].lower())
    cslug = by_name.get(cw[0].lower()) if cw else None
    if cslug == e['slug']: cslug = None
    ce = ents.get(cslug) if cslug else None
    # aliases
    if not e.get('aliases'):
        al = []
        if cw: al.append(f'{cw[0]} (canon crosswalk, {cw[1]})')
        for a in AG:
            if a.get('character') == e['slug'] and a['name'] != e['name']: al.append(a['name'])
        if al: e['aliases'] = al; e['sources']['aliases'] = XW if cw else 'data/agents.json'; stats['repo'] += 1
        else:
            e['aliases'] = ['None recorded (no alternate title in the canon crosswalk or agents.json)']; e['sources']['aliases'] = 'data/player-cards.json + canon crosswalk (no alternate title found)'; stats['repo'] += 1
    text = ' '.join([e['name'], e.get('role') or '', e['workflow'].get('summary') or '', ' '.join(labs)]).replace(U, '')
    dept = None if empty(e.get('department')) else e['department']
    if not dept and ce and not empty(ce.get('department')):
        setf(e, 'department', ce['department'], f'{XW} → data/characters/{cslug}.json'); dept = ce['department']
    th = theme_of(text, dept)
    if not dept:
        setf(e, 'department', T[th]['dept'], f'{AUTH} (kitchen chosen from role/printed text, theme "{th}")'); dept = T[th]['dept']
    if dept in missions: setf(e, 'department_mission', missions[dept][0], f'{missions[dept][1]} (mission of {dept})')
    # rarity / printed meta
    pr = rarity_of(lines)
    if pr: setf(e, 'card_rarity_printed', pr, 'data/player-cards-ocr.json')
    stv = e.get('card_stars_printed') if isinstance(e.get('card_stars_printed'), int) else stars_of(lines)
    if not e['cards']:
        setf(e, 'card_rarity_printed', 'No card art linked, so nothing printed', 'data/player-cards.json (no card for this entry)')
        setf(e, 'card_stars_printed', 'No card art linked', 'data/player-cards.json (no card for this entry)')
        setf(e, 'card_meters_printed', 'No card art linked', 'data/player-cards.json (no card for this entry)')
    else:
        setf(e, 'card_rarity_printed', 'Not printed on the card', 'data/player-cards-ocr.json (no rarity word in OCR)')
        if stv: setf(e, 'card_stars_printed', stv, 'data/player-cards-ocr.json')
        setf(e, 'card_stars_printed', 'Not printed on the card', 'data/player-cards-ocr.json (no stars in OCR)')
        setf(e, 'card_meters_printed', 'Not printed on the card', 'data/player-cards-ocr.json (no % meters in OCR)')
    if ce and not empty(ce.get('rarity')): setf(e, 'rarity', ce['rarity'], f'{XW} → data/characters/{cslug}.json')
    if pr: setf(e, 'rarity', pr, 'data/player-cards-ocr.json (printed rarity)')
    setf(e, 'rarity', STAR_RAR.get(stv if isinstance(stv, int) else 0, 'Common' if e['kind'] != 'registry_manifest' else 'Rare'),
         f'{AUTH} (from printed star count {stv})' if isinstance(stv, int) else f'{AUTH} (default tier; no stars printed)')
    # stats
    if empty(e.get('stats')):
        st, basis = stats_for(e['slug'], stv if isinstance(stv, int) else None, meters(lines), th)
        setf(e, 'stats', st, f'{AUTH} (6-axis roster scale; ' + ('printed meters mapped: ' + ', '.join(basis) if basis else f'baseline from stars + theme "{th}"') + ')')
    # abilities
    if not e.get('abilities'):
        ab, src = abilities_for(e, th, labs); e['abilities'] = ab; e['sources']['abilities'] = src
        stats['authored' if 'authored' in src and not src.startswith('data/') else 'repo'] += 1
    # lore / phrase
    sent = sentences(lines)
    if sent: setf(e, 'lore', ' '.join(sent[:2]), 'data/player-cards-ocr.json (text printed on the card)')
    setf(e, 'lore', lore_for(e, th, labs, dept, cw[0] if cw else None), f'{AUTH} (derived from printed card text/role)')
    setf(e, 'signature_phrase', phrase_for(e, th, labs), f'{AUTH} (derived from printed card text/role)')
    # workflow
    t = T[th]
    setf(e, 'workflow.summary', summary_for(e, th), f'{AUTH} (theme "{th}")', 'workflow.summary')
    setf(e, 'workflow.inputs', t['inputs'], f'{AUTH} (theme "{th}")', 'workflow.inputs')
    outs = list(t['outputs'])
    if labs and th == 'supply': pass
    setf(e, 'workflow.outputs', outs, f'{AUTH} (theme "{th}")', 'workflow.outputs')
    setf(e, 'workflow.proof_gate', t['gate'], f'{AUTH} (theme "{th}")', 'workflow.proof_gate')
    # actions
    if empty(e.get('actions')):
        e['actions'] = actions_for(e, th, dept); e['sources']['actions'] = f'authored: follows {CONV}'; stats['authored'] += 1
    # helps
    setf(e, 'helps.station', e.get('role') if not empty(e.get('role')) else dept, 'role' if not empty(e.get('role')) else 'department', 'helps.station')
    if dept in missions: setf(e, 'helps.mission', missions[dept][0], f'{missions[dept][1]} (mission of {dept})', 'helps.mission')
    setf(e, 'helps.problem', t['problem'], f'{AUTH} (theme "{th}")', 'helps.problem')
    setf(e, 'helps.proof_gate', e['workflow']['proof_gate'], e['sources'].get('workflow.proof_gate', AUTH), 'helps.proof_gate')
    # agents / pets
    if not e.get('agents'):
        ag = [a for a in AG if a.get('character') == e['slug'] or (e['cards'] and any(c['file'] for c in e['cards']) and f"docs/characters/{e['slug']}.md" in a['cards'])]
        if ag: e['agents'] = [{'name': a['name'], 'slug': a['slug']} for a in ag]; e['sources']['agents'] = 'data/agents.json'; stats['repo'] += 1
        elif ce and ce.get('agents'):
            e['agents'] = ce['agents']; e['sources']['agents'] = f'{XW} → data/characters/{cslug}.json'; stats['repo'] += 1
        else:
            e['agents'] = [{'name': AGS[s]['name'], 'slug': s} for s in t['agents'] if s in AGS]
            e['sources']['agents'] = f'{AUTH} (closest agents for theme "{th}")'; stats['authored'] += 1
    if not e.get('repo_pets'):
        pe = [p for p in PE if p.get('character') == e['slug']]
        if pe: e['repo_pets'] = [{'name': p['name'], 'slug': p['slug']} for p in pe]; e['sources']['repo_pets'] = 'data/repo-pets.json'; stats['repo'] += 1
        else:
            e['repo_pets'] = [{'name': PES[s]['name'], 'slug': s} for s in t['pets'] if s in PES]
            e['sources']['repo_pets'] = f'{AUTH} (closest repo pets for theme "{th}")'; stats['authored'] += 1
    # related
    if empty(e.get('related')):
        rel = []
        if cslug: rel.append({'name': ents[cslug]['name'], 'slug': cslug})
        same = [s for s, x in ents.items() if s != e['slug'] and x.get('_theme') == th and x['kind'] == e['kind']]
        dep = [s for s, x in ents.items() if s != e['slug'] and x.get('department') == dept and x['kind'] == 'registry_character']
        for s in sorted(same, key=lambda s: h(e['slug'] + s, 997))[:3] + sorted(dep, key=lambda s: h(e['slug'] + s, 991))[:3]:
            if s not in [r['slug'] for r in rel]: rel.append({'name': ents[s]['name'], 'slug': s})
        e['related'] = rel[:6]
        e['sources']['related'] = (f'{XW} (canon counterpart) + ' if cslug else '') + f'{AUTH} (same theme "{th}" / same department)'
        stats['authored'] += 1
    # implementation (truthful)
    im = e['implementation']
    if im['status'] == 'not_defined':
        im['status'] = 'designed_not_implemented'
        im['proposed'] = {'handler': camel(e['slug']), 'command': e['actions'][0]['command'] if isinstance(e['actions'], list) and 'command' in e['actions'][0] else f"mise roster run {e['slug']}",
                          'contract': f"inputs: {', '.join(e['workflow']['inputs']) if isinstance(e['workflow']['inputs'], list) else e['workflow']['inputs']} → outputs: {', '.join(e['workflow']['outputs']) if isinstance(e['workflow']['outputs'], list) else e['workflow']['outputs']}; refuses to emit 'ready' unless the proof gate passes"}
        e['sources']['implementation'] = 'git ls-files grep + repo (no code found) + authored: proposed handler spec'
    e['_theme'] = th
    return e

# themes first so `related` can use them
for e in ents.values():
    e['_theme'] = theme_of(' '.join([e['name'], e.get('role') or '', ' '.join(labels(ocr_lines(e), e['name'], e.get('role')))]), None if empty(e.get('department')) else e['department'])
for e in ents.values(): enrich(e)
for s, e in ents.items():
    e['theme'] = e.pop('_theme'); e['sources']['theme'] = f'{AUTH} (keyword theme used for authored fields)'
    json.dump(e, open(f'data/characters/{s}.json', 'w'), indent=2, ensure_ascii=False); open(f'data/characters/{s}.json', 'a').write('\n')

# ---------------------------------------------------------------- unmatched cards
POSTERS = {'harmonyvs-entropy', 'miseos', 'miseos-2', 'italiay', 'mise', 'specialist-tier', 'img_4556', 'data-lnsights', 'focus',
           '8309bbe1-e173-43bc-9cbb-bb510b648f67', 'miseorchestra', 'v1-0-0', 'v1-0-0-2', 'frostbyte', 'one-kitchen-many-spirits',
           'enter-the-kitohen-table', 'a10-layerdefensibilitymoatprotects-thegr', 'create-image'}
COLLN = {'character-building': 'Character Building Theme', 'icloud-screens': 'Studio Art & Screens'}
VIS = json.load(open('tools/player-cards/scripts/cartoon-chef-visuals.json'))
details = {}
for c in cards_doc['cards']:
    if c.get('entity_slug'): continue
    lines = ocr.get(c['file']) or []
    title = c.get('title') or os.path.splitext(os.path.basename(c['file']))[0].replace('-', ' ').title()
    role = None
    if c.get('title') and lines:
        try:
            i = max(i for i, l in enumerate(lines) if l.strip().lower() == c['title'].lower())
            nxt = [l for l in lines[i + 1:] if re.search(r'[A-Za-z]{3}', l) and l.strip() not in ('</>', '<>')]
            role = nxt[0].strip() if nxt and len(nxt[0]) < 40 and len(nxt[0].split()) <= 4 and not nxt[0].strip().endswith('.') else None
        except ValueError: pass
    slug = kebab(c['collection'] + '-' + os.path.splitext(os.path.basename(c['file']))[0])
    cw = xwalk.get(title.lower())
    cslug = by_name.get(cw[0].lower()) if cw else None
    labs = labels(lines, title, role)
    ag = [a for a in AG if c['page'] in a['cards']]
    agt = ' '.join(a.get('role') or '' for a in ag)
    th = theme_of(' '.join([title, role or '', agt, ' '.join(labs)]), ents[cslug]['department'] if cslug else None)
    vis = VIS.get(os.path.splitext(os.path.basename(c['file']))[0]) if not c.get('title') else None
    if vis: title, th = vis[0], vis[1]
    dept = ents[cslug]['department'] if cslug and not empty(ents[cslug].get('department')) else T[th]['dept']
    d = {'title': title, 'theme': th, 'sources': {}}
    S = d['sources']
    if vis:
        d['visual'] = vis[2]; S['title'] = S['visual'] = 'authored: visual reading of the card art (tools/player-cards/scripts/cartoon-chef-visuals.json); no text is printed'
    if role: d['role'] = role; S['role'] = 'data/player-cards-ocr.json (subtitle printed under the name)'
    elif ag and ag[0].get('role'): d['role'] = ag[0]['role']; S['role'] = 'data/agents.json'
    else: d['role'] = ROLE[th]; S['role'] = f'{AUTH} (brigade station for theme "{th}")'
    if cslug:
        d['character'] = {'name': ents[cslug]['name'], 'slug': cslug, 'status': cw[1]}; S['character'] = XW
    else:
        d['character'] = None; S['character'] = 'data/player-cards.json + canon crosswalk (no registry match; card-only design)'
    d['department'] = dept; S['department'] = f'{XW} → data/characters/{cslug}.json' if cslug else f'{AUTH} (theme "{th}")'
    if dept in missions: d['department_mission'] = missions[dept][0]; S['department_mission'] = missions[dept][1]
    stv, pr = stars_of(lines), rarity_of(lines)
    d['printed_rarity'] = pr or 'Not printed on the card'; S['printed_rarity'] = 'data/player-cards-ocr.json'
    d['printed_stars'] = stv or 'Not printed on the card'; S['printed_stars'] = 'data/player-cards-ocr.json'
    d['rarity'] = pr or STAR_RAR.get(stv or 0, 'Common'); S['rarity'] = 'data/player-cards-ocr.json' if pr else f'{AUTH} (from printed stars {stv})' if stv else f'{AUTH} (default tier)'
    st, basis = stats_for(slug, stv, meters(lines), th)
    d['stats'] = st; S['stats'] = f'{AUTH} (6-axis roster scale; ' + ('printed meters mapped: ' + ', '.join(basis) if basis else f'baseline from stars + theme "{th}"') + ')'
    fake = {'slug': slug, 'name': title, 'role': d['role']}
    ab, S['abilities'] = abilities_for(fake, th, labs); d['abilities'] = ab
    sent = sentences(lines)
    if sent: d['lore'] = ' '.join(sent[:2]); S['lore'] = 'data/player-cards-ocr.json (text printed on the card)'
    else:
        d['lore'] = lore_for(fake, th, labs, dept, cw[0] if cw else None)
        if vis: d['lore'] = f"Drawn as a {vis[2]}. " + d['lore']
        S['lore'] = f'{AUTH} (derived from ' + ('the card art' if vis else 'printed card text/role') + ')'
    d['signature_phrase'] = phrase_for(fake, th, labs); S['signature_phrase'] = f'{AUTH} (derived from printed card text/role)'
    t = T[th]
    d['workflow'] = {'summary': f"{title} {t['verb']}.", 'inputs': t['inputs'], 'outputs': t['outputs'], 'proof_gate': t['gate']}; S['workflow'] = f'{AUTH} (theme "{th}")'
    d['problem'] = t['problem']; S['problem'] = f'{AUTH} (theme "{th}")'
    d['actions'] = actions_for({'slug': kebab(title)}, th, dept); S['actions'] = f'authored: follows {CONV}'
    if ag: d['agents'] = [{'name': a['name'], 'slug': a['slug']} for a in ag]; S['agents'] = 'data/agents.json'
    else: d['agents'] = [{'name': AGS[s]['name'], 'slug': s} for s in t['agents'] if s in AGS]; S['agents'] = f'{AUTH} (closest agents for theme "{th}")'
    pe = [p for p in PE if c['page'] in p['cards']]
    if pe: d['repo_pets'] = [{'name': p['name'], 'slug': p['slug']} for p in pe]; S['repo_pets'] = 'data/repo-pets.json'
    else: d['repo_pets'] = [{'name': PES[s]['name'], 'slug': s} for s in t['pets'] if s in PES]; S['repo_pets'] = f'{AUTH} (closest repo pets for theme "{th}")'
    rel = ([{'name': ents[cslug]['name'], 'slug': cslug}] if cslug else []) + [{'name': ents[s]['name'], 'slug': s} for s in sorted([s for s, x in ents.items() if x['theme'] == th and x['kind'] in ('card_character', 'registry_character')], key=lambda s: h(slug + s, 997))[:5] if s != cslug]
    d['related'] = rel[:6]; S['related'] = (f'{XW} + ' if cslug else '') + f'{AUTH} (same theme "{th}")'
    d['implementation'] = {'status': 'designed_not_implemented', 'handler': camel(title), 'command': d['actions'][0]['command'],
                           'contract': f"inputs: {', '.join(t['inputs'])} → outputs: {', '.join(t['outputs'])}; refuses to emit 'ready' unless the proof gate passes"}
    S['implementation'] = 'no dedicated code for this card; authored: proposed handler spec'
    named = []
    joined = ' '.join(lines).lower().replace('-', ' ')
    for es, x in ents.items():
        if len(x['name']) > 4 and x['name'].lower().replace('-', ' ') in joined and es != cslug: named.append({'name': x['name'], 'slug': es})
    if named:
        d['related'] = (d['related'][:1] if cslug else []) + named[:8]; S['related'] = 'data/player-cards-ocr.json (characters named on the card)'
    if os.path.splitext(os.path.basename(c['file']))[0] in POSTERS:
        topics = [x.title() for x in labs[:8]] or ['Brand / universe artwork']
        d.update(kind='poster', role='Poster / reference sheet', department='All kitchens (universe-level reference)', department_mission=None,
                 rarity='Not applicable (reference artwork)', stats=None, abilities=topics,
                 signature_phrase=next((x for x in sentences(lines) if len(x) < 90), 'Everything in its place, for every repo.'),
                 workflow={'summary': f"Reference sheet for the MiseOS universe: shows {', '.join(topics[:4])}. Used as visual canon when designing or checking characters, stations and brand assets.",
                           'inputs': ['n/a (static artwork)'], 'outputs': ['visual canon reference for character and brand work'],
                           'proof_gate': 'Canon check: any name, colour, tier or role read off this sheet is cross-checked against data/characters/*.json before reuse.'},
                 problem='Keeps designers and agents working from one shared picture of the universe instead of drifting copies.',
                 actions=[{'command': 'none', 'does': 'reference artwork, not a runnable character', 'source': f'{AUTH} (poster / sheet)'}],
                 implementation={'status': 'reference_artwork', 'note': 'Static artwork; no handler or command applies.'})
        if not ag:
            d['agents'] = [{'name': AGS['orchestra-core']['name'], 'slug': 'orchestra-core'}]; S['agents'] = f'{AUTH} (universe-level sheet → Orchestra Core)'
        if not pe:
            d['repo_pets'] = [{'name': PES['orchestra-core']['name'], 'slug': 'orchestra-core'}]; S['repo_pets'] = f'{AUTH} (universe-level sheet → Orchestra Core)'
        if not sent: d['lore'] = f"Universe reference sheet from the {COLLN.get(c['collection'], c['collection'])} set showing {', '.join(topics[:4])}."
        for k in ('role', 'department', 'rarity', 'stats', 'abilities', 'workflow', 'problem', 'actions', 'implementation'):
            S[k] = f'{AUTH} (poster / reference sheet; topics from printed text)' if k != 'abilities' or not labs else 'data/player-cards-ocr.json (topics printed on the sheet)'
        S['signature_phrase'] = 'data/player-cards-ocr.json (tagline printed on the sheet)' if sentences(lines) else f'{AUTH} (MiseOS tagline)'
        S.pop('department_mission', None)
    for k, v in S.items(): stats['authored' if v.startswith('authored') else 'repo'] += 1
    details[c['file']] = d
json.dump({'schema': 'miseos.card-details.v1', 'generated_by': 'tools/player-cards/scripts/enrich-characters.py', 'count': len(details), 'cards': details},
          open('data/card-details.json', 'w'), indent=1, ensure_ascii=False)
open('data/card-details.json', 'a').write('\n')
print(json.dumps({'characters': len(ents), 'unmatched_cards': len(details), 'fields_filled_from_repo': stats['repo'], 'fields_authored': stats['authored']}))

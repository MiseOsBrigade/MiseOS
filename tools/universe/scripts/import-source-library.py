#!/usr/bin/env python3
"""Copy every remaining MiseOS source file into docs/source-library/<original path> and
write data/source-files.json mapping each original file to its repo path or exclusion reason."""
import hashlib, json, os, re, shutil, sys, zipfile, tarfile
SRC = os.environ.get('MISEOS_SOURCES', '/workspace/miseos')
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..')); os.chdir(ROOT)
LIB = 'docs/source-library'; MAX = 95 * 1024 * 1024
def sha(p):
    h = hashlib.sha256()
    with open(p, 'rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''): h.update(b)
    return h.hexdigest()
def orig(p):
    r = os.path.relpath(p, SRC)
    while r.startswith('unpacked/'): r = r[len('unpacked/'):]
    return r
ARCH = re.compile(r'\.(zip|tar\.gz|tgz|tar)$', re.I)
SECRET_NAME = re.compile(r'(^\.env(\..*)?$|\.pem$|\.key$|\.p12$|\.pfx$|^id_(rsa|ed25519|ecdsa)|\.keystore$|^credentials(\.json)?$)', re.I)
SECRET_TXT = re.compile(rb'(AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{30,}|sk-[A-Za-z0-9]{32,}|sk_live_[A-Za-z0-9]{16,}|xox[bpas]-[A-Za-z0-9-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|AIza[0-9A-Za-z_-]{35}|(?i:(?:api[_-]?key|secret|password|token)\s*[:=]\s*[\'"][A-Za-z0-9_\-]{20,}[\'"]))')
RENAME = {'.gitignore': 'dot-gitignore', '.gitattributes': 'dot-gitattributes', '.gitmodules': 'dot-gitmodules'}

import subprocess
repo = {}  # only git-tracked files outside the source library count as existing copies
for p in subprocess.run(['git', 'ls-files', '-z'], capture_output=True, text=True).stdout.split('\0'):
    if p and not p.startswith(LIB + '/') and os.path.isfile(p) and not os.path.islink(p): repo.setdefault(sha(p), p)
if os.path.isdir(LIB): shutil.rmtree(LIB)
unpack_ok = set(json.load(open('/tmp/unpack_ok.json'))) if os.path.exists('/tmp/unpack_ok.json') else None
files = []
for base, rank in (('icloud', 0), ('unpacked/icloud', 1), ('extract', 2), ('unpacked/extract', 3), ('unpacked/unpacked', 4)):
    for dp, ds, fs in os.walk(os.path.join(SRC, base)):
        if base == 'unpacked/icloud' and False: pass
        for f in fs:
            p = os.path.join(dp, f)
            if not os.path.islink(p): files.append((rank, p))
seen = {}; out = []; added = 0; added_bytes = 0
for rank, p in sorted(files):
    o = orig(p); b = os.path.basename(p); size = os.path.getsize(p)
    rec = {'original': o, 'bytes': size}
    if '/.git/' in '/' + o + '/' and not o.endswith('.git'):
        rec.update(status='excluded', reason='nested .git metadata of an unpacked repository (version-control internals, not a source file)')
    elif SECRET_NAME.search(b):
        rec.update(status='excluded', reason='secret/credential/.env-type file (excluded by policy, including .env templates and key files)')
    elif ARCH.search(b) and any(os.path.isdir(os.path.join(SRC, 'unpacked' + '/unpacked' * k, o)) and os.listdir(os.path.join(SRC, 'unpacked' + '/unpacked' * k, o)) for k in range(4)):
        rec.update(status='excluded', reason='archive; its contents were unpacked and are listed individually', unpacked_to=f'{LIB}/{o}/')
    elif size > MAX:
        rec.update(status='excluded', reason='larger than 95 MB (GitHub hard limit is 100 MB; Git LFS not used)')
    else:
        h = sha(p); rec['sha256'] = h
        if h in repo:
            rec.update(status='duplicate', reason='exact duplicate of a file already in the repository', repo_path=repo[h])
        else:
            txt_scan = size < 5_000_000 and not re.search(r'\.(png|jpe?g|gif|webp|mp4|mp3|pdf|glb|usdz|wav|mov|ttf|woff2?|ico)$', b, re.I)
            if txt_scan and SECRET_TXT.search(open(p, 'rb').read()):
                rec.update(status='excluded', reason='content matches a secret/token pattern')
            else:
                parts = o.split('/'); parts[-1] = RENAME.get(parts[-1], parts[-1])
                dst = f'{LIB}/' + '/'.join(parts)
                if ARCH.search(b): dst += '.unreadable-archive'  # could not be unpacked; keep the bytes without colliding with folders
                os.makedirs(os.path.dirname(dst), exist_ok=True); shutil.copyfile(p, dst)
                repo[h] = dst; rec.update(status='added', repo_path=dst); added += 1; added_bytes += size
    out.append(rec)
out.append({'original': 'icloud/Mise-Million #1/Archive.zip', 'bytes': 6440000000, 'status': 'excluded',
            'reason': 'zip of the other individual files (owner confirmed); duplicates files already listed, so it was not downloaded'})
from collections import Counter
summary = {'files': len(out), 'added': added, 'added_bytes': added_bytes,
           'by_status': dict(Counter(r['status'] for r in out)), 'excluded_by_reason': dict(Counter(r['reason'] for r in out if r['status'] == 'excluded'))}
with open('data/source-files.json', 'w', encoding='utf-8') as f:
    json.dump({'schema': 'miseos.source-files.v1', 'source_roots': ['icloud (iCloud download)', 'extract (pre-extracted)', 'unpacked archives'],
               'summary': summary, 'files': out}, f, indent=1, ensure_ascii=False); f.write('\n')
print(json.dumps(summary, indent=1))

import json, sys
p=sys.argv[1] if len(sys.argv)>1 else 'data/miseos-ecosystem-135.json'
d=json.load(open(p))
chars=d.get('characters',[]); regs=d.get('registry_manifests',d.get('registry',[]))
assert len(chars)==112, len(chars)
assert len(regs)==23, len(regs)
ids=[x.get('id') or x.get('registry_id') for x in chars+regs]
assert len(ids)==len(set(ids))==135
print({'characters':len(chars),'registry_manifests':len(regs),'total':len(ids),'unique_ids':True})

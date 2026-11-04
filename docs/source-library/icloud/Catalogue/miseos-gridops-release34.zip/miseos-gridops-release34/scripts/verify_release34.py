
import sys
sys.path.insert(0,'apps/api')
from app.intelligence import hash_embedding,cosine,sha
v=hash_embedding('incident recovery workflow');assert len(v)==96;assert abs(cosine(v,v)-1)<1e-6
assert sha({'b':2,'a':1})==sha({'a':1,'b':2})
print('release34 deterministic intelligence checks: passed')

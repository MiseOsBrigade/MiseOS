
import sys
sys.path.insert(0,'apps/api')
from app.intelligence import hash_embedding,cosine,sha

def test_embedding_is_deterministic(): assert hash_embedding('Kitchen workflow')==hash_embedding('Kitchen workflow')
def test_similarity_identity():
 v=hash_embedding('operations incident recovery');assert cosine(v,v)>0.999999
def test_canonical_hash_order_independent(): assert sha({'z':1,'a':2})==sha({'a':2,'z':1})

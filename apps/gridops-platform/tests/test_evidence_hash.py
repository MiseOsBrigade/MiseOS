from apps.api.app.services import evidence_hash

def test_hash_is_deterministic():
    assert evidence_hash({'b':2,'a':1}) == evidence_hash({'a':1,'b':2})

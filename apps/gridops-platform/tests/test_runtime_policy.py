import sys
sys.path.insert(0, 'apps/api')
from app.runtime import PolicyEngine

def test_agent_cannot_self_promote():
    d=PolicyEngine().evaluate(requested_tier=4, actor_max_tier=2, evidence=set(), action='deploy.production')
    assert not d.allowed

def test_production_requires_proof():
    d=PolicyEngine().evaluate(requested_tier=4, actor_max_tier=4, evidence={'simulation_report'}, action='deploy.production')
    assert not d.allowed

def test_safe_tier_allowed():
    d=PolicyEngine().evaluate(requested_tier=2, actor_max_tier=2, evidence=set(), action='repository.inspect')
    assert d.allowed and not d.approval_required

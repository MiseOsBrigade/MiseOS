import json, sys
from pathlib import Path
ROOT = Path(__file__).parents[1]
sys.path.insert(0, str(ROOT / "apps" / "api"))
from app.execution import DeterministicExecutor, default_actions
from app.safe_execution import simulate, evaluate_policies

workflow = json.loads((ROOT / "workflows" / "operations.service-recovery.v1.json").read_text())
inputs = {"severity":"high","repository":"MiseOsBrigade/MiseOS","summary":"Demo alert","files":["apps/api/app/main.py"]}
simulation = simulate(workflow, inputs, 0)
policy = evaluate_policies(simulation, inputs)
transcript = DeterministicExecutor(default_actions()).run(workflow, inputs)
print(json.dumps({"simulation":simulation,"policy":policy,"execution":transcript}, indent=2, sort_keys=True))

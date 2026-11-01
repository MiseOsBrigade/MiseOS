import os, yaml
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'apps', 'api'))
from app.models import Base, Workflow
DB=os.getenv('DATABASE_URL','postgresql+psycopg://miseos:miseos@localhost:5432/miseos')
path=os.getenv('WORKFLOW_PATH','workflows/operations.service-recovery.v1.yaml')
data=yaml.safe_load(open(path))
engine=create_engine(DB); Base.metadata.create_all(engine)
with Session(engine) as db:
 m=data['metadata']; row=Workflow(id=m['id'],version=m['version'],name=m['id'],department=m.get('department'),definition=data)
 db.merge(row); db.commit(); print(f"loaded {m['id']}@{m['version']}")

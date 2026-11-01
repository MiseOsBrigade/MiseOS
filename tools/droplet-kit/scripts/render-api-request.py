#!/usr/bin/env python3
import argparse, json
from pathlib import Path
p=argparse.ArgumentParser(); p.add_argument('--ssh-key',required=True); p.add_argument('--name',default='miseos-core-01'); p.add_argument('--region',default='sfo3'); p.add_argument('--size',default='s-4vcpu-8gb'); p.add_argument('--image',default='ubuntu-24-04-x64'); a=p.parse_args()
cloud=Path(__file__).resolve().parents[1]/'cloud-init'/'miseos-core.yaml'
print(json.dumps({'name':a.name,'region':a.region,'size':a.size,'image':a.image,'ssh_keys':[a.ssh_key],'monitoring':True,'ipv6':True,'tags':['miseos','mise-core','production'],'user_data':cloud.read_text()},indent=2))

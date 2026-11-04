#!/usr/bin/env python3
"""Upload MiseOS catalog assets to DigitalOcean Spaces.

Dry-run is the default. Set --apply only after environment variables are configured.
Required:
  SPACES_KEY
  SPACES_SECRET
  SPACES_REGION
  SPACES_BUCKET
Optional:
  SPACES_ENDPOINT (defaults to https://{region}.digitaloceanspaces.com)
  SPACES_CDN_BASE (public base URL, e.g. https://cdn.miseos.dev)
"""
from pathlib import Path
import argparse, mimetypes, os, sys
try:
    import boto3
except ImportError:
    raise SystemExit("Install boto3: python -m pip install boto3")

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument("--apply", action="store_true")
parser.add_argument("--prefix", default="miseos/v1")
args = parser.parse_args()

region=os.environ.get("SPACES_REGION","")
bucket=os.environ.get("SPACES_BUCKET","")
endpoint=os.environ.get("SPACES_ENDPOINT") or (f"https://{region}.digitaloceanspaces.com" if region else "")
required=["SPACES_KEY","SPACES_SECRET","SPACES_REGION","SPACES_BUCKET"]
missing=[x for x in required if not os.environ.get(x)]
if args.apply and missing:
    raise SystemExit("Missing environment variables: "+", ".join(missing))

files=[]
for relroot in ["metadata","assets/images","assets/reference","assets/thumbnails","media","catalog","taxonomy","registry"]:
    for p in (ROOT/relroot).rglob("*"):
        if p.is_file() and not p.name.endswith(".slot.json"):
            files.append(p)

for p in files:
    key=f"{args.prefix}/{p.relative_to(ROOT).as_posix()}"
    ctype=mimetypes.guess_type(p.name)[0] or "application/octet-stream"
    print(("UPLOAD" if args.apply else "DRY-RUN"), p.relative_to(ROOT), "->", key, ctype)

if not args.apply:
    print(f"Dry-run complete: {len(files)} files. Re-run with --apply to upload.")
    sys.exit(0)

client=boto3.client("s3", region_name=region, endpoint_url=endpoint,
    aws_access_key_id=os.environ["SPACES_KEY"], aws_secret_access_key=os.environ["SPACES_SECRET"])
for p in files:
    key=f"{args.prefix}/{p.relative_to(ROOT).as_posix()}"
    ctype=mimetypes.guess_type(p.name)[0] or "application/octet-stream"
    client.upload_file(str(p), bucket, key, ExtraArgs={"ACL":"public-read","ContentType":ctype,"CacheControl":"public,max-age=31536000,immutable"})
print(f"Uploaded {len(files)} files to s3://{bucket}/{args.prefix}/")

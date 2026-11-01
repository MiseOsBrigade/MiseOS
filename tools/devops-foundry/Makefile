.PHONY: validate catalog polyrepo-example

validate:
	python3 scripts/validate_bundle.py
	node --check actions/repo-health/dist/index.js
	node --check actions/release-sentinel/dist/index.js

catalog:
	python3 scripts/harvest_miseos_devops.py ../miseos_harvest/extracted --out catalog

polyrepo-example:
	python3 scripts/validate_polyrepo_manifest.py templates/polyrepo/release.yaml

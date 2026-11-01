# GHCR Runner First

The first external artifact should be:

```text
ghcr.io/mise-os/miseos-runner
```

## Why this publishes first

The runner is the trusted execution kitchen. Once the runner exists, every later package can be validated, built, scanned, and published from a consistent environment.

## First publish command path

```bash
# local smoke test
docker build -t miseos-runner:local containers/runner

docker run --rm miseos-runner:local doctor

# GHCR login
echo "$GITHUB_TOKEN" | docker login ghcr.io -u USERNAME --password-stdin

# tag and push
docker tag miseos-runner:local ghcr.io/mise-os/miseos-runner:0.1.0
docker tag miseos-runner:local ghcr.io/mise-os/miseos-runner:latest
docker push ghcr.io/mise-os/miseos-runner:0.1.0
docker push ghcr.io/mise-os/miseos-runner:latest
```

## Required package settings after first push

- Link package to `Mise-OS/miseos-bootstrap-registry`
- Set visibility deliberately
- Grant Actions access to the repository
- Keep write access limited to release workflows and maintainers

## Then publish

1. `@mise-os/cli`
2. `@mise-os/policy-engine`
3. `@mise-os/release-sentinel`

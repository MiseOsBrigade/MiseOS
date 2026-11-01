FROM node:20-bookworm-slim

LABEL org.opencontainers.image.title="MiseOS Runner"
LABEL org.opencontainers.image.description="Stable runtime image for MiseOS validation, policy checks, docs generation, and agent workflows."
LABEL org.opencontainers.image.source="https://github.com/mise-os/miseos-bootstrap-registry"

WORKDIR /workspace

RUN corepack enable \
  && apt-get update \
  && apt-get install -y --no-install-recommends git ca-certificates curl jq \
  && rm -rf /var/lib/apt/lists/*

COPY entrypoint.sh /usr/local/bin/miseos-runner
RUN chmod +x /usr/local/bin/miseos-runner

ENTRYPOINT ["miseos-runner"]
CMD ["doctor"]

FROM node:20-bookworm-slim
LABEL org.opencontainers.image.title="MiseOS Runner"
LABEL org.opencontainers.image.description="Runtime image for MiseOS registry validation, analytics, and agent workflows."
LABEL org.opencontainers.image.source="https://github.com/Mise-OS/miseos-bootstrap-registry"
WORKDIR /workspace
COPY entrypoint.sh /usr/local/bin/miseos-runner
RUN chmod +x /usr/local/bin/miseos-runner
ENTRYPOINT ["miseos-runner"]

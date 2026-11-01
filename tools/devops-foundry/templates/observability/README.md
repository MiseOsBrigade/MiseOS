# Observability templates

`otel-collector-logfire.yaml` is an OpenTelemetry Collector configuration harvested from the MiseOS project. It was originally stored under `.github/workflows/`, where GitHub would interpret it as an Actions workflow and reject it. This bundle relocates it to an observability-specific directory without changing its secret handling: the Logfire bearer token is read from `LOGFIRE_TOKEN`.

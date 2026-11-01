# MiseOS FileOps Sentinel

MiseOS FileOps Sentinel is the first package station for the MiseOS repo-manager: a trust-native file console for preparing files, validating policy, routing providers, building chat-with-files payloads, and preserving evidence.

## Stations

```txt
Prepare      files, URLs, file IDs, repo artifacts
Cook         MIME, TTL, size, secret-policy validation
Orchestrate  xAI, Collections, Fal, Catalyst routing
Deploy       chat, repo-manager tasks, function tools
Observe      registry, events, citations, cleanup, audit logs
```

## Scripts

```bash
npm run verify
npm run build
npm run start
```

## Pydantic Logfire observability

The executable HTTP service is instrumented with the first-party `@pydantic/logfire-node` SDK. Telemetry is emitted under service name `miseos-fileops` to the Logfire project `miseos/mise-os`.

Copy the example environment file and provide a project write token only in your shell, deployment platform, or secret manager:

```bash
cp packages/miseos-fileops/.env.example packages/miseos-fileops/.env
export LOGFIRE_TOKEN="<miseos-mise-os-write-token>"
export LOGFIRE_BASE_URL="https://logfire-us.pydantic.dev"
```

For local CLI authentication against the US Logfire instance:

```bash
npx logfire --base-url="https://logfire-us.pydantic.dev" auth
npx logfire --base-url="https://logfire-us.pydantic.dev" projects use --org "miseos" "mise-os"
```

Build and run the service, then trigger a representative request:

```bash
npm run fileops:build
LOGFIRE_TOKEN="$LOGFIRE_TOKEN" npm run fileops:start
curl http://localhost:8787/
```

In Logfire Live view, filter for:

```txt
service.name = 'miseos-fileops'
```

Representative records include `fileops.http.request`, `fileops response served`, and `miseos-fileops server started`.

Telemetry remains non-blocking when credentials are absent: the SDK uses `sendToLogfire: "if-token-present"`. Query strings, request bodies, headers, cookies, and raw error messages are not added to manual telemetry.

Deployment and CI must store the write token in a secret named `LOGFIRE_TOKEN`. Never commit it.

Logfire MCP endpoint:

```txt
https://logfire-us.pydantic.dev/mcp
```

## Console

Open the static proof at:

```txt
apps/fileops-console/index.html
```

## Observability

The console server (`npm run start`) is instrumented with [Pydantic Logfire](https://pydantic.dev/docs/logfire/get-started/)
via `@pydantic/logfire-node`. Configuration lives in `src/instrumentation.ts` and is
preloaded with `node --import` before the HTTP server module, so the OpenTelemetry
HTTP auto-instrumentation is active for every request. Telemetry is sent to
`https://logfire-us.pydantic.dev` (project `miseos/mise-os`).

- **Local development:** run `npx logfire --base-url='https://logfire-us.pydantic.dev' auth`
  followed by `npx logfire --base-url='https://logfire-us.pydantic.dev' projects use --org 'miseos' 'mise-os'`,
  or set `LOGFIRE_TOKEN` (see `.env.example`). Without either, the server still starts
  and runs normally — it just doesn't export data.
- **CI/production:** set the `LOGFIRE_TOKEN` secret.
- **Verify data is flowing:** start the server, request `http://localhost:8787`, and
  search the Logfire Live view for `service_name = 'miseos-fileops'`.

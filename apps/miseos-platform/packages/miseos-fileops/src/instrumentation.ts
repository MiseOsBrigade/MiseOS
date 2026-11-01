import * as logfire from "@pydantic/logfire-node";

logfire.configure({
  serviceName: "miseos-fileops",
  serviceVersion: process.env.npm_package_version,
  advanced: { baseUrl: "https://logfire-us.pydantic.dev" }
});

for (const signal of ["SIGTERM", "SIGINT"] as const) {
  process.once(signal, () => {
    logfire.shutdown().finally(() => process.exit(0));
  });
}

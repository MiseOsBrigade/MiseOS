import "../instrumentation.js";

import * as logfire from "@pydantic/logfire-node";
import http from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const port = Number(process.env.FILEOPS_PORT ?? 8787);
const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(__dirname, "../../../public/index.html");

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  await logfire.span("fileops.http.request", {
    attributes: {
      "http.request.method": req.method ?? "UNKNOWN",
      "url.path": requestUrl.pathname,
    },
    callback: async () => {
      try {
        const html = await readFile(htmlPath, "utf8");
        res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        res.end(html);
        logfire.info("fileops response served", { "http.response.status_code": 200 });
      } catch (error) {
        logfire.error("fileops request failed", {
          "error.type": error instanceof Error ? error.name : "UnknownError",
          "http.response.status_code": 500,
        });
        console.error("Failed to serve fileops console:", error);
        res.writeHead(500, { "content-type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: "Internal server error" }));
      }
    },
  });
});

server.listen(port, () => {
  logfire.info("miseos-fileops server started", { "server.port": port });
  console.log(`miseos-fileops console listening on http://localhost:${port}`);
});

import Fastify from "fastify";
import crypto from "node:crypto";
import OpenAI from "openai";
import { z } from "zod";
import { env } from "./config.js";
import { createAgentPullRequest } from "./github.js";

const app = Fastify({ logger: true });

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const AgentRunSchema = z.object({
  task: z.string().min(1),
  title: z.string().optional(),
  files: z
    .array(
      z.object({
        path: z.string().min(1),
        content: z.string(),
      })
    )
    .min(1),
});

function verifyInternalSecret(authHeader: string | undefined): void {
  const expected = `Bearer ${env.INTERNAL_API_SECRET}`;

  if (!authHeader || authHeader !== expected) {
    throw new Error("Unauthorized");
  }
}

function verifyGithubWebhookSignature(params: {
  rawBody: string;
  signature256: string | undefined;
}): boolean {
  if (!params.signature256) return false;

  const hmac = crypto.createHmac("sha256", env.GITHUB_WEBHOOK_SECRET);
  const digest = `sha256=${hmac.update(params.rawBody).digest("hex")}`;

  return crypto.timingSafeEqual(
    Buffer.from(digest),
    Buffer.from(params.signature256)
  );
}

app.get("/health", async () => {
  return {
    ok: true,
    service: "miseos-github-agent",
    mode: env.AGENT_MODE,
    dryRun: env.DRY_RUN,
  };
});

app.post("/agent/plan", async (request, reply) => {
  try {
    verifyInternalSecret(request.headers.authorization);

    const payload = z.object({ task: z.string().min(1) }).parse(request.body);

    const response = await openai.responses.create({
      model: env.OPENAI_MODEL_PRIMARY,
      input: [
        {
          role: "system",
          content:
            "You are a careful GitHub repo steward. Produce a concise implementation plan with files, risks, and review notes.",
        },
        {
          role: "user",
          content: payload.task,
        },
      ],
    });

    return {
      ok: true,
      plan: response.output_text,
    };
  } catch (error: unknown) {
    request.log.error(error);
    return reply.status(400).send({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.post("/agent/run", async (request, reply) => {
  try {
    verifyInternalSecret(request.headers.authorization);

    const payload = AgentRunSchema.parse(request.body);

    const result = await createAgentPullRequest({
      task: payload.task,
      title: payload.title,
      files: payload.files,
    });

    return {
      ok: true,
      result,
    };
  } catch (error: unknown) {
    request.log.error(error);

    return reply.status(400).send({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.post("/github/webhook", async (request, reply) => {
  const rawBody = JSON.stringify(request.body ?? {});
  const signature256 = request.headers["x-hub-signature-256"];

  const valid = verifyGithubWebhookSignature({
    rawBody,
    signature256: Array.isArray(signature256) ? signature256[0] : signature256,
  });

  if (!valid) {
    return reply.status(401).send({
      ok: false,
      error: "Invalid GitHub webhook signature.",
    });
  }

  const event = request.headers["x-github-event"];

  request.log.info({
    event,
    message: "Received GitHub webhook.",
  });

  return {
    ok: true,
    received: event,
  };
});

app.listen({ port: env.PORT, host: "0.0.0.0" });

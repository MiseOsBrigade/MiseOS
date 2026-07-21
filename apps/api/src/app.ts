import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { z } from 'zod';

const RunStatus = z.enum([
  'queued',
  'running',
  'waiting_for_approval',
  'succeeded',
  'failed',
  'blocked',
  'cancelled',
]);

const CreateRunBody = z.object({
  workflowId: z.string().min(1),
  workflowVersion: z.string().min(1),
  repository: z.object({ owner: z.string().min(1), name: z.string().min(1) }),
  triggerType: z.string().min(1),
  idempotencyKey: z.string().min(8),
  payload: z.record(z.unknown()).default({}),
});

export type WorkflowRun = {
  id: string;
  workflowId: string;
  workflowVersion: string;
  repository: { owner: string; name: string };
  triggerType: string;
  idempotencyKey: string;
  payload: Record<string, unknown>;
  status: z.infer<typeof RunStatus>;
  createdAt: string;
};

export async function buildApp() {
  const app = Fastify({ logger: true, bodyLimit: 1024 * 1024 });
  await app.register(helmet);
  await app.register(cors, { origin: false });
  await app.register(rateLimit, { max: 120, timeWindow: '1 minute' });

  const runs = new Map<string, WorkflowRun>();
  const idempotencyIndex = new Map<string, string>();

  app.get('/health', async () => ({
    ok: true,
    service: 'miseos-api',
    version: '0.1.0',
    product: 'Pull Request Guardian',
  }));

  app.get('/v1/registry/launch', async () => ({
    agents: [
      'miseos.agent.repo-steward',
      'miseos.agent.workflow-linter',
      'miseos.agent.policy-engine',
      'miseos.agent.sbom-indexer',
      'miseos.agent.release-sentinel',
    ],
    actions: [
      'miseos.action.repository-health-scan',
      'miseos.action.workflow-lint',
      'miseos.action.pull-request-policy',
      'miseos.action.sbom-index',
      'miseos.action.release-readiness',
    ],
    workflows: ['miseos.workflow.pull-request-guardian'],
  }));

  app.post('/v1/workflow-runs', async (request, reply) => {
    const parsed = CreateRunBody.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ ok: false, error: 'invalid_request', issues: parsed.error.issues });
    }

    const existingId = idempotencyIndex.get(parsed.data.idempotencyKey);
    if (existingId) {
      return reply.code(200).send({ ok: true, reused: true, run: runs.get(existingId) });
    }

    const run: WorkflowRun = {
      id: crypto.randomUUID(),
      ...parsed.data,
      status: 'queued',
      createdAt: new Date().toISOString(),
    };

    runs.set(run.id, run);
    idempotencyIndex.set(run.idempotencyKey, run.id);
    return reply.code(202).send({ ok: true, reused: false, run });
  });

  app.get<{ Params: { id: string } }>('/v1/workflow-runs/:id', async (request, reply) => {
    const run = runs.get(request.params.id);
    if (!run) return reply.code(404).send({ ok: false, error: 'workflow_run_not_found' });
    return { ok: true, run };
  });

  app.post<{ Params: { id: string }; Body: { status?: string } }>(
    '/v1/workflow-runs/:id/status',
    async (request, reply) => {
      const run = runs.get(request.params.id);
      if (!run) return reply.code(404).send({ ok: false, error: 'workflow_run_not_found' });

      const parsed = RunStatus.safeParse(request.body?.status);
      if (!parsed.success) return reply.code(400).send({ ok: false, error: 'invalid_status' });

      run.status = parsed.data;
      runs.set(run.id, run);
      return { ok: true, run };
    },
  );

  app.post('/v1/github/webhooks', async (request, reply) => {
    // Signature verification is intentionally required before production enablement.
    // This endpoint currently proves the integration boundary without accepting mutations.
    return reply.code(501).send({
      ok: false,
      error: 'github_webhook_verification_not_configured',
      receivedHeaders: {
        event: request.headers['x-github-event'] ?? null,
        delivery: request.headers['x-github-delivery'] ?? null,
      },
    });
  });

  return app;
}

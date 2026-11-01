import { Router } from 'express';
import { db } from '@workspace/db';
import {
  orchestrationJobsTable,
  agentInstancesTable,
  executionLogsTable,
  approvalRequestsTable,
} from '@workspace/db';
import { eq, desc, and } from 'drizzle-orm';
import { CHARACTERS } from '../data/characters';
import {
  ListJobsQueryParams,
  CreateJobBody,
  GetJobParams,
  ListJobLogsParams,
} from '@workspace/api-zod';

const router = Router();

const JOB_STATUSES = ['Queued', 'In_Progress', 'Completed', 'Failed'] as const;
const AGENT_STATES = ['Idle', 'Running', 'Waiting_Approval', 'Completed', 'Failed'] as const;

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

// GET /api/jobs
router.get('/jobs', async (req, res) => {
  try {
    const { status, limit } = ListJobsQueryParams.parse(req.query);

    const jobs = await db
      .select()
      .from(orchestrationJobsTable)
      .orderBy(desc(orchestrationJobsTable.startedAt))
      .limit(limit ?? 20);

    const filtered = status ? jobs.filter(j => j.status === status) : jobs;

    res.json(filtered.map(j => ({
      ...j,
      startedAt: j.startedAt.toISOString(),
      completedAt: j.completedAt?.toISOString() ?? null,
    })));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// POST /api/jobs
router.post('/jobs', async (req, res) => {
  try {
    const body = CreateJobBody.parse(req.body);

    const [job] = await db
      .insert(orchestrationJobsTable)
      .values({ triggerEvent: body.triggerEvent, status: 'In_Progress' })
      .returning();

    if (!job) {
      res.status(500).json({ error: 'Failed to create job' });
      return;
    }

    // Create agent instances for the requested characters
    for (const charId of body.characterIds) {
      const char = CHARACTERS.find(c => c.id === charId);
      if (!char) continue;
      await db.insert(agentInstancesTable).values({
        jobId: job.id,
        characterId: char.id,
        characterName: char.name,
        department: char.department,
        state: pickRandom(AGENT_STATES),
        tokenUsage: Math.floor(Math.random() * 4000),
      });

      // Emit a few logs
      const logLevels = ['INFO', 'INFO', 'WARN', 'DEBUG'] as const;
      const messages = [
        `${char.name} initialized for ${body.triggerEvent}`,
        `${char.name} processing context window`,
        `${char.name} invoking tool chain`,
      ];
      for (const msg of messages) {
        await db.insert(executionLogsTable).values({
          jobId: job.id,
          characterName: char.name,
          department: char.department,
          logLevel: pickRandom(logLevels),
          message: msg,
        });
      }
    }

    res.status(201).json({
      ...job,
      startedAt: job.startedAt.toISOString(),
      completedAt: job.completedAt?.toISOString() ?? null,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// GET /api/jobs/:id
router.get('/jobs/:id', async (req, res) => {
  try {
    const { id } = GetJobParams.parse({ id: parseInt(req.params.id, 10) });
    const [job] = await db
      .select()
      .from(orchestrationJobsTable)
      .where(eq(orchestrationJobsTable.id, id));

    if (!job) {
      res.status(404).json({ error: `Job ${id} not found` });
      return;
    }

    const agents = await db
      .select()
      .from(agentInstancesTable)
      .where(eq(agentInstancesTable.jobId, id));

    res.json({
      ...job,
      startedAt: job.startedAt.toISOString(),
      completedAt: job.completedAt?.toISOString() ?? null,
      agents: agents.map(a => ({
        ...a,
        tokenUsage: a.tokenUsage ?? 0,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// GET /api/jobs/:id/logs
router.get('/jobs/:id/logs', async (req, res) => {
  try {
    const { id } = ListJobLogsParams.parse({ id: parseInt(req.params.id, 10) });
    const logs = await db
      .select()
      .from(executionLogsTable)
      .where(eq(executionLogsTable.jobId, id))
      .orderBy(desc(executionLogsTable.timestamp))
      .limit(50);

    res.json(logs.map(l => ({
      ...l,
      timestamp: l.timestamp.toISOString(),
    })));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;

import { Router } from 'express';
import { db } from '@workspace/db';
import {
  orchestrationJobsTable,
  agentInstancesTable,
  executionLogsTable,
  approvalRequestsTable,
} from '@workspace/db';
import { SimulateWebhookBody } from '@workspace/api-zod';
import { CHARACTERS } from '../data/characters';

const router = Router();

// Map event types to relevant departments/characters
const EVENT_DEPT_MAP: Record<string, string[]> = {
  'pull_request.opened':          ['pipeline', 'platform'],
  'pipeline.test_failed':         ['pipeline', 'reliability'],
  'monitor.alert':                ['reliability', 'data'],
  'security.vulnerability_detected': ['security', 'pipeline'],
  'deployment.requested':         ['pipeline', 'platform'],
};

const AGENT_STATES = ['Running', 'Waiting_Approval', 'Completed'] as const;
function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

// POST /api/webhooks/simulate
router.post('/webhooks/simulate', async (req, res) => {
  try {
    const body = SimulateWebhookBody.parse(req.body);

    // Create the job
    const [job] = await db
      .insert(orchestrationJobsTable)
      .values({ triggerEvent: body.eventType, status: 'In_Progress' })
      .returning();

    if (!job) {
      res.status(500).json({ error: 'Failed to create job' });
      return;
    }

    // Select 3-5 relevant characters
    const depts = EVENT_DEPT_MAP[body.eventType] ?? ['pipeline'];
    const eligible = CHARACTERS.filter(c => depts.includes(c.department));
    const shuffled = eligible.sort(() => Math.random() - 0.5).slice(0, 4);
    const dispatchedAgents: string[] = [];

    for (const char of shuffled) {
      const state = pickRandom(AGENT_STATES);
      await db.insert(agentInstancesTable).values({
        jobId: job.id,
        characterId: char.id,
        characterName: char.name,
        department: char.department,
        state,
        tokenUsage: Math.floor(Math.random() * 5000),
      });
      dispatchedAgents.push(char.name);

      // Emit startup log
      await db.insert(executionLogsTable).values({
        jobId: job.id,
        characterName: char.name,
        department: char.department,
        logLevel: 'INFO',
        message: `${char.name} dispatched for ${body.eventType} from ${body.source}`,
        actionTaken: char.role,
      });

      // Possibly create an approval request for high-risk agents
      if (char.rarity === 'legendary' || char.rarity === 'genesis') {
        await db.insert(approvalRequestsTable).values({
          jobId: job.id,
          characterName: char.name,
          department: char.department,
          riskLevel: 'high',
          proposedAction: `${char.name} wants to execute: ${char.role}`,
          sqlPreview: char.role.toLowerCase().includes('deploy') || char.role.toLowerCase().includes('schema')
            ? `ALTER TABLE agents ADD COLUMN last_run_at TIMESTAMPTZ;`
            : null,
        });
      }
    }

    res.status(201).json({
      status: 'accepted',
      jobId: job.id,
      dispatchedAgents,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;

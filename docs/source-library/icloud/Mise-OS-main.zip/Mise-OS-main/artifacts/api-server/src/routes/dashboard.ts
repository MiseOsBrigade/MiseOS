import { Router } from 'express';
import { db } from '@workspace/db';
import { orchestrationJobsTable, executionLogsTable, approvalRequestsTable } from '@workspace/db';
import { eq, desc, count, and } from 'drizzle-orm';
import { CHARACTERS, DEPARTMENTS } from '../data/characters';

const router = Router();

// GET /api/dashboard/stats
router.get('/dashboard/stats', async (_req, res) => {
  try {
    const [activeJobsResult] = await db
      .select({ count: count() })
      .from(orchestrationJobsTable)
      .where(eq(orchestrationJobsTable.status, 'In_Progress'));

    const [completedJobsResult] = await db
      .select({ count: count() })
      .from(orchestrationJobsTable)
      .where(eq(orchestrationJobsTable.status, 'Completed'));

    const [pendingApprovalsResult] = await db
      .select({ count: count() })
      .from(approvalRequestsTable)
      .where(eq(approvalRequestsTable.status, 'pending'));

    const [totalLogsResult] = await db
      .select({ count: count() })
      .from(executionLogsTable);

    const departmentBreakdown = DEPARTMENTS.map(d => ({
      id: d.id,
      name: d.name,
      color: d.color,
      count: d.characters.length,
    }));

    const rarityBreakdown: Record<string, number> = {};
    for (const c of CHARACTERS) {
      rarityBreakdown[c.rarity] = (rarityBreakdown[c.rarity] ?? 0) + 1;
    }

    res.json({
      totalCharacters: CHARACTERS.length,
      totalDepartments: DEPARTMENTS.length,
      activeJobs: Number(activeJobsResult.count),
      completedJobs: Number(completedJobsResult.count),
      pendingApprovals: Number(pendingApprovalsResult.count),
      totalLogs: Number(totalLogsResult.count),
      departmentBreakdown,
      rarityBreakdown,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// GET /api/dashboard/activity — latest 20 logs across all jobs
router.get('/dashboard/activity', async (_req, res) => {
  try {
    const logs = await db
      .select()
      .from(executionLogsTable)
      .orderBy(desc(executionLogsTable.timestamp))
      .limit(20);

    res.json(logs.map(l => ({
      ...l,
      timestamp: l.timestamp.toISOString(),
    })));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;

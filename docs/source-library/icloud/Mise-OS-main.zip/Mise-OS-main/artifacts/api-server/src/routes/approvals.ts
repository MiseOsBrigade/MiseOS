import { Router } from 'express';
import { db } from '@workspace/db';
import { approvalRequestsTable } from '@workspace/db';
import { eq } from 'drizzle-orm';
import {
  ListApprovalsQueryParams,
  ResolveApprovalParams,
  ResolveApprovalBody,
} from '@workspace/api-zod';

const router = Router();

function serializeApproval(a: typeof approvalRequestsTable.$inferSelect) {
  return {
    ...a,
    createdAt: a.createdAt.toISOString(),
    resolvedAt: a.resolvedAt?.toISOString() ?? null,
  };
}

// GET /api/approvals
router.get('/approvals', async (req, res) => {
  try {
    const { status } = ListApprovalsQueryParams.parse(req.query);
    const all = await db.select().from(approvalRequestsTable);
    const filtered = status ? all.filter(a => a.status === status) : all;
    res.json(filtered.map(serializeApproval));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// PATCH /api/approvals/:id/resolve
router.patch('/approvals/:id/resolve', async (req, res) => {
  try {
    const { id } = ResolveApprovalParams.parse({ id: parseInt(req.params.id, 10) });
    const body = ResolveApprovalBody.parse(req.body);

    const [existing] = await db
      .select()
      .from(approvalRequestsTable)
      .where(eq(approvalRequestsTable.id, id));

    if (!existing) {
      res.status(404).json({ error: `Approval ${id} not found` });
      return;
    }

    const [updated] = await db
      .update(approvalRequestsTable)
      .set({
        status: body.decision,
        resolvedBy: body.resolvedBy ?? 'operator',
        resolvedAt: new Date(),
      })
      .where(eq(approvalRequestsTable.id, id))
      .returning();

    res.json(serializeApproval(updated!));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;

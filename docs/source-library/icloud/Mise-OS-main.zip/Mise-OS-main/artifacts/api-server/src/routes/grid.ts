import { Router } from 'express';
import {
  GRID_PROJECTS,
  GRID_TASKS,
  GRID_SOURCES,
  GRID_CLAIMS,
  GRID_TOOLS,
  computeGridSummary,
  type GridClaim,
  type GridVerification,
} from '../data/grid';

const router = Router();

const VERIFICATIONS: GridVerification[] = [
  'verified',
  'pending',
  'unsupported',
  'deprecated',
];

// Expose the operating rule to the client: a claim is "supported" only if it
// has a source, and only "verifiable" if it also carries a confidence signal.
function serializeClaim(c: GridClaim) {
  const isSupported = c.sourceId !== null;
  return {
    ...c,
    isSupported,
    isVerifiable: isSupported && c.confidence !== 'unknown',
  };
}

// GET /api/grid/summary
router.get('/grid/summary', (_req, res) => {
  res.json(computeGridSummary());
});

// GET /api/grid/projects
router.get('/grid/projects', (req, res) => {
  let results = [...GRID_PROJECTS];
  const { status, station, q } = req.query as Record<string, string | undefined>;

  if (status) results = results.filter(p => p.status === status.toLowerCase());
  if (station) results = results.filter(p => p.station === station.toLowerCase());
  if (q) {
    const query = q.toLowerCase();
    results = results.filter(
      p =>
        p.name.toLowerCase().includes(query) ||
        p.goal.toLowerCase().includes(query) ||
        p.owner.toLowerCase().includes(query),
    );
  }

  res.json(results);
});

// GET /api/grid/tasks
router.get('/grid/tasks', (req, res) => {
  let results = [...GRID_TASKS];
  const { projectId, status } = req.query as Record<string, string | undefined>;

  if (projectId) results = results.filter(t => t.projectId === projectId);
  if (status) results = results.filter(t => t.status === status.toLowerCase());

  res.json(results);
});

// GET /api/grid/sources
router.get('/grid/sources', (req, res) => {
  let results = [...GRID_SOURCES];
  const { type, reliability, q } = req.query as Record<string, string | undefined>;

  if (type) results = results.filter(s => s.type === type.toLowerCase());
  if (reliability) {
    results = results.filter(s => s.reliability === reliability.toLowerCase());
  }
  if (q) {
    const query = q.toLowerCase();
    results = results.filter(
      s =>
        s.title.toLowerCase().includes(query) ||
        s.summary.toLowerCase().includes(query) ||
        s.author.toLowerCase().includes(query),
    );
  }

  res.json(results);
});

// GET /api/grid/claims
router.get('/grid/claims', (req, res) => {
  let results = [...GRID_CLAIMS];
  const { verification, confidence, projectId, q } = req.query as Record<
    string,
    string | undefined
  >;

  if (verification) {
    results = results.filter(c => c.verification === verification.toLowerCase());
  }
  if (confidence) {
    results = results.filter(c => c.confidence === confidence.toLowerCase());
  }
  if (projectId) results = results.filter(c => c.projectId === projectId);
  if (q) {
    const query = q.toLowerCase();
    results = results.filter(c => c.statement.toLowerCase().includes(query));
  }

  res.json(results.map(serializeClaim));
});

// PATCH /api/grid/claims/:id — change a claim's verification state
router.patch('/grid/claims/:id', (req, res) => {
  const claim = GRID_CLAIMS.find(c => c.id === req.params.id);
  if (!claim) {
    res.status(404).json({ error: `Claim ${req.params.id} not found` });
    return;
  }

  const body = (req.body ?? {}) as {
    verification?: unknown;
    verifiedBy?: unknown;
    notes?: unknown;
  };

  const verification = body.verification;
  if (
    typeof verification !== 'string' ||
    !VERIFICATIONS.includes(verification as GridVerification)
  ) {
    res.status(400).json({
      error: `verification must be one of: ${VERIFICATIONS.join(', ')}`,
    });
    return;
  }

  // Operating rule: a claim cannot be verified without a backing source.
  if (verification === 'verified' && claim.sourceId === null) {
    res.status(400).json({
      error: 'Cannot verify a claim with no source. Attach a source first.',
    });
    return;
  }

  // Operating rule: a claim cannot be verified without a confidence signal.
  // (Keeps the server invariant in lockstep with the client's isVerifiable.)
  if (verification === 'verified' && claim.confidence === 'unknown') {
    res.status(400).json({
      error:
        'Cannot verify a claim with unknown confidence. Set a confidence signal first.',
    });
    return;
  }

  claim.verification = verification as GridVerification;

  if (verification === 'verified') {
    claim.lastVerified = new Date().toISOString().slice(0, 10);
    claim.verifiedBy =
      typeof body.verifiedBy === 'string' && body.verifiedBy.trim()
        ? body.verifiedBy.trim()
        : claim.verifiedBy ?? 'Operator';
  } else {
    // Leaving the verified state — drop the now-stale verification stamp so
    // the UI never shows "verified <date>" on an unverified claim.
    claim.lastVerified = null;
    claim.verifiedBy = null;
  }

  if (typeof body.notes === 'string') {
    claim.notes = body.notes;
  }

  res.json(serializeClaim(claim));
});

// GET /api/grid/tools
router.get('/grid/tools', (req, res) => {
  let results = [...GRID_TOOLS];
  const { category, q } = req.query as Record<string, string | undefined>;

  if (category) results = results.filter(t => t.category === category.toLowerCase());
  if (q) {
    const query = q.toLowerCase();
    results = results.filter(
      t =>
        t.name.toLowerCase().includes(query) ||
        t.useCase.toLowerCase().includes(query),
    );
  }

  res.json(results);
});

export default router;

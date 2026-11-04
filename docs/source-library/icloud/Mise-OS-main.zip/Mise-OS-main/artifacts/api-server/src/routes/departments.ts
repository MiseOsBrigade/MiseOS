import { Router } from 'express';
import { DEPARTMENTS } from '../data/characters';

const router = Router();

// GET /api/departments — all departments with their characters
router.get('/departments', (_req, res) => {
  res.json(DEPARTMENTS);
});

// GET /api/departments/:id — single department
router.get('/departments/:id', (req, res) => {
  const dept = DEPARTMENTS.find(d => d.id === req.params.id.toLowerCase());
  if (!dept) {
    res.status(404).json({
      error: `Department "${req.params.id}" not found`,
      valid: DEPARTMENTS.map(d => d.id),
    });
    return;
  }
  res.json(dept);
});

export default router;

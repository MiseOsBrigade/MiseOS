import { Router } from 'express';
import { CHARACTERS, DEPARTMENTS } from '../data/characters';

const router = Router();

// GET /api/stats — aggregate summary
router.get('/stats', (_req, res) => {
  const rarityCounts: Record<string, number> = {};
  for (const c of CHARACTERS) {
    rarityCounts[c.rarity] = (rarityCounts[c.rarity] ?? 0) + 1;
  }

  const deptCounts = DEPARTMENTS.map(d => ({
    id: d.id,
    name: d.name,
    count: d.characters.length,
    color: d.color,
  }));

  const genesisList = CHARACTERS.filter(c => c.rarity === 'genesis');

  res.json({
    totalCharacters: CHARACTERS.length,
    totalDepartments: DEPARTMENTS.length,
    rarityCounts,
    departmentCounts: deptCounts,
    genesis: {
      count: genesisList.length,
      characters: genesisList.map(c => ({ id: c.id, name: c.name, department: c.department })),
    },
    tagline: '5 DevOps Styles × 15 Roles = 75 Mise Spirits',
  });
});

export default router;

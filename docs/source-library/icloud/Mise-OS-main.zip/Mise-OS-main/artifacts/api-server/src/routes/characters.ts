import { Router } from 'express';
import { CHARACTERS } from '../data/characters';

const router = Router();

// GET /api/characters — full roster with optional filters
router.get('/characters', (req, res) => {
  let results = [...CHARACTERS];

  const { department, rarity, tag, q } = req.query as Record<string, string | undefined>;

  if (department) {
    results = results.filter(c => c.department === department.toLowerCase());
  }
  if (rarity) {
    results = results.filter(c => c.rarity === rarity.toLowerCase());
  }
  if (tag) {
    results = results.filter(c => c.tags.includes(tag.toLowerCase()));
  }
  if (q) {
    const query = q.toLowerCase();
    results = results.filter(
      c =>
        c.name.toLowerCase().includes(query) ||
        c.role.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query),
    );
  }

  res.json({
    total: results.length,
    characters: results,
  });
});

// GET /api/characters/:id — single character
router.get('/characters/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'id must be a number' });
    return;
  }
  const character = CHARACTERS.find(c => c.id === id);
  if (!character) {
    res.status(404).json({ error: `Character ${id} not found` });
    return;
  }
  res.json(character);
});

export default router;

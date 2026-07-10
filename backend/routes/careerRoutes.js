import express from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import Career from '../models/Career.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await Career.find({});
  res.json(items);
});

router.get('/:id', async (req, res) => {
  const item = await Career.findById(req.params.id);
  if (item) res.json(item);
  else res.status(404).json({ message: 'Career not found' });
});

router.post('/', protect, authorizeRoles('super_admin', 'admin'), async (req, res) => {
  const item = new Career(req.body);
  const created = await item.save();
  res.status(201).json(created);
});

router.put('/:id', protect, authorizeRoles('super_admin', 'admin'), async (req, res) => {
  const item = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (item) res.json(item);
  else res.status(404).json({ message: 'Career not found' });
});

router.delete('/:id', protect, authorizeRoles('super_admin', 'admin'), async (req, res) => {
  const item = await Career.findByIdAndDelete(req.params.id);
  if (item) res.json({ message: 'Career removed' });
  else res.status(404).json({ message: 'Career not found' });
});

export default router;

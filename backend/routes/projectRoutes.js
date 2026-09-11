import express from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import Project from '../models/Project.js';

const router = express.Router();

// Only project fields may be changed; legacy image aliases remain supported.
const projectPayload = (body) => {
  const payload = {};
  if (body.title !== undefined || body.name !== undefined) {
    payload.title = body.title ?? body.name;
  }
  if (body.category !== undefined) payload.category = body.category;
  if (body.status !== undefined) payload.status = body.status;
  if (body.images !== undefined) payload.images = body.images;
  else if (body.imageUrls !== undefined) payload.images = body.imageUrls;
  else if (body.imageUrl !== undefined) payload.images = body.imageUrl ? [body.imageUrl] : [];
  return payload;
};

const handleError = (res, error) => {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ message: error.message });
  }
  console.error('Project API error:', error);
  return res.status(500).json({ message: 'Unable to process project request' });
};

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    if (status !== undefined && !['draft', 'published'].includes(status)) {
      return res.status(400).json({ message: 'Invalid project status' });
    }
    // Admin requests omit status to include drafts and older records.
    const items = await Project.find(status ? { status } : {});
    res.json(items);
  } catch (error) {
    handleError(res, error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Project.findById(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: 'Project not found' });
  } catch (error) {
    handleError(res, error);
  }
});

router.post('/', protect, authorizeRoles('super_admin', 'admin'), async (req, res) => {
  try {
    const created = await Project.create(projectPayload(req.body));
    res.status(201).json(created);
  } catch (error) {
    handleError(res, error);
  }
});

router.put('/:id', protect, authorizeRoles('super_admin', 'admin'), async (req, res) => {
  try {
    const item = await Project.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Project not found' });
    item.set(projectPayload(req.body));
    // Saving validates title, category, and status on updates as well as creates.
    await item.save();
    res.json(item);
  } catch (error) {
    handleError(res, error);
  }
});

router.delete('/:id', protect, authorizeRoles('super_admin', 'admin'), async (req, res) => {
  try {
    const item = await Project.findByIdAndDelete(req.params.id);
    if (item) res.json({ message: 'Project removed' });
    else res.status(404).json({ message: 'Project not found' });
  } catch (error) {
    handleError(res, error);
  }
});

export default router;

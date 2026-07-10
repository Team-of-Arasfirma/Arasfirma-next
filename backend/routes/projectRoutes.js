import express from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import Project from '../models/Project.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await Project.find({});
  res.json(items);
});

router.get('/:id', async (req, res) => {
  const item = await Project.findById(req.params.id);
  if (item) res.json(item);
  else res.status(404).json({ message: 'Project not found' });
});

router.post('/', protect, authorizeRoles('super_admin', 'admin'), async (req, res) => {
  console.log('[Project create] incoming image fields:', { images: req.body.images, imageUrls: req.body.imageUrls, imageUrl: req.body.imageUrl }); // ADDED FOR CLOUDINARY
  const projectPayload = { ...req.body, images: req.body.images || req.body.imageUrls || (req.body.imageUrl ? [req.body.imageUrl] : []) }; // SAVES CLOUDINARY URL TO MONGODB
  console.log('[Project create] final images saved:', projectPayload.images); // SAVES CLOUDINARY URL TO MONGODB
  const item = new Project(projectPayload); // SAVES CLOUDINARY URL TO MONGODB
  const created = await item.save();
  console.log('[Project create] MongoDB saved images:', created.images); // SAVES CLOUDINARY URL TO MONGODB
  res.status(201).json(created);
});

router.put('/:id', protect, authorizeRoles('super_admin', 'admin'), async (req, res) => {
  console.log('[Project update] incoming image fields:', { images: req.body.images, imageUrls: req.body.imageUrls, imageUrl: req.body.imageUrl }); // ADDED FOR CLOUDINARY
  const projectPayload = { ...req.body }; // ADDED FOR CLOUDINARY
  if (!projectPayload.images && (req.body.imageUrls || req.body.imageUrl)) projectPayload.images = req.body.imageUrls || [req.body.imageUrl]; // SAVES CLOUDINARY URL TO MONGODB
  console.log('[Project update] final images saved:', projectPayload.images); // SAVES CLOUDINARY URL TO MONGODB
  const item = await Project.findByIdAndUpdate(req.params.id, projectPayload, { new: true }); // SAVES CLOUDINARY URL TO MONGODB
  console.log('[Project update] MongoDB saved images:', item?.images); // SAVES CLOUDINARY URL TO MONGODB
  if (item) res.json(item);
  else res.status(404).json({ message: 'Project not found' });
});

router.delete('/:id', protect, authorizeRoles('super_admin', 'admin'), async (req, res) => {
  const item = await Project.findByIdAndDelete(req.params.id);
  if (item) res.json({ message: 'Project removed' });
  else res.status(404).json({ message: 'Project not found' });
});

export default router;

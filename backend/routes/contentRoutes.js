import express from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import WebsiteContent from '../models/WebsiteContent.js';
import ContactSettings from '../models/ContactSettings.js';

const router = express.Router();

// Content Routes
router.get('/:page', async (req, res) => {
  const content = await WebsiteContent.findOne({ page: req.params.page });
  res.json(content || {});
});

router.post('/:page', protect, authorizeRoles('super_admin', 'admin'), async (req, res) => {
  const { page } = req.params;
  const content = await WebsiteContent.findOneAndUpdate(
    { page },
    { page, sections: req.body.sections },
    { new: true, upsert: true }
  );
  res.json(content);
});

// Settings Routes
router.get('/settings/contact', async (req, res) => {
  const settings = await ContactSettings.findOne({});
  res.json(settings || {});
});

router.post('/settings/contact', protect, authorizeRoles('super_admin', 'admin'), async (req, res) => {
  let settings = await ContactSettings.findOne({});
  if (settings) {
    settings = await ContactSettings.findOneAndUpdate({}, req.body, { new: true });
  } else {
    settings = await ContactSettings.create(req.body);
  }
  res.json(settings);
});

export default router;

import express from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { getDashboardStats } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/', protect, authorizeRoles('super_admin', 'admin', 'editor', 'viewer'), getDashboardStats);

export default router;

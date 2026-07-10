import express from 'express';
import { authAdmin, registerAdmin, getAdminProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', authAdmin);
router.post('/register', registerAdmin);
router.route('/profile').get(protect, getAdminProfile);

export default router;

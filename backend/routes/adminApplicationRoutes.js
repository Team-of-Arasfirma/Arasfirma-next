// backend/routes/adminApplicationRoutes.js
import express from "express";
import {
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats,
} from "../controllers/applicationController.js";
import { protect, authorizePermission } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// View-only access.
// User-ku applications view checked irundha list/details/stats paaka mudiyum.
router.get(
  "/stats",
  authorizePermission("applications", "view"),
  getApplicationStats
);

router.get(
  "/",
  authorizePermission("applications", "view"),
  getAllApplications
);

router.get(
  "/:id",
  authorizePermission("applications", "view"),
  getApplicationById
);

// Edit access.
// View-only user-ku idhu 403 varanum.
router.patch(
  "/:id/status",
  authorizePermission("applications", "edit"),
  updateApplicationStatus
);

// Delete access.
// View-only user-ku idhu 403 varanum.
router.delete(
  "/:id",
  authorizePermission("applications", "delete"),
  deleteApplication
);

export default router;
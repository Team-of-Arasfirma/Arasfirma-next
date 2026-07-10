import express from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJobStats,
  updateJob,
  toggleJobStatus,
} from "../controllers/jobController.js";
import { protect, authorizePermission } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// View access only.
// Staff user-ku careers view checked irundha idhu 200 varanum.
router.get("/", authorizePermission("careers", "view"), getAllJobs);
router.get("/stats", authorizePermission("careers", "view"), getJobStats);

// Create access.
// View-only user-ku idhu 403 varanum.
router.post("/", authorizePermission("careers", "create"), createJob);

// Edit access.
// View-only user-ku idhu 403 varanum.
router.put("/:id", authorizePermission("careers", "edit"), updateJob);
router.patch("/:id/status", authorizePermission("careers", "edit"), toggleJobStatus);

// Delete access.
// View-only user-ku idhu 403 varanum.
router.delete("/:id", authorizePermission("careers", "delete"), deleteJob);

export default router;
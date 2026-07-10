// backend/routes/jobRoutes.js
import express from "express";
import {
  getPublicJobs,
  getPublicJobBySlug,
} from "../controllers/jobController.js";
import { submitApplication } from "../controllers/applicationController.js";
import { uploadResume } from "../config/cloudinary.js";

const router = express.Router();

// Public job list
router.get("/", getPublicJobs);

// Apply job with resume upload.
// Important: uploadResume uses multer.memoryStorage() from cloudinary.js,
// so applicationController can access req.file.buffer.
router.post("/apply", uploadResume.single("resume"), submitApplication);

// Public job details by slug
router.get("/:slug", getPublicJobBySlug);

export default router;
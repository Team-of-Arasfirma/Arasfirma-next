// backend/routes/redirectRoutes.js

import express from "express";
import {
  getRedirects,
  getRedirectByPath,
  createRedirect,
  updateRedirect,
  deleteRedirect,
  deleteMultipleRedirects,
} from "../controllers/redirectController.js";
import { protect, authorizePermission } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route — frontend uses this to check redirect by path.
// Example:
// /api/redirects/check?from=/puf-panels/test-2-likje
router.get("/check", getRedirectByPath);

// View-only access.
// User-ku redirects view checked irundha list paaka mudiyum.
router.get(
  "/",
  protect,
  authorizePermission("redirects", "view"),
  getRedirects
);

// Create access.
// View-only user-ku idhu 403 varanum.
router.post(
  "/",
  protect,
  authorizePermission("redirects", "create"),
  createRedirect
);

// Edit access.
// View-only user-ku idhu 403 varanum.
router.put(
  "/:id",
  protect,
  authorizePermission("redirects", "edit"),
  updateRedirect
);

// Delete access.
// View-only user-ku idhu 403 varanum.
router.delete(
  "/bulk",
  protect,
  authorizePermission("redirects", "delete"),
  deleteMultipleRedirects
);

router.delete(
  "/:id",
  protect,
  authorizePermission("redirects", "delete"),
  deleteRedirect
);

export default router;
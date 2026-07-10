import express from "express";
import {
  protect,
  authorizePermission,
} from "../middleware/authMiddleware.js";
import {
  createInquiry,
  deleteInquiry,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
} from "../controllers/inquiryController.js";

const router = express.Router();

// Public website inquiry form.
// Public users can submit inquiry without admin login.
router.post("/", createInquiry);

// View-only access.
// User-ku inquiries view checked irundha list/details paaka mudiyum.
router.get(
  "/",
  protect,
  authorizePermission("inquiries", "view"),
  getInquiries
);

router.get(
  "/:id",
  protect,
  authorizePermission("inquiries", "view"),
  getInquiryById
);

// Edit access.
// View-only user-ku idhu 403 varanum.
router.put(
  "/:id/status",
  protect,
  authorizePermission("inquiries", "edit"),
  updateInquiryStatus
);

// Delete access.
// View-only user-ku idhu 403 varanum.
router.delete(
  "/:id",
  protect,
  authorizePermission("inquiries", "delete"),
  deleteInquiry
);

export default router;
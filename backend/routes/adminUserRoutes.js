import express from "express";
import {
  createAdminUser,
  deleteAdminUser,
  getAdminUsers,
  updateAdminUser,
} from "../controllers/adminUserController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("super_admin"));

router.route("/").get(getAdminUsers).post(createAdminUser);
router.route("/:id").put(updateAdminUser).delete(deleteAdminUser);

export default router;
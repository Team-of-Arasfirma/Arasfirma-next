import express from "express";
import {
  getBlogs,
  getSingleBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/:slug", getSingleBlog);

router.post("/", protect, authorizeRoles("super_admin", "admin", "editor"), upload.single("image"), createBlog);
router.put("/:id", protect, authorizeRoles("super_admin", "admin", "editor"), upload.single("image"), updateBlog);

router.delete("/:id", protect, authorizeRoles("super_admin", "admin"), deleteBlog);

export default router;
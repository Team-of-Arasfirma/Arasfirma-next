import express from "express";
import cloudinary from "../config/cloudinary.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

const uploadBufferToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });

router.post("/image", protect, authorizeRoles("super_admin", "admin", "editor"), upload.single("image"), async (req, res) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({
        success: false,
        message: "No image provided",
      });
    }

    const imageUrl = await uploadBufferToCloudinary(req.file.buffer, "arasfirma");

    res.status(200).json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
});

router.post("/multiple", protect, authorizeRoles("super_admin", "admin", "editor"), upload.array("images", 5), async (req, res) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({
        success: false,
        message: "No images provided",
      });
    }

    const imageUrls = await Promise.all(
      req.files.map((file) => uploadBufferToCloudinary(file.buffer, "arasfirma"))
    );

    res.status(200).json({
      success: true,
      imageUrls,
    });
  } catch (error) {
    console.error("Cloudinary Multiple Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
});

export default router;

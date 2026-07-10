// backend/middleware/uploadMiddleware.js

import multer from "multer";

const storage = multer.memoryStorage(); // ADDED FOR CLOUDINARY

const fileFilter = (req, file, cb) => { // ADDED FOR CLOUDINARY
  const allowed = ["image/jpeg", "image/png", "image/webp"]; // ADDED FOR CLOUDINARY
  allowed.includes(file.mimetype) // ADDED FOR CLOUDINARY
    ? cb(null, true) // ADDED FOR CLOUDINARY
    : cb(new Error("Only JPG, PNG, WEBP allowed"), false); // ADDED FOR CLOUDINARY
}; // ADDED FOR CLOUDINARY

export const upload = multer({ // ADDED FOR CLOUDINARY
  storage, // ADDED FOR CLOUDINARY
  fileFilter, // ADDED FOR CLOUDINARY
  limits: { fileSize: 5 * 1024 * 1024 }, // ADDED FOR CLOUDINARY
}); // ADDED FOR CLOUDINARY

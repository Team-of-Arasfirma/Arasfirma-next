// backend/config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Store resume temporarily in memory, then controller uploads to Cloudinary.
const resumeMemoryStorage = multer.memoryStorage();

export const uploadResume = multer({
  storage: resumeMemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
      return;
    }

    cb(new Error("Only PDF, DOC, and DOCX resume files are allowed"), false);
  },
});

export const uploadBufferToCloudinary = (fileBuffer, originalName) => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) {
      reject(new Error("Resume file buffer missing"));
      return;
    }

    const extIndex = originalName.lastIndexOf(".");
    const ext = extIndex !== -1 ? originalName.slice(extIndex).toLowerCase() : "";
    const safeName = originalName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "arasfirma/resumes",
        resource_type: "raw",
        public_id: `${Date.now()}-${safeName}${ext}`,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export default cloudinary;
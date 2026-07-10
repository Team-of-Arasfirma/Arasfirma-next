// backend/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import path from "path";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// ─── Import Routes ────────────────────────────────────────────────────────────
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import adminJobRoutes from "./routes/adminJobRoutes.js";
import adminApplicationRoutes from "./routes/adminApplicationRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import redirectRoutes from "./routes/redirectRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";

// ────── Sitemap routes import ──────
import sitemapRoutes from "./routes/sitemapRoutes.js";

const app = express();

// ─── BASIC MIDDLEWARE ─────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Allows local Next.js frontend, old Vite frontend, and production domains.
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "https://arasfirma-final.vercel.app",
      "https://arasfirma.com",
      "https://www.arasfirma.com",
      process.env.CLIENT_URL,
    ].filter(Boolean),
    credentials: true,
  })
);

// ─── SECURITY HEADERS ─────────────────────────────────────────────────────────
// crossOriginResourcePolicy:false allows images/PDF/uploads to load from backend.
// frameAncestors allows admin frontend to preview backend PDFs inside iframe.
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        frameAncestors: [
          "'self'",
          "http://localhost:3000",
          "http://localhost:5173",
          "http://localhost:5174",
          "https://arasfirma-final.vercel.app",
          "https://arasfirma.com",
          "https://www.arasfirma.com",
        ],
      },
    },
  })
);

// Prevent NoSQL injection.
app.use(mongoSanitize());

// Request logging.
app.use(morgan("dev"));

// ─── STATIC UPLOADS FOLDER ────────────────────────────────────────────────────
const __dirname = path.resolve();

// Local uploaded files, resumes, PDFs, images.
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// ─── API ROUTES ───────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/products", productRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/admin/jobs", adminJobRoutes);
app.use("/api/admin/applications", adminApplicationRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/applications", adminApplicationRoutes);
app.use("/api/redirects", redirectRoutes);
app.use("/api/admin/users", adminUserRoutes);

// Dynamic sitemap route.
// Makes /sitemap.xml work from backend.
app.use("/", sitemapRoutes);

// ─── ROOT HEALTH CHECK ────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Arasfirma API is running ✅" });
});

// ─── ERROR HANDLING ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;


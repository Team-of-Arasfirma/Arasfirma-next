import express from "express";
import Blog from "../models/Blog.js";

const router = express.Router();

const cleanPath = (value = "") =>
  String(value)
    .trim()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

router.get("/sitemap.xml", async (req, res) => {
  try {
    const siteUrl = (process.env.SITE_URL || "https://www.arasfirma.com").replace(
      /\/+$/,
      ""
    );

    const staticPages = [
      "",
      "about",
      "project",
      "blog",
      "career",
      "contact",
      "products/roof-panel",
      "products/mono-wall",
      "products/concealed",
      "roof-panel",
      "mono-wall",
      "concealed",
    ];

    const blogs = await Blog.find(
      { published: true },
      "slug categorySlug updatedAt createdAt"
    ).lean();

    const staticUrls = staticPages.map((page) => ({
      loc: page ? `${siteUrl}/${page}` : `${siteUrl}/`,
      lastmod: new Date(),
      changefreq: "weekly",
      priority: page === "" ? "1.0" : "0.8",
    }));

    const blogUrls = blogs
      .filter((blog) => blog.slug)
      .map((blog) => {
        const categorySlug = cleanPath(blog.categorySlug || "puf-panels");
        const slug = cleanPath(blog.slug);

        return {
          loc: `${siteUrl}/${categorySlug}/${slug}`,
          lastmod: blog.updatedAt || blog.createdAt || new Date(),
          changefreq: "weekly",
          priority: "0.7",
        };
      });

    const urls = [...staticUrls, ...blogUrls];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${new Date(url.lastmod).toISOString()}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(sitemap);
  } catch (error) {
    console.error("Sitemap error:", error);
    res.status(500).send("Sitemap generation failed");
  }
});

export default router;
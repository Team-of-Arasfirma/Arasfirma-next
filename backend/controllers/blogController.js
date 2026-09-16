// backend/controllers/blogController.js

import Blog from "../models/Blog.js";
import cloudinary from "../config/cloudinary.js";

const uploadBlogImageToCloudinary = (file) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "arasfirma/blogs",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 1200, height: 630, crop: "limit" }],
      },
      (error, result) => {
        if (error) return reject(error);

        console.log("[Blog Cloudinary stream] secure_url:", result.secure_url);
        resolve(result.secure_url);
      }
    );

    stream.end(file.buffer);
  });

// Convert common HTML entities to readable text.
const decodeHtmlEntities = (value = "") =>
  String(value)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

// Strip HTML tags and return plain text only.
const stripHtmlToText = (html = "") =>
  decodeHtmlEntities(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Trim text without cutting words in the middle.
const trimOnWordBoundary = (text = "", limit = 160) => {
  if (!text || text.length <= limit) return text;

  const sliced = text.slice(0, limit);
  const lastSpace = sliced.lastIndexOf(" ");
  const safeText = sliced.slice(0, lastSpace > 0 ? lastSpace : limit).trim();

  return `${safeText}...`;
};

// Create listing excerpt without sending full blog content.
const createBlogExcerpt = (blog) => {
  const source =
    blog.metaDescription ||
    blog.excerpt ||
    blog.summary ||
    blog.content ||
    "";

  return trimOnWordBoundary(stripHtmlToText(source), 160);
};

// GET ALL BLOGS
export const getBlogs = async (req, res) => {
  try {
    const {
      published,
      search,
      category,
      categorySlug,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (published !== undefined) {
      query.published = published === "true";
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (categorySlug && categorySlug !== "All") {
      query.categorySlug = categorySlug;
    }

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.max(Number(limit) || 10, 1);
    const skip = (pageNumber - 1) * limitNumber;

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      Blog.countDocuments(query),
    ]);

    const listingBlogs = blogs.map((blog) => ({
      _id: blog._id,
      title: blog.title,
      slug: blog.slug,

      // This is needed for admin edit form.
      content: blog.content,

      image: blog.image,
      author: blog.author,
      category: blog.category,
      categorySlug: blog.categorySlug || "puf-panels",
      published: blog.published,
      publishDate: blog.publishDate,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
      metaTitle: blog.metaTitle,
      metaDescription: blog.metaDescription,
      excerpt: createBlogExcerpt(blog),
    }));

    res.status(200).json({
      success: true,
      data: listingBlogs,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error("getBlogs error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET SINGLE BLOG BY SLUG
export const getSingleBlog = async (req, res) => {
  try {
    // Express has already decoded the route parameter.
    const slug = (req.params.slug || "").trim();

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Blog slug is required",
      });
    }

    const blog = await Blog.findOne({
      slug,
      published: true,
    }).lean();

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
        searchedSlug: slug,
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("getSingleBlog error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// CREATE BLOG
export const createBlog = async (req, res) => {
  try {
    const {
      title,
      slug,
      content,
      image,
      imageUrl,
      author,
      category,
      categorySlug,
      published,
      metaTitle,
      metaDescription,
    } = req.body;

    const cleanTitle = title?.trim();
    const cleanSlug = slug?.trim().toLowerCase();
    const cleanContent = content?.trim();

    if (!cleanTitle || !cleanSlug || !cleanContent) {
      return res.status(400).json({
        success: false,
        message: "Title, slug, and content are required",
      });
    }

    if (cleanSlug && /[\s/?#%]/.test(cleanSlug)) {
      return res.status(400).json({
        success: false,
        message: "Slug must be a single URL segment; select the URL Category separately",
      });
    }

    const existing = await Blog.findOne({ slug: cleanSlug });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    const cloudinaryImageUrl = req.file
      ? await uploadBlogImageToCloudinary(req.file)
      : image || imageUrl || "";

    const blog = await Blog.create({
      title: cleanTitle,
      slug: cleanSlug,
      content: cleanContent,
      image: cloudinaryImageUrl,
      author: author || "Admin",
      category: category || "General",
      categorySlug: categorySlug || "puf-panels",
      published: published === true || published === "true",
      metaTitle: metaTitle || "",
      metaDescription: metaDescription || "",
    });

    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    console.error("createBlog error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE BLOG
export const updateBlog = async (req, res) => {
  try {
    const {
      title,
      slug,
      content,
      image,
      imageUrl,
      author,
      category,
      categorySlug,
      published,
      metaTitle,
      metaDescription,
    } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const cleanSlug = slug?.trim().toLowerCase();

    if (cleanSlug && /[\s/?#%]/.test(cleanSlug)) {
      return res.status(400).json({
        success: false,
        message: "Slug must be a single URL segment; select the URL Category separately",
      });
    }

    if (cleanSlug && cleanSlug !== blog.slug) {
      const existing = await Blog.findOne({
        slug: cleanSlug,
        _id: { $ne: blog._id },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Slug already exists",
        });
      }
    }

    const cloudinaryImageUrl = req.file
      ? await uploadBlogImageToCloudinary(req.file)
      : image || imageUrl;

    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title: title?.trim() || blog.title,
        slug: cleanSlug || blog.slug,
        content: content ?? blog.content,
        image: cloudinaryImageUrl ?? blog.image,
        author: author ?? blog.author,
        category: category ?? blog.category,
        categorySlug: categorySlug ?? blog.categorySlug ?? "puf-panels",
        published:
          published !== undefined
            ? published === true || published === "true"
            : blog.published,
        metaTitle: metaTitle !== undefined ? metaTitle : blog.metaTitle,
        metaDescription:
          metaDescription !== undefined
            ? metaDescription
            : blog.metaDescription,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("updateBlog error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE BLOG
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("deleteBlog error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
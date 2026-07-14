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
  value
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
    const { published, search, category, page = 1, limit = 10 } = req.query;

    const query = {};

    if (published !== undefined) query.published = published === "true";
    if (search) query.title = { $regex: search, $options: "i" };
    if (category && category !== "All") query.category = category;

    const skip = (Number(page) - 1) * Number(limit);

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Blog.countDocuments(query),
    ]);

    const listingBlogs = blogs.map((blog) => ({
      _id: blog._id,
      title: blog.title,
      slug: blog.slug,
      image: blog.image,
      author: blog.author,
      category: blog.category,
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
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
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
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({ success: true, data: blog });
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
      published,
      metaTitle,
      metaDescription,
    } = req.body;

    const cloudinaryImageUrl = req.file
      ? await uploadBlogImageToCloudinary(req.file)
      : image || imageUrl || "";

    if (!title || !slug || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, slug, and content are required",
      });
    }

    const existing = await Blog.findOne({ slug });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    const blog = await Blog.create({
      title,
      slug,
      content,
      image: cloudinaryImageUrl,
      author: author || "Admin",
      category: category || "General",
      published: published || false,
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
      published,
      metaTitle,
      metaDescription,
    } = req.body;

    const cloudinaryImageUrl = req.file
      ? await uploadBlogImageToCloudinary(req.file)
      : image || imageUrl;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (slug && slug !== blog.slug) {
      const existing = await Blog.findOne({ slug });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Slug already exists",
        });
      }
    }

    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title: title ?? blog.title,
        slug: slug ?? blog.slug,
        content: content ?? blog.content,
        image: cloudinaryImageUrl ?? blog.image,
        author: author ?? blog.author,
        category: category ?? blog.category,
        published: published !== undefined ? published : blog.published,
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
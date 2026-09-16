import "dotenv/config";
import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import { splitBlogPath } from "./blogPath.js";

// Dry run by default. --apply changes only slug/categorySlug, preserving URLs.
try {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required");
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  const blogs = await Blog.find({ slug: /\// }).lean();
  const changes = blogs.map((blog) => ({
    id: blog._id,
    before: { slug: blog.slug, categorySlug: blog.categorySlug || "puf-panels" },
    after: splitBlogPath(blog.slug, blog.categorySlug || "puf-panels"),
  }));
  const targets = new Set();
  for (const change of changes) {
    if (targets.has(change.after.slug) || await Blog.exists({
      _id: { $ne: change.id }, slug: change.after.slug,
    })) throw new Error(`Slug collision: ${change.after.slug}; no changes applied`);
    targets.add(change.after.slug);
  }
  console.log(JSON.stringify(changes, null, 2));
  if (process.argv.includes("--apply")) {
    for (const change of changes) {
      const result = await Blog.updateOne(
        { _id: change.id, slug: change.before.slug },
        { $set: change.after },
        { runValidators: true, timestamps: false },
      );
      if (result.matchedCount !== 1) throw new Error(`Record changed: ${change.id}`);
    }
    console.log(`Normalized ${changes.length} blog paths.`);
  } else {
    console.log(`Dry run: ${changes.length} blog paths. Use --apply to save.`);
  }
} finally {
  await mongoose.disconnect();
}

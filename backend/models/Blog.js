// backend/models/Blog.js

import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    author: {
      type: String,
      default: "Admin",
    },

    // Used for admin display/filter purpose.
    category: {
      type: String,
      default: "General",
      enum: [
        "General",
        "Roofing",
        "Cold Storage",
        "Installation",
        "Poultry Farming",
        "Agriculture",
      ],
    },

    // Used for blog URL path and sitemap.
    // Example: /puf-panels/reasons-to-choose
    categorySlug: {
      type: String,
      default: "puf-panels",
      enum: ["puf-panels", "puf-panel-roof", "puf-panel-wall"],
      lowercase: true,
      trim: true,
    },

    published: {
      type: Boolean,
      default: false,
    },

    publishDate: {
      type: Date,
      default: Date.now,
    },

    metaTitle: {
      type: String,
      default: "",
    },

    metaDescription: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
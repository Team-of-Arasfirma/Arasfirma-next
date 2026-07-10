// backend/models/Blog.js

import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title:           { type: String, required: true, trim: true },
    slug:            { type: String, required: true, unique: true, lowercase: true, trim: true },
    content:         { type: String, required: true },
    image:           { type: String, default: "" },
    author:          { type: String, default: "Admin" },
    category:        {
      type: String,
      default: "General",
      enum: ["General", "Roofing", "Cold Storage", "Installation", "Poultry Farming", "Agriculture"],
    },
    published:       { type: Boolean, default: false },
    publishDate:     { type: Date, default: Date.now },
    metaTitle:       { type: String, default: "" },
    metaDescription: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
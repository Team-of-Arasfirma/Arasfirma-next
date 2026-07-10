// backend/models/Redirect.js

import mongoose from "mongoose";

const redirectSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    to: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Redirect", redirectSchema);
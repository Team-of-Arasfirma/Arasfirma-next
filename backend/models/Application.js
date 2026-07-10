import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    fullName: {
      type: String,
      trim: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },

    jobTitle: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: String,
      trim: true,
      default: "",
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    // Stores Cloudinary secure_url or old local upload path.
    resume: {
      type: String,
      default: "",
    },

    // Same as resume for frontend direct preview/download support.
    resumeUrl: {
      type: String,
      default: "",
    },

    // Original uploaded resume file name.
    resumeOriginalName: {
      type: String,
      default: "",
    },

    // Cloudinary public_id used for deleting resume from Cloudinary.
    resumePublicId: {
      type: String,
      default: "",
    },

    portfolio: {
      type: String,
      trim: true,
      default: "",
    },

    linkedin: {
      type: String,
      trim: true,
      default: "",
    },

    coverLetter: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["New", "Reviewed", "Shortlisted", "Rejected"],
      default: "New",
    },
  },
  { timestamps: true }
);

applicationSchema.pre("validate", function (next) {
  if (!this.name && this.fullName) {
    this.name = this.fullName;
  }

  if (!this.fullName && this.name) {
    this.fullName = this.name;
  }

  if (!this.jobId && this.job) {
    this.jobId = this.job;
  }

  if (!this.resumeUrl && this.resume) {
    this.resumeUrl = this.resume;
  }

  if (!this.resume && this.resumeUrl) {
    this.resume = this.resumeUrl;
  }

  next();
});

const Application = mongoose.model("Application", applicationSchema);

export default Application;
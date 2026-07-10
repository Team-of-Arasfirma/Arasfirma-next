import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    department: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'],
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Manager'],
      required: true,
    },
    salaryMin: { type: Number, default: null },
    salaryMax: { type: Number, default: null },
    currency: { type: String, default: 'USD' },
    description: { type: String, required: true },
    responsibilities: [{ type: String }],
    requirements: [{ type: String }],
    skills: [{ type: String }],
    benefits: [{ type: String }],
    status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
    featured: { type: Boolean, default: false },
    closingDate: { type: Date, default: null },
    applicationCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

jobSchema.pre('validate', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

const Job = mongoose.model('Job', jobSchema);

export default Job;

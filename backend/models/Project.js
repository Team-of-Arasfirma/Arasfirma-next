import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  images: [{ type: String }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
    required: true,
  },
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;

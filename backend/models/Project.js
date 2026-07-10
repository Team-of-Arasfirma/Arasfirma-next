import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  client: {
    type: String,
  },
  completionDate: {
    type: Date,
  },
  images: [{ // SAVES CLOUDINARY URL TO MONGODB
    type: String, // SAVES CLOUDINARY URL TO MONGODB
  }],
  technologies: [{
    type: String,
  }],
  link: {
    type: String,
  },
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

export default Project;

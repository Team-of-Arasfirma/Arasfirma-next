import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String, // e.g., Full-time, Part-time, Contract
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: [{
    type: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Career = mongoose.model('Career', careerSchema);

export default Career;

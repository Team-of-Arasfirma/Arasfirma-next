import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  businessName: {
    type: String,
  },
  city: {
    type: String,
  },
  sqFt: {
    type: String,
  },
  isQuote: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread',
  },
}, { timestamps: true });

const Inquiry = mongoose.model('Inquiry', inquirySchema);

export default Inquiry;

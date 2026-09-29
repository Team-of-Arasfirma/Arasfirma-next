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
  crmSyncStatus: {
    type: String,
    enum: ['pending', 'success', 'failed', 'skipped'],
    default: function () { return process.env.CRM_SYNC_ENABLED === 'true' ? 'pending' : 'skipped'; },
  },
  crmLeadId: { type: String, default: '' },
  crmError: { type: String, default: '' },
  crmSyncedAt: { type: Date, default: null },
  crmRetryCount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread',
  },
}, { timestamps: true });

const Inquiry = mongoose.model('Inquiry', inquirySchema);

export default Inquiry;

import mongoose from 'mongoose';

const contactSettingsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  socialLinks: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
  },
  mapEmbedUrl: {
    type: String,
  }
}, { timestamps: true });

const ContactSettings = mongoose.model('ContactSettings', contactSettingsSchema);

export default ContactSettings;

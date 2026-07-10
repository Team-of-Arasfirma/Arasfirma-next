import mongoose from 'mongoose';

const websiteContentSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true, // e.g., 'home', 'about'
    unique: true,
  },
  sections: {
    type: mongoose.Schema.Types.Mixed, // Flexible structure for different page sections
    // Example: { heroTitle: '...', heroSubtitle: '...', aboutText: '...' }
  },
}, { timestamps: true });

const WebsiteContent = mongoose.model('WebsiteContent', websiteContentSchema);

export default WebsiteContent;

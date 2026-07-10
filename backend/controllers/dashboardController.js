import Blog from '../models/Blog.js';
import Product from '../models/Product.js';
import Project from '../models/Project.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Inquiry from '../models/Inquiry.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [
      blogs,
      products,
      projects,
      careers,
      applications,
      inquiries,
      recentApplications,
      recentInquiries,
      recentBlogs,
    ] = await Promise.all([
      Blog.countDocuments(),
      Product.countDocuments(),
      Project.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      Inquiry.countDocuments(),
      Application.find({}).sort({ createdAt: -1 }).limit(5).select('name fullName email jobTitle status createdAt'),
      Inquiry.find({}).sort({ createdAt: -1 }).limit(5).select('name email subject status createdAt'),
      Blog.find({}).sort({ createdAt: -1 }).limit(5).select('title createdAt published'),
    ]);

    const recentActivities = [
      ...recentApplications.map((item) => ({
        type: 'Application',
        title: `${item.name || item.fullName || 'Candidate'} applied for ${item.jobTitle || 'a role'}`,
        createdAt: item.createdAt,
      })),
      ...recentInquiries.map((item) => ({
        type: 'Inquiry',
        title: `${item.name} sent ${item.subject}`,
        createdAt: item.createdAt,
      })),
      ...recentBlogs.map((item) => ({
        type: 'Blog',
        title: item.title,
        createdAt: item.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

    res.json({
      success: true,
      stats: { blogs, products, projects, careers, applications, inquiries },
      recentActivities,
      recentApplications,
      recentInquiries,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

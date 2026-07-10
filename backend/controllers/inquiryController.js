import Inquiry from '../models/Inquiry.js';

export const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message, businessName, city, sqFt, isQuote } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required',
      });
    }

    const inquiry = await Inquiry.create({
      name,
      email,
      phone: phone || '',
      subject: subject || 'Website Contact Form',
      message,
      businessName,
      city,
      sqFt,
      isQuote: !!isQuote,
      status: 'unread',
    });

    res.status(201).json({ success: true, inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getInquiries = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
        { businessName: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

    const [items, total, unreadCount] = await Promise.all([
      Inquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber),
      Inquiry.countDocuments(filter),
      Inquiry.countDocuments({ status: 'unread' }),
    ]);

    res.json({
      success: true,
      inquiries: items,
      total,
      unreadCount,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber) || 1,
      limit: limitNumber,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.json({ success: true, inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateInquiryStatus = async (req, res) => {
  try {
    const status = req.body.status || 'read';
    if (!['read', 'unread'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.json({ success: true, inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.json({ success: true, message: 'Inquiry removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

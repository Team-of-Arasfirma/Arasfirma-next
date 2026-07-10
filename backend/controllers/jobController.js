import Job from '../models/Job.js';

const buildSlug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const getPublicJobs = async (req, res) => {
  try {
    const {
      search,
      department,
      location,
      employmentType,
      experienceLevel,
      featured,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { status: 'Published' };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (department) filter.department = { $regex: department, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (employmentType) filter.employmentType = employmentType;
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (featured === 'true') filter.featured = true;

    const total = await Job.countDocuments(filter);
    const jobs = await Job.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .select('-__v');

    const [departments, locations, types] = await Promise.all([
      Job.distinct('department', { status: 'Published' }),
      Job.distinct('location', { status: 'Published' }),
      Job.distinct('employmentType', { status: 'Published' }),
    ]);

    res.json({
      success: true,
      jobs,
      filterOptions: { departments, locations, types },
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPublicJobBySlug = async (req, res) => {
  try {
    const job = await Job.findOne({ slug: req.params.slug, status: 'Published' });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    const similar = await Job.find({
      status: 'Published',
      department: job.department,
      _id: { $ne: job._id },
    })
      .limit(3)
      .select('title slug department location employmentType experienceLevel');

    res.json({ success: true, job, similar });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Job.countDocuments(filter);
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      success: true,
      jobs,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const data = { ...req.body };

    if (!data.slug) {
      data.slug = buildSlug(data.title);
    } else {
      data.slug = buildSlug(data.slug);
    }

    let slug = data.slug;
    let counter = 1;
    while (await Job.findOne({ slug })) {
      slug = `${data.slug}-${counter++}`;
    }
    data.slug = slug;

    const job = await Job.create(data);
    res.status(201).json({ success: true, job });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Slug already exists' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.slug) data.slug = buildSlug(data.slug);

    const job = await Job.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    job.status = job.status === 'Published' ? 'Draft' : 'Published';
    await job.save();
    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getJobStats = async (req, res) => {
  try {
    const [totalJobs, publishedJobs, draftJobs, closedJobs] = await Promise.all([
      Job.countDocuments(),
      Job.countDocuments({ status: 'Published' }),
      Job.countDocuments({ status: 'Draft' }),
      Job.countDocuments({ status: 'Closed' }),
    ]);
    res.json({ success: true, totalJobs, publishedJobs, draftJobs, closedJobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

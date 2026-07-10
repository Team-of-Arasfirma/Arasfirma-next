// backend/controllers/applicationController.js
import cloudinary, { uploadBufferToCloudinary } from "../config/cloudinary.js";
import Application from "../models/Application.js";
import Job from "../models/Job.js";

const STATUSES = ["New", "Reviewed", "Shortlisted", "Rejected"];

const LEGACY_STATUS_MAP = {
  Pending: "New",
  Reviewing: "Reviewed",
  Hired: "Shortlisted",
};

const normalizeStatus = (status) => {
  return LEGACY_STATUS_MAP[status] || status || "New";
};

const getResumeUrl = (req, resume) => {
  if (!resume) return null;

  // Cloudinary URL already starts with http/https.
  if (resume.startsWith("http://") || resume.startsWith("https://")) {
    return resume;
  }

  // Backward compatibility for old local uploads.
  return `${req.protocol}://${req.get("host")}/${resume.replace(/\\/g, "/")}`;
};

const getCloudinaryPublicIdFromUrl = (url) => {
  if (!url || !url.includes("cloudinary.com")) return null;

  try {
    const parts = url.split("/upload/");
    if (!parts[1]) return null;

    const pathAfterUpload = parts[1].replace(/^v\d+\//, "");
    const publicIdWithExtension = pathAfterUpload.replace(/\.[^/.]+$/, "");

    return publicIdWithExtension;
  } catch {
    return null;
  }
};

const serializeApplication = (req, app) => {
  const item = app.toObject ? app.toObject() : app;
  const name = item.name || item.fullName || "";

  return {
    ...item,
    name,
    fullName: item.fullName || name,
    jobId: item.jobId || item.job?._id || item.job,
    status: normalizeStatus(item.status),
    resumeUrl: item.resumeUrl || getResumeUrl(req, item.resume),
  };
};

export const submitApplication = async (req, res) => {
  try {
    const {
      jobId,
      name,
      fullName,
      email,
      phone,
      portfolio,
      linkedin,
      coverLetter,
      experience,
      skills,
    } = req.body;

    const candidateName = name || fullName;

    if (!jobId || !candidateName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const job = await Job.findById(jobId);

    if (!job || job.status !== "Published") {
      return res.status(404).json({
        success: false,
        message: "Job not found or closed",
      });
    }

    const existing = await Application.findOne({
      job: jobId,
      email: email.toLowerCase(),
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const parsedSkills = Array.isArray(skills)
      ? skills
      : String(skills || "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

    const appData = {
      name: candidateName,
      fullName: candidateName,
      job: jobId,
      jobId,
      jobTitle: job.title,
      email: email.toLowerCase(),
      phone,
      experience: experience || "",
      skills: parsedSkills,
      portfolio: portfolio || "",
      linkedin: linkedin || "",
      coverLetter: coverLetter || "",
      status: "New",
    };

    // New resume upload flow:
    // multer stores file in memory, then this uploads the buffer to Cloudinary.
    if (req.file) {
      const uploadedResume = await uploadBufferToCloudinary(
        req.file.buffer,
        req.file.originalname
      );

      appData.resume = uploadedResume.secure_url;
      appData.resumeUrl = uploadedResume.secure_url;
      appData.resumeOriginalName = req.file.originalname;
      appData.resumePublicId = uploadedResume.public_id;
    }

    const application = await Application.create(appData);

    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationCount: 1 },
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      application: serializeApplication(req, application),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const { status, jobTitle, search, page = 1, limit = 10 } = req.query;

    const filter = {};
    const normalizedStatus = normalizeStatus(status);

    if (status) {
      filter.status = normalizedStatus;
    }

    if (jobTitle) {
      filter.jobTitle = jobTitle;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

    const [total, applications, statusStats, jobTitles] = await Promise.all([
      Application.countDocuments(filter),

      Application.find(filter)
        .populate("job", "title slug department")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber),

      Application.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      Application.distinct("jobTitle"),
    ]);

    const statusCounts = statusStats.reduce((acc, item) => {
      const key = normalizeStatus(item._id);
      acc[key] = (acc[key] || 0) + item.count;
      return acc;
    }, {});

    res.json({
      success: true,
      applications: applications.map((app) => serializeApplication(req, app)),
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber) || 1,
      limit: limitNumber,
      statusCounts,
      filterOptions: {
        jobTitles: jobTitles.filter(Boolean).sort(),
        statuses: STATUSES,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate(
      "job",
      "title slug department location"
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      application: serializeApplication(req, application),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const status = normalizeStatus(req.body.status);

    if (!STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate("job", "title slug department");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      application: serializeApplication(req, application),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Delete resume from Cloudinary if it is a Cloudinary file.
    const publicId =
      application.resumePublicId ||
      getCloudinaryPublicIdFromUrl(application.resume);

    if (publicId && application.resume?.includes("cloudinary.com")) {
      try {
        await cloudinary.uploader.destroy(publicId, {
          resource_type: "raw",
        });
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary resume delete failed:",
          cloudinaryError.message
        );
      }
    }

    await Application.findByIdAndDelete(req.params.id);

    if (application.job) {
      await Job.findByIdAndUpdate(application.job, {
        $inc: { applicationCount: -1 },
      });
    }

    res.json({
      success: true,
      message: "Application deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getApplicationStats = async (req, res) => {
  try {
    const [totalApplications, statusStats] = await Promise.all([
      Application.countDocuments(),

      Application.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const statusCounts = statusStats.reduce((acc, item) => {
      const key = normalizeStatus(item._id);
      acc[key] = (acc[key] || 0) + item.count;
      return acc;
    }, {});

    res.json({
      success: true,
      totalApplications,
      newApplications: statusCounts.New || 0,
      shortlisted: statusCounts.Shortlisted || 0,
      rejected: statusCounts.Rejected || 0,
      statusCounts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
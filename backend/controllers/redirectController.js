// backend/controllers/redirectController.js

import Redirect from "../models/Redirect.js";

const normalizePath = (value = "") => {
  let path = String(value || "").trim();

  if (!path) return "";

  // If full URL is given, convert to pathname.
  try {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      const url = new URL(path);
      path = url.pathname;
    }
  } catch {
    // Keep original value if URL parsing fails.
  }

  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  // Remove trailing slash except root.
  if (path.length > 1) {
    path = path.replace(/\/+$/, "");
  }

  return path;
};

const normalizeToPath = (value = "") => {
  let path = String(value || "").trim();

  if (!path) return "";

  // External URL allowed.
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  // Remove trailing slash except root.
  if (path.length > 1) {
    path = path.replace(/\/+$/, "");
  }

  return path;
};

// GET ALL REDIRECTS
export const getRedirects = async (req, res) => {
  try {
    const { search, page = 1, limit = 25 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { from: { $regex: search, $options: "i" } },
        { to: { $regex: search, $options: "i" } },
      ];
    }

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);
    const skip = (pageNumber - 1) * limitNumber;

    const [redirects, total] = await Promise.all([
      Redirect.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),
      Redirect.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: redirects,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(total / limitNumber) || 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// PUBLIC: GET SINGLE REDIRECT BY FROM PATH
export const getRedirectByPath = async (req, res) => {
  try {
    const from = normalizePath(req.query.from);

    if (!from) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Redirect source path is required",
      });
    }

    const redirect = await Redirect.findOne({ from });

    if (!redirect) {
      return res.status(200).json({
        success: false,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: redirect,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// CREATE REDIRECT
export const createRedirect = async (req, res) => {
  try {
    const from = normalizePath(req.body.from);
    const to = normalizeToPath(req.body.to);

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "Both from and to are required",
      });
    }

    if (from === to) {
      return res.status(400).json({
        success: false,
        message: "Redirect from and to cannot be the same",
      });
    }

    const existing = await Redirect.findOne({ from });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Redirect from this URL already exists",
      });
    }

    const redirect = await Redirect.create({ from, to });

    res.status(201).json({
      success: true,
      data: redirect,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// UPDATE REDIRECT
export const updateRedirect = async (req, res) => {
  try {
    const from = normalizePath(req.body.from);
    const to = normalizeToPath(req.body.to);

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "Both from and to are required",
      });
    }

    if (from === to) {
      return res.status(400).json({
        success: false,
        message: "Redirect from and to cannot be the same",
      });
    }

    const existing = await Redirect.findOne({
      from,
      _id: { $ne: req.params.id },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Redirect from this URL already exists",
      });
    }

    const redirect = await Redirect.findByIdAndUpdate(
      req.params.id,
      { from, to },
      { new: true, runValidators: true }
    );

    if (!redirect) {
      return res.status(404).json({
        success: false,
        message: "Redirect not found",
      });
    }

    res.status(200).json({
      success: true,
      data: redirect,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// DELETE REDIRECT
export const deleteRedirect = async (req, res) => {
  try {
    const redirect = await Redirect.findByIdAndDelete(req.params.id);

    if (!redirect) {
      return res.status(404).json({
        success: false,
        message: "Redirect not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Redirect deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// DELETE MULTIPLE REDIRECTS
export const deleteMultipleRedirects = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids?.length) {
      return res.status(400).json({
        success: false,
        message: "No IDs provided",
      });
    }

    await Redirect.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${ids.length} redirect(s) deleted`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
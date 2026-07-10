import Admin from "../models/Admin.js";
import { generateToken } from "../middleware/authMiddleware.js";
import { buildUserResponse, normalizeAdminUser } from "../utils/adminAccess.js";

const buildAuthResponse = (admin, token = null) => {
  const user = buildUserResponse(admin);

  const response = {
    success: true,
    user,
    admin: user,

    // Backward compatibility for old frontend code.
    _id: user?._id,
    name: user?.name,
    email: user?.email,
    role: user?.role,
    isActive: user?.isActive,
    permissions: user?.permissions,
  };

  // Login response-la mattum token include pannum.
  if (token) {
    response.token = token;
  }

  return response;
};

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
export const authAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Password field select:false irukkura nala +password use panrom.
    const admin = await Admin.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email",
      });
    }

    const adminData = normalizeAdminUser(admin);

    if (!adminData.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive",
      });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    return res.json(buildAuthResponse(adminData, generateToken(admin._id)));
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};

// @desc    Register a new admin
// @route   POST /api/auth/register
// @access  Public / Seed purpose
export const registerAdmin = async (req, res) => {
  const { name, email, password, role, isActive, permissions } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const adminExists = await Admin.findOne({
      email: email.toLowerCase().trim(),
    });

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const admin = await Admin.create({
      name,
      email,
      password,
      role,
      isActive,
      permissions,
    });

    return res.status(201).json(
      buildAuthResponse(admin, generateToken(admin._id))
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Invalid admin data",
      error: error.message,
    });
  }
};

// @desc    Get admin profile
// @route   GET /api/auth/profile
// @access  Private
export const getAdminProfile = async (req, res) => {
  try {
    // protect middleware-la req.user use pannuvom.
    // Old code compatibility-ku req.admin also fallback.
    const adminId = req.user?._id || req.admin?._id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.json(buildAuthResponse(admin));
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
      error: error.message,
    });
  }
};
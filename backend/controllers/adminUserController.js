import Admin from "../models/Admin.js";
import {
  buildUserResponse,
  createDefaultPermissions,
  createFullPermissions,
  normalizePermissions,
  normalizeRole,
} from "../utils/adminAccess.js";

const toBoolean = (value, defaultValue = true) => {
  if (value === undefined || value === null) return defaultValue;
  return value === true || value === "true" || value === 1 || value === "1";
};

const ensurePermissionsForRole = (role, permissions) => {
  const normalizedRole = normalizeRole(role);

  // Super admin always full permission.
  if (normalizedRole === "super_admin") {
    return createFullPermissions();
  }

  // If permission object not sent, create default permissions for that role.
  if (!permissions || typeof permissions !== "object") {
    return createDefaultPermissions(normalizedRole);
  }

  return normalizePermissions(normalizedRole, permissions);
};

const buildListResponse = (users) => {
  const formattedUsers = users.map((user) => buildUserResponse(user));

  return {
    success: true,

    // Frontend compatibility.
    data: formattedUsers,
    users: formattedUsers,
  };
};

// @desc    Get all admin users
// @route   GET /api/admin/users
// @access  Super Admin only
export const getAdminUsers = async (req, res) => {
  try {
    const users = await Admin.find({}).select("-password").sort({
      createdAt: -1,
    });

    return res.json(buildListResponse(users));
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin users",
      error: error.message,
    });
  }
};

// @desc    Create admin user
// @route   POST /api/admin/users
// @access  Super Admin only
export const createAdminUser = async (req, res) => {
  try {
    const { name, email, password, role, isActive, permissions } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and role are required",
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const existing = await Admin.findOne({ email: normalizedEmail });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const normalizedRole = normalizeRole(role);

    const admin = await Admin.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password,
      role: normalizedRole,

      // If checkbox value missing, default active true.
      isActive: toBoolean(isActive, true),

      permissions: ensurePermissionsForRole(normalizedRole, permissions),
    });

    const savedAdmin = await Admin.findById(admin._id).select("-password");
    const formattedUser = buildUserResponse(savedAdmin);

    return res.status(201).json({
      success: true,
      message: "Admin user created successfully",

      // Frontend compatibility.
      data: formattedUser,
      user: formattedUser,
    });
  } catch (error) {
    console.error("Create admin user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create admin user",
      error: error.message,
    });
  }
};

// @desc    Update admin user
// @route   PUT /api/admin/users/:id
// @access  Super Admin only
export const updateAdminUser = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id).select("+password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
    }

    const currentUserId = String(req.user?._id || req.user?.id || "");
    const targetId = String(admin._id);
    const isSelfUpdate = currentUserId === targetId;

    const nextRole = normalizeRole(req.body.role || admin.role);

    if (isSelfUpdate && nextRole !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "You cannot remove your own super_admin access",
      });
    }

    if (normalizeRole(admin.role) === "super_admin" && nextRole !== "super_admin") {
      const superAdminCount = await Admin.countDocuments({
        role: "super_admin",
      });

      if (superAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "At least one super_admin is required",
        });
      }
    }

    if (req.body.name !== undefined) {
      admin.name = String(req.body.name).trim();
    }

    if (req.body.email !== undefined) {
      const nextEmail = String(req.body.email).toLowerCase().trim();

      const duplicate = await Admin.findOne({
        email: nextEmail,
        _id: { $ne: admin._id },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      admin.email = nextEmail;
    }

    admin.role = nextRole;

    if (req.body.isActive !== undefined) {
      admin.isActive = toBoolean(req.body.isActive, true);
    }

    admin.permissions = ensurePermissionsForRole(
      admin.role,
      req.body.permissions !== undefined ? req.body.permissions : admin.permissions
    );

    // Password optional in edit.
    if (req.body.password && String(req.body.password).trim().length > 0) {
      admin.password = req.body.password;
    }

    await admin.save();

    const updatedAdmin = await Admin.findById(admin._id).select("-password");
    const formattedUser = buildUserResponse(updatedAdmin);

    return res.json({
      success: true,
      message: "Admin user updated successfully",

      // Frontend compatibility.
      data: formattedUser,
      user: formattedUser,
    });
  } catch (error) {
    console.error("Update admin user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update admin user",
      error: error.message,
    });
  }
};

// @desc    Delete admin user
// @route   DELETE /api/admin/users/:id
// @access  Super Admin only
export const deleteAdminUser = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
    }

    if (String(req.user?._id || "") === String(admin._id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    if (normalizeRole(admin.role) === "super_admin") {
      const superAdminCount = await Admin.countDocuments({
        role: "super_admin",
      });

      if (superAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "At least one super_admin is required",
        });
      }
    }

    await Admin.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Admin user deleted successfully",
    });
  } catch (error) {
    console.error("Delete admin user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete admin user",
      error: error.message,
    });
  }
};
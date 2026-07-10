import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import {
  hasPermission,
  normalizeAdminUser,
  normalizeRole,
} from "../utils/adminAccess.js";

const isAdminPanelRequest = (req) => req.headers["x-admin-panel"] === "true";

// Protect private/admin routes using JWT token.
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback_secret"
      );

      const admin = await Admin.findById(decoded.id).select("-password");

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: "Not authorized, user not found",
        });
      }

      const user = normalizeAdminUser(admin);

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: "Account is inactive",
        });
      }

      // Keep both for old and new code compatibility.
      req.admin = user;
      req.user = user;

      return next();
    } catch (error) {
      console.error("Auth middleware error:", error);

      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    }
  }

  return res.status(401).json({
    success: false,
    message: "Not authorized, no token",
  });
};

// Role-based access control.
// Example: authorizeRoles("super_admin", "admin")
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const userRole = normalizeRole(req.user?.role);
    const allowedRoles = roles.map((role) => normalizeRole(role));

    if (!req.user || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return next();
  };
};

// Permission-based access control.
// Example: authorizePermission("blogs", "view")
export const authorizePermission = (moduleName, action = "view") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no user",
      });
    }

    // Super admin always has full access.
    if (normalizeRole(req.user.role) === "super_admin") {
      return next();
    }

    if (!hasPermission(req.user, moduleName, action)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return next();
  };
};

// Upload permission helper.
// Allows upload if user can create or edit that module.
export const authorizeUploadPermission = (moduleName) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no user",
      });
    }

    // Super admin always has full access.
    if (normalizeRole(req.user.role) === "super_admin") {
      return next();
    }

    const canCreate = hasPermission(req.user, moduleName, "create");
    const canEdit = hasPermission(req.user, moduleName, "edit");

    if (!moduleName || (!canCreate && !canEdit)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return next();
  };
};

// Public routes can stay public.
// But if request comes from admin panel, permission should be checked.
// Example use: optionalPermission("blogs", "view")
export const optionalPermission = (moduleName, action = "view") => {
  return (req, res, next) => {
    if (!isAdminPanelRequest(req)) {
      return next();
    }

    return protect(req, res, () =>
      authorizePermission(moduleName, action)(req, res, next)
    );
  };
};

// Generate JWT token for admin login.
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "4h",
  });
};
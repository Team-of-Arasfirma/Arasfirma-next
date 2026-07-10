import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
  createDefaultPermissions,
  normalizePermissions,
  normalizeRole,
} from "../utils/adminAccess.js";

const adminPermissionDefault = function () {
  return createDefaultPermissions(normalizeRole(this.role));
};

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["super_admin", "admin", "staff", "viewer", "editor"],
      default: "super_admin",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    permissions: {
      type: mongoose.Schema.Types.Mixed,
      default: adminPermissionDefault,
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  this.role = normalizeRole(this.role);
  this.permissions = normalizePermissions(this.role, this.permissions);

  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
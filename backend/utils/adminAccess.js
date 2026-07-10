export const MODULES = [
  "dashboard",
  "blogs",
  "products",
  "projects",
  "careers",
  "applications",
  "inquiries",
  "redirects",
  "users",
];

export const ACTIONS = ["view", "create", "edit", "delete"];

const makeModulePermissions = (view = false, create = false, edit = false, deletePermission = false) => ({
  view,
  create,
  edit,
  delete: deletePermission,
});

export const normalizeRole = (role) => {
  if (role === "editor") return "staff";
  if (["super_admin", "admin", "staff", "viewer"].includes(role)) return role;
  return "viewer";
};

export const createFullPermissions = () =>
  MODULES.reduce((acc, moduleName) => {
    acc[moduleName] = makeModulePermissions(true, true, true, true);
    return acc;
  }, {});

export const createDefaultPermissions = (role = "viewer") => {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "super_admin") {
    return createFullPermissions();
  }

  const base = MODULES.reduce((acc, moduleName) => {
    acc[moduleName] = makeModulePermissions(false, false, false, false);
    return acc;
  }, {});

  base.dashboard.view = true;

  if (normalizedRole === "admin") {
    ["blogs", "products", "projects", "careers", "applications", "inquiries"].forEach((moduleName) => {
      base[moduleName] = makeModulePermissions(true, true, true, true);
    });
    return base;
  }

  if (normalizedRole === "staff") {
    base.blogs = makeModulePermissions(true, true, true, false);
    return base;
  }

  return base;
};

export const normalizePermissions = (role, permissions) => {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "super_admin") {
    return createFullPermissions();
  }

  const defaults = createDefaultPermissions(normalizedRole);

  if (!permissions || typeof permissions !== "object") {
    return defaults;
  }

  return MODULES.reduce((acc, moduleName) => {
    const moduleDefaults = defaults[moduleName] || makeModulePermissions();
    const incoming = permissions[moduleName] || {};

    acc[moduleName] = {
      view: Boolean(
        typeof incoming.view === "boolean" ? incoming.view : moduleDefaults.view,
      ),
      create: Boolean(
        typeof incoming.create === "boolean" ? incoming.create : moduleDefaults.create,
      ),
      edit: Boolean(
        typeof incoming.edit === "boolean" ? incoming.edit : moduleDefaults.edit,
      ),
      delete: Boolean(
        typeof incoming.delete === "boolean" ? incoming.delete : moduleDefaults.delete,
      ),
    };

    return acc;
  }, {});
};

export const hasPermission = (user, moduleName, action = "view") => {
  if (!user || !moduleName || !ACTIONS.includes(action)) return false;

  const normalizedRole = normalizeRole(user.role);
  if (normalizedRole === "super_admin") return true;

  const permissions = normalizePermissions(normalizedRole, user.permissions);
  return Boolean(permissions?.[moduleName]?.[action]);
};

export const normalizeAdminUser = (admin) => {
  if (!admin) return null;

  const plainAdmin = typeof admin.toObject === "function" ? admin.toObject() : { ...admin };
  const role = normalizeRole(plainAdmin.role);
  const permissions = normalizePermissions(role, plainAdmin.permissions);

  return {
    ...plainAdmin,
    role,
    isActive: plainAdmin.isActive !== false,
    permissions,
  };
};

export const buildUserResponse = (admin) => {
  const normalized = normalizeAdminUser(admin);
  if (!normalized) return null;

  return {
    _id: normalized._id,
    name: normalized.name,
    email: normalized.email,
    role: normalized.role,
    isActive: normalized.isActive,
    permissions: normalized.permissions,
  };
};

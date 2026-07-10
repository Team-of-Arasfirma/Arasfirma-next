export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  STAFF: "staff",
  EDITOR: "editor",
  VIEWER: "viewer",
};

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

export const ROLE_LABELS = {
  super_admin: "Super Admin",
  admin: "Admin",
  staff: "Staff",
  editor: "Editor",
  viewer: "Viewer",
};

export const ADMIN_NAV_ITEMS = [
  { name: "Dashboard", path: "/admin", module: "dashboard" },
  { name: "Blogs", path: "/admin/blogs", module: "blogs" },
  { name: "Products", path: "/admin/products", module: "products" },
  { name: "Projects", path: "/admin/projects", module: "projects" },
  { name: "Careers", path: "/admin/careers", module: "careers" },
  { name: "Applications", path: "/admin/applications", module: "applications" },
  { name: "Inquiries", path: "/admin/inquiries", module: "inquiries" },
  { name: "Redirects", path: "/admin/redirects", module: "redirects" },

  // Admin Users page sidebar link.
  { name: "Admin Users", path: "/admin/users", module: "users" },
];

export const PAGE_PERMISSIONS = {
  "/admin": ["super_admin", "admin", "staff", "viewer"],
  "/admin/blogs": ["super_admin", "admin", "staff"],
  "/admin/products": ["super_admin", "admin"],
  "/admin/projects": ["super_admin", "admin"],
  "/admin/careers": ["super_admin", "admin"],
  "/admin/applications": ["super_admin", "admin"],
  "/admin/inquiries": ["super_admin", "admin"],
  "/admin/redirects": ["super_admin"],
  "/admin/users": ["super_admin"],
};

export const ACTION_PERMISSIONS = {
  dashboard: {
    view: ["super_admin", "admin", "staff", "viewer"],
    create: ["super_admin"],
    edit: ["super_admin"],
    delete: ["super_admin"],
  },
  blogs: {
    view: ["super_admin", "admin", "staff", "viewer"],
    create: ["super_admin", "admin", "staff"],
    edit: ["super_admin", "admin", "staff"],
    delete: ["super_admin", "admin"],
  },
  products: {
    view: ["super_admin", "admin", "viewer"],
    create: ["super_admin", "admin"],
    edit: ["super_admin", "admin"],
    delete: ["super_admin", "admin"],
  },
  projects: {
    view: ["super_admin", "admin", "viewer"],
    create: ["super_admin", "admin"],
    edit: ["super_admin", "admin"],
    delete: ["super_admin", "admin"],
  },
  careers: {
    view: ["super_admin", "admin", "viewer"],
    create: ["super_admin", "admin"],
    edit: ["super_admin", "admin"],
    delete: ["super_admin", "admin"],
  },
  applications: {
    view: ["super_admin", "admin"],
    create: ["super_admin", "admin"],
    edit: ["super_admin", "admin"],
    delete: ["super_admin", "admin"],
  },
  inquiries: {
    view: ["super_admin", "admin"],
    create: ["super_admin", "admin"],
    edit: ["super_admin", "admin"],
    delete: ["super_admin", "admin"],
  },
  redirects: {
    view: ["super_admin"],
    create: ["super_admin"],
    edit: ["super_admin"],
    delete: ["super_admin"],
  },
  users: {
    view: ["super_admin"],
    create: ["super_admin"],
    edit: ["super_admin"],
    delete: ["super_admin"],
  },
};

export const normalizeRole = (role) => {
  if (role === "editor") return "staff";

  if (["super_admin", "admin", "staff", "viewer"].includes(role)) {
    return role;
  }

  return "viewer";
};

export const getRoleFromUser = (user) => {
  if (!user) return null;

  if (typeof user === "string") {
    return normalizeRole(user);
  }

  return normalizeRole(user.role || user.user?.role);
};

const hasUserPermissionObject = (user) => {
  return Boolean(
    user &&
      typeof user === "object" &&
      user.permissions &&
      typeof user.permissions === "object"
  );
};

export const hasPermission = (user, moduleName, action = "view") => {
  const role = getRoleFromUser(user);

  if (!role || !moduleName || !ACTIONS.includes(action)) {
    return false;
  }

  // Super admin always full access.
  if (role === "super_admin") {
    return true;
  }

  // User-based permission first priority.
  // This allows checkbox permissions to control actual access.
  if (hasUserPermissionObject(user)) {
    return Boolean(user.permissions?.[moduleName]?.[action]);
  }

  // Fallback for old users without permissions object.
  const permission = ACTION_PERMISSIONS[moduleName];
  const allowedRoles = permission?.[action] || [];

  return allowedRoles.includes(role);
};

export const canView = (user, moduleName) => {
  return hasPermission(user, moduleName, "view");
};

export const canCreate = (user, moduleName) => {
  return hasPermission(user, moduleName, "create");
};

export const canEdit = (user, moduleName) => {
  return hasPermission(user, moduleName, "edit");
};

export const canDelete = (user, moduleName) => {
  return hasPermission(user, moduleName, "delete");
};

export const canAccessPage = (roleOrUser, path) => {
  if (!path) return false;

  const navItem = ADMIN_NAV_ITEMS.find((item) => item.path === path);

  if (navItem && typeof roleOrUser === "object") {
    return canView(roleOrUser, navItem.module);
  }

  const role = getRoleFromUser(roleOrUser);

  if (!role) return false;

  if (role === "super_admin") return true;

  const allowed = PAGE_PERMISSIONS[path];

  if (!allowed) return false;

  return allowed.includes(role);
};

export const createEmptyPermissions = () => {
  const permissions = {};

  MODULES.forEach((moduleName) => {
    permissions[moduleName] = {
      view: false,
      create: false,
      edit: false,
      delete: false,
    };
  });

  return permissions;
};

export const createFullPermissions = () => {
  const permissions = {};

  MODULES.forEach((moduleName) => {
    permissions[moduleName] = {
      view: true,
      create: true,
      edit: true,
      delete: true,
    };
  });

  return permissions;
};
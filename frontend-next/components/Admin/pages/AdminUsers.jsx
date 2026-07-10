"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/Admin/context/AuthContext";

const API_BASE_URL = `${
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
}/api`;

const MODULES = [
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

const ACTIONS = ["view", "create", "edit", "delete"];

const ROLE_OPTIONS = ["super_admin", "admin", "staff", "viewer"];

const createEmptyPermissions = () => {
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

const createSuperAdminPermissions = () => {
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

const getDefaultForm = () => ({
  name: "",
  email: "",
  password: "",
  role: "staff",
  isActive: true,
  permissions: createEmptyPermissions(),
});

const getToken = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") || "";
};

const getAuthHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const formatRole = (role) => {
  if (!role) return "-";

  return role
    .split("_")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
};

const AdminUsers = () => {
  const { user } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(getDefaultForm());
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isSuperAdmin = user?.role === "super_admin";

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch admin users");
      }

      setUsers(data?.data || data?.users || []);
    } catch (error) {
      console.error("Admin users fetch error:", error);
      alert(error.message || "Failed to fetch admin users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [isSuperAdmin]);

  const openAddForm = () => {
    setEditingUser(null);
    setFormData(getDefaultForm());
    setShowPassword(false);
    setShowForm(true);
  };

  const openEditForm = (adminUser) => {
    setEditingUser(adminUser);
    setShowPassword(false);

    setFormData({
      name: adminUser?.name || "",
      email: adminUser?.email || "",
      password: "",
      role: adminUser?.role || "staff",
      isActive: adminUser?.isActive ?? true,
      permissions:
        adminUser?.role === "super_admin"
          ? createSuperAdminPermissions()
          : adminUser?.permissions || createEmptyPermissions(),
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingUser(null);
    setShowPassword(false);
    setFormData(getDefaultForm());
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => {
      const nextData = {
        ...prev,
        [field]: value,
      };

      if (field === "role" && value === "super_admin") {
        nextData.permissions = createSuperAdminPermissions();
      }

      return nextData;
    });
  };

  const handlePermissionChange = (moduleName, action) => {
    if (formData.role === "super_admin") return;

    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [moduleName]: {
          ...prev.permissions?.[moduleName],
          [action]: !prev.permissions?.[moduleName]?.[action],
        },
      },
    }));
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Name and email are required");
      return;
    }

    if (!editingUser && !formData.password.trim()) {
      alert("Password is required for new user");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        isActive: formData.isActive,
        permissions:
          formData.role === "super_admin"
            ? createSuperAdminPermissions()
            : formData.permissions,
      };

      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      const url = editingUser
        ? `${API_BASE_URL}/admin/users/${editingUser._id}`
        : `${API_BASE_URL}/admin/users`;

      const method = editingUser ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to save user");
      }

      await fetchUsers();
      closeForm();
    } catch (error) {
      console.error("Admin user save error:", error);
      alert(error.message || "Failed to save user");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (adminUser) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${adminUser.email}?`
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${adminUser._id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to delete user");
      }

      await fetchUsers();
    } catch (error) {
      console.error("Admin user delete error:", error);
      alert(error.message || "Failed to delete user");
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-8">
        <div className="rounded-xl border border-red-100 bg-red-50 p-6">
          <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
          <p className="mt-2 text-sm text-red-500">
            Only Super Admin can manage admin users.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Admin Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage staff access and permissions.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="rounded-lg bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700"
        >
          Add User
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="bg-slate-900 text-left text-sm text-white">
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email / Username</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-8 text-center text-gray-500"
                  >
                    Loading admin users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-8 text-center text-gray-500"
                  >
                    No admin users found.
                  </td>
                </tr>
              ) : (
                users.map((adminUser) => (
                  <tr key={adminUser._id} className="border-t border-gray-100">
                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                      {adminUser.name}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {adminUser.email}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {formatRole(adminUser.role)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          adminUser.isActive
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {adminUser.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(adminUser)}
                          className="rounded-full bg-gray-100 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteUser(adminUser)}
                          className="rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8">
          <div className="w-full max-w-6xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="mb-1 text-xs font-black uppercase tracking-[0.3em] text-red-500">
                  {editingUser ? "Edit User" : "Add User"}
                </p>

                <h2 className="text-2xl font-black text-gray-900">
                  {editingUser ? "Update Admin User" : "Create Admin User"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-gray-800 hover:bg-gray-200"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveUser}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-800">
                    Name
                  </label>

                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-800">
                    Email / Username
                  </label>

                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-800">
                    Password{" "}
                    {editingUser && (
                      <span className="font-normal text-gray-400">
                        (leave empty to keep same)
                      </span>
                    )}
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleFieldChange("password", e.target.value)
                      }
                      placeholder={
                        editingUser
                          ? "Leave empty to keep same password"
                          : "Enter password"
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 text-sm text-gray-900 outline-none focus:border-red-500"
                      required={!editingUser}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-red-600 hover:text-red-700"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-800">
                    Role
                  </label>

                  <select
                    value={formData.role}
                    onChange={(e) => handleFieldChange("role", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-red-500"
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role} value={role}>
                        {formatRole(role)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="mt-5 flex items-center gap-2 text-sm font-bold text-gray-800">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    handleFieldChange("isActive", e.target.checked)
                  }
                />
                Active
              </label>

              <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-left text-sm text-white">
                        <th className="px-5 py-4">Module</th>
                        {ACTIONS.map((action) => (
                          <th key={action} className="px-5 py-4 capitalize">
                            {action}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {MODULES.map((moduleName) => (
                        <tr
                          key={moduleName}
                          className="border-t border-gray-100"
                        >
                          <td className="px-5 py-4 text-sm font-bold capitalize text-gray-800">
                            {moduleName}
                          </td>

                          {ACTIONS.map((action) => (
                            <td key={action} className="px-5 py-4">
                              <input
                                type="checkbox"
                                checked={
                                  formData.role === "super_admin"
                                    ? true
                                    : Boolean(
                                        formData.permissions?.[moduleName]?.[
                                          action
                                        ]
                                      )
                                }
                                disabled={formData.role === "super_admin"}
                                onChange={() =>
                                  handlePermissionChange(moduleName, action)
                                }
                                className="h-4 w-4"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save User"}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg bg-gray-100 px-6 py-3 text-sm font-bold text-gray-800 hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
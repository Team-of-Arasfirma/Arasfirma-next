"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import {
  ADMIN_NAV_ITEMS,
  hasPermission,
  normalizeRole,
} from "@/lib/adminPermissions";

const getFirstAllowedPath = (user) => {
  if (!user) return "/login";

  const firstAllowed = ADMIN_NAV_ITEMS.find((item) =>
    hasPermission(user, item.module, "view")
  );

  return firstAllowed?.path || "/login";
};

const PrivateRoute = ({
  children,
  allowedRoles = null,
  moduleName = null,
  action = "view",
}) => {
  const { user, admin, loading } = useAuth();

  const activeUser = user || admin;
  const role = normalizeRole(activeUser?.role);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-red-600" />
      </div>
    );
  }

  if (!activeUser) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }

    return null;
  }

  let isAllowed = false;

  if (moduleName) {
    isAllowed = hasPermission(activeUser, moduleName, action);
  } else if (Array.isArray(allowedRoles)) {
    isAllowed = allowedRoles.map(normalizeRole).includes(role);
  } else {
    isAllowed = true;
  }

  const firstAllowedPath = getFirstAllowedPath(activeUser);

  if (!isAllowed) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
            ⚠️
          </div>

          <h2 className="text-2xl font-black text-gray-900">Access Denied</h2>

          <p className="mt-3 text-sm text-gray-500">
            Your account role <b>({role})</b> does not have permission to view
            this page.
          </p>

          <Link
            href={firstAllowedPath}
            className="mt-7 block rounded-lg bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700"
          >
            Back to Allowed Page
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
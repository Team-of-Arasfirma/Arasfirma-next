"use client";

import PrivateRoute from "@/components/Admin/routes/PrivateRoute";
import AdminUsers from "@/components/Admin/pages/AdminUsers";

export default function AdminUsersPage() {
  return (
    <PrivateRoute moduleName="users" action="view">
      <AdminUsers />
    </PrivateRoute>
  );
}
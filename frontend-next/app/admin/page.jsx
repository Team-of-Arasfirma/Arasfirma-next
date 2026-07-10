"use client";

import PrivateRoute from "@/components/Admin/routes/PrivateRoute";
import Dashboard from "@/components/Admin/pages/Dashboard";

export default function AdminDashboardPage() {
  return (
    <PrivateRoute moduleName="dashboard" action="view">
      <Dashboard />
    </PrivateRoute>
  );
}
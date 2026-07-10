"use client";

import PrivateRoute from "@/components/Admin/routes/PrivateRoute";
import AdminApplications from "@/components/Admin/pages/AdminApplications";

export default function AdminApplicationsPage() {
  return (
    <PrivateRoute moduleName="applications" action="view">
      <AdminApplications />
    </PrivateRoute>
  );
}
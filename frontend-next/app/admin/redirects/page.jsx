"use client";

import PrivateRoute from "@/components/Admin/routes/PrivateRoute";
import Redirects from "@/components/Admin/pages/Redirects";

export default function AdminRedirectsPage() {
  return (
    <PrivateRoute moduleName="redirects" action="view">
      <Redirects />
    </PrivateRoute>
  );
}
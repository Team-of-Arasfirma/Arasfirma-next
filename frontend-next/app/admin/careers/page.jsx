"use client";

import PrivateRoute from "@/components/Admin/routes/PrivateRoute";
import Careers from "@/components/Admin/pages/Careers";

export default function AdminCareersPage() {
  return (
    <PrivateRoute moduleName="careers" action="view">
      <Careers />
    </PrivateRoute>
  );
}
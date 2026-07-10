"use client";

import PrivateRoute from "@/components/Admin/routes/PrivateRoute";
import Inquiries from "@/components/Admin/pages/Inquiries";

export default function AdminInquiriesPage() {
  return (
    <PrivateRoute moduleName="inquiries" action="view">
      <Inquiries />
    </PrivateRoute>
  );
}
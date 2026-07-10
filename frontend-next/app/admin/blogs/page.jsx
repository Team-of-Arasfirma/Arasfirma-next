"use client";

import PrivateRoute from "@/components/Admin/routes/PrivateRoute";
import Blogs from "@/components/Admin/pages/Blogs";

export default function AdminBlogsPage() {
  return (
    <PrivateRoute moduleName="blogs" action="view">
      <Blogs />
    </PrivateRoute>
  );
}
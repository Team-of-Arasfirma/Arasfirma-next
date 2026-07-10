"use client";

import PrivateRoute from "@/components/Admin/routes/PrivateRoute";
import Projects from "@/components/Admin/pages/Projects";

export default function AdminProjectsPage() {
  return (
    <PrivateRoute moduleName="projects" action="view">
      <Projects />
    </PrivateRoute>
  );
}
"use client";

import PrivateRoute from "@/components/Admin/routes/PrivateRoute";
import Products from "@/components/Admin/pages/Products";

export default function AdminProductsPage() {
  return (
    <PrivateRoute moduleName="products" action="view">
      <Products />
    </PrivateRoute>
  );
}
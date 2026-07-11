export const metadata = {
  title: "Admin Panel",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }) {
  return children;
}


import AdminLayout from "@/components/Admin/layout/AdminLayout";

export default function Layout({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}

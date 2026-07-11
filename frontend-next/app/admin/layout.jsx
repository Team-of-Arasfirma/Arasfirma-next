import AdminShell from "@/components/Admin/layout/AdminLayout";

export const metadata = {
  title: "Admin Panel",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
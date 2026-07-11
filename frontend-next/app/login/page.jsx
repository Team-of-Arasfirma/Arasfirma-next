export const metadata = {
  title: "Admin Login",
  description: "Admin login page for Arasfirma website management.",
  robots: {
    index: false,
    follow: false,
  },
};

import Login from "@/components/Admin/pages/Login";

export default function Page() {
  return <Login />;
}  
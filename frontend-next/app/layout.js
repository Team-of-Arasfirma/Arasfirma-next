import { Poppins } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/components/Admin/context/AuthContext";
import SiteShell from "@/components/SiteShell";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "PUF Panel Manufacturer | Arasfirma",
  description:
    "Arasfirma is a trusted PUF panel manufacturer providing insulated roofing, wall panels, cold storage panels, and industrial building solutions.",
  icons: {
    icon: "/assets/logo/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <AuthProvider>
          <SiteShell>{children}</SiteShell>
          <Toaster position="top-center" reverseOrder={false} />
        </AuthProvider>
      </body>
    </html>
  );
}

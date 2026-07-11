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
  metadataBase: new URL("https://arasfirma.com"),

  title: {
    default: "PUF Panel Manufacturer in Tamil Nadu | Arasfirma",
    template: "%s | Arasfirma",
  },

  description:
    "Arasfirma is a leading PUF panel manufacturer in Tamil Nadu, offering sandwich panels, PUF roofing panels, wall panels, clean room panels, cold storage panels, and industrial roofing solutions.",

  keywords: [
    "PUF panel manufacturer",
    "PUF panel manufacturer in Tamil Nadu",
    "sandwich panel manufacturer",
    "PUF roofing panels",
    "PUF wall panels",
    "insulated roofing panels",
    "clean room panels",
    "cold storage panels",
    "industrial roofing solutions",
  ],

  alternates: {
    canonical: "https://arasfirma.com",
  },

  openGraph: {
    title: "PUF Panel Manufacturer in Tamil Nadu | Arasfirma",
    description:
      "Arasfirma provides high-quality PUF panels, sandwich panels, roofing panels, wall panels, clean room panels, and cold storage panel solutions.",
    url: "https://arasfirma.com",
    siteName: "Arasfirma",
    images: [
      {
        url: "/assets/logo/logo.png",
        width: 800,
        height: 600,
        alt: "Arasfirma PUF Panel Manufacturer",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "PUF Panel Manufacturer in Tamil Nadu | Arasfirma",
    description:
      "Leading PUF panel manufacturer offering insulated roofing, wall panels, clean room panels, cold storage panels, and industrial building solutions.",
    images: ["/assets/logo/logo.png"],
  },

  icons: {
    icon: "/assets/logo/logo.png",
  },

  robots: {
    index: true,
    follow: true,
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
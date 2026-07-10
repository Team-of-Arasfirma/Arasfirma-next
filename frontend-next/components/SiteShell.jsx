"use client";

import { usePathname } from "next/navigation";
import GlobalEffects from "@/components/GlobalEffects";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const isAdminOrLoginRoute = (pathname) =>
  pathname?.startsWith("/admin") || pathname === "/login";

export default function SiteShell({ children }) {
  const pathname = usePathname();

  if (isAdminOrLoginRoute(pathname)) {
    return children;
  }

  return (
    <>
      <GlobalEffects />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

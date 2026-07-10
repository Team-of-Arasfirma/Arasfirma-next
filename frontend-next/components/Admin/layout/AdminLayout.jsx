"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { ADMIN_NAV_ITEMS, ROLE_LABELS, canView } from "@/lib/adminPermissions";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout, user, admin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && !admin) {
      router.replace("/login");
    }
  }, [admin, loading, router, user]);

  const handleLogout = () => {
    logout();
  };

  const activeUser = user || admin;
  const role = activeUser?.role || "super_admin";
  const roleLabel = ROLE_LABELS[role] || ROLE_LABELS.viewer || "Viewer";
  const filteredLinks = ADMIN_NAV_ITEMS.filter((link) => canView(activeUser, link.module));

  if (loading || (!user && !admin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white w-full md:w-64 flex-shrink-0 transition-all duration-300 ${sidebarOpen ? "block" : "hidden md:block"} flex flex-col`}
      >
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold tracking-wider">Admin Panel</h2>
          <button
            className="md:hidden text-gray-400"
            onClick={() => setSidebarOpen(false)}
          >
            ?
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {filteredLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`block px-4 py-3 rounded transition-colors ${
                pathname === link.path
                  ? "bg-red-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center z-10 gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none md:hidden"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="hidden md:flex flex-col min-w-0">
            <h1 className="text-xl font-semibold text-gray-800 truncate">
              Welcome, {activeUser?.name || "Admin"}
            </h1>
            <p className="text-sm text-gray-500 truncate">
              User: {activeUser?.email || "No email available"}
            </p>
          </div>

          <div className="flex items-center space-x-3 ml-auto">
            <span className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
              Role: {roleLabel}
            </span>
            <div className="hidden lg:flex flex-col text-right leading-tight">
              <span className="text-sm font-medium text-gray-800 truncate max-w-[220px]">
                {activeUser?.name || "Admin"}
              </span>
              <span className="text-xs text-gray-500 truncate max-w-[220px]">
                {activeUser?.email || ""}
              </span>
            </div>
            <Link
              href="/"
              target="_blank"
              className="text-sm text-blue-600 hover:underline whitespace-nowrap"
            >
              View Live Website
            </Link>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-auto bg-gray-50 p-6">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;

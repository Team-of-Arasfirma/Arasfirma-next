"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PRODUCTS_DROPDOWN = [
  { label: "Roof Panel", path: "/products/roof-panel", icon: "🏠" },
  { label: "Mono Wall", path: "/products/mono-wall", icon: "🧱" },
  { label: "Concealed Panel", path: "/products/concealed", icon: "✨" },
];

const Navbar = () => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Project", path: "/projects" },
    { label: "Blog", path: "/blog" },
    { label: "Career", path: "/career" },
    { label: "Contact", path: "/contact" },
  ];

  const getLinkClass = (path) => {
    const isActive = pathname === path;

    return `text-sm font-medium transition-all duration-200 ${
      isActive
        ? "text-red-600 font-semibold border-b-2 border-red-600 pb-0.5"
        : "text-gray-700 hover:text-red-600"
    }`;
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
        <Link href="/">
          <img
            src="/assets/logo/logo.png"
            alt="Arasfirma"
            className="h-12 sm:h-14 md:h-16 w-auto object-contain"
          />
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          <li>
            <Link href="/" className={getLinkClass("/")}>
              Home
            </Link>
          </li>

          <li>
            <Link href="/about" className={getLinkClass("/about")}>
              About
            </Link>
          </li>

          <li
            className="relative"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <button
              type="button"
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                pathname.startsWith("/products")
                  ? "text-red-600"
                  : "text-gray-700 hover:text-red-600"
              }`}
            >
              Products
              <span
                className={`text-xs transition-transform duration-300 ${
                  showDropdown ? "rotate-180" : "rotate-0"
                }`}
              >
                ▾
              </span>
            </button>

            <div
              className={`absolute left-0 top-full pt-3 transition-all duration-300 ease-out ${
                showDropdown
                  ? "opacity-100 translate-y-0 scale-100 visible"
                  : "opacity-0 -translate-y-2 scale-95 invisible"
              }`}
            >
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 w-56 py-2">
                {PRODUCTS_DROPDOWN.map((p) => (
                  <Link
                    key={p.path}
                    href={p.path}
                    className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    <span>{p.icon}</span>
                    <span className="font-medium">{p.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </li>

          {navLinks.slice(2).map((link) => (
            <li key={link.label}>
              <Link href={link.path} className={getLinkClass(link.path)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="md:hidden flex flex-col gap-1.5 cursor-pointer p-1"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-gray-800 transition ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-gray-800 transition ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-gray-800 transition ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      <div
        className="md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? "600px" : "0" }}
      >
        <ul className="flex flex-col px-6 py-4 gap-4">
          <li>
            <Link
              href="/"
              className={getLinkClass("/")}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              href="/about"
              className={getLinkClass("/about")}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
          </li>

          <li>
            <p className="text-xs font-bold uppercase text-gray-400 mb-2">
              Products
            </p>
            {PRODUCTS_DROPDOWN.map((p) => (
              <Link
                key={p.path}
                href={p.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 py-1.5 text-sm text-gray-700 hover:text-red-600"
              >
                <span>{p.icon}</span> {p.label}
              </Link>
            ))}
          </li>

          {navLinks.slice(2).map((link) => (
            <li key={link.label}>
              <Link
                href={link.path}
                className={getLinkClass(link.path)}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

// ✅ public folder — no imports needed, just use /assets/Application/filename

const projects = [
  {
    id: 1,
    name: "Industrial Shed ",
    category: "Industrial Building",
    image: "/assets/Application/app1.JPG",
  },

  {
    id: 2,
    name: "Commercial Building ",
    category: "Commercial Building",
    image: "/assets/Application/app2.png",
  },

  {
    id: 3,
    name: "Commercial Building",
    category: "Commercial Building",
    image: "/assets/Application/app3.jpeg",
  },

  {
    id: 5,
    name: "Cold Storage",
    category: "Cold Storage",
    image: "/assets/Application/app5.jpeg",
  },

  {
    id: 6,
    name: "Portable Cabin  ",
    category: "Commercial Building",
    image: "/assets/Application/app6.png",
  },
];

const categories = [
  "All",

  "Industrial Building",

  "Warehouses",

  "Commercial Building",

  "Cold Storage",

  "Agriculture",
];

const ProjectGallery = () => {
  const router = useRouter();

  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <section className="w-full bg-white">
      {/* ── Page Header ── */}

      <div className="w-full pt-40 pb-10 px-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}

          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <button
              onClick={() => router.push("/")}

              className="hover:text-red-500 transition-colors"
            >
              Home
            </button>

            <span>›</span>

            <span className="text-red-500 font-semibold">Project</span>
          </div>

          <h1
            data-animate="up"

            className="text-4xl font-black uppercase text-gray-900"
          >
            Project
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* ── Filter Tabs ── */}

        <div
          data-animate="up"

          className="flex flex-wrap items-center gap-4 mb-10 bg-gray-900 rounded-xl p-2 align-center justify-center"
        >
          {categories.map((cat) => (
            <button
              key={cat}

              onClick={() => setActive(cat)}

              className="text-sm font-semibold px-5 py-2 rounded-lg transition-all duration-200"

              style={{
                background: active === cat ? "#dc2626" : "transparent",

                color: active === cat ? "white" : "#9ca3af",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Project Grid ── */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((proj, i) => (
            <div
              key={proj.id}

              data-animate="zoom"

              data-delay={i * 80}

              className="relative rounded-2xl overflow-hidden cursor-pointer group"

              style={{ aspectRatio: "4/3" }}
            >
              {/* Image */}

              <img
                src={proj.image}

                alt={proj.name}

                draggable={false}

                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"

                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&q=70";
                }}
              />

              {/* Dark overlay on hover */}

              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"

                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.80) 0%, transparent 60%)",
                }}
              />

              {/* ✅ Project name slides up on hover */}

              <div className="absolute bottom-0 left-0 right-0 px-5 py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                <p className="text-white font-black text-base uppercase tracking-wide">
                  {proj.name}
                </p>

                <p className="text-red-300 text-xs font-semibold mt-1">
                  {proj.category}
                </p>
              </div>

              {/* Red bottom bar */}

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 group-hover:h-1.5 transition-all duration-300" />
            </div>
          ))}
        </div>

        {/* Empty state */}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🏗️</p>

            <p className="text-gray-400 text-lg font-semibold">
              No projects in this category yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectGallery;

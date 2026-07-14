"use client";

// src/pages/Blog/Blog.jsx

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  fetchBlogs,
  isPublishedBlog,
  normalizeCategory,
} from "@/lib/services/blogService";

const CATEGORIES = [
  "All",
  "Roofing",
  "Cold Storage",
  "Installation",
  "Poultry Farming",
  "Agriculture",
];

const badgeStyle = (category) => {
  const map = {
    Roofing: { bg: "bg-red-500", text: "Roofing" },
    "Cold Storage": { bg: "bg-cyan-500", text: "Cold Storage" },
    Installation: { bg: "bg-green-500", text: "Installation" },
    "Poultry Farming": {
      bg: "bg-yellow-500",
      text: "Poultry Farming",
    },
    Agriculture: { bg: "bg-lime-600", text: "Agriculture" },
    General: { bg: "bg-gray-500", text: "General" },
  };

  return map[category] || { bg: "bg-gray-500", text: category };
};

const decodeHtmlEntities = (value) => {
  if (!value) return "";

  if (typeof window === "undefined") {
    return value
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

  const txt = document.createElement("textarea");
  txt.innerHTML = value;
  return txt.value;
};

const getCleanPreview = (content) => {
  if (!content) return "";

  let clean = decodeHtmlEntities(content);

  // Remove HTML tags.
  clean = clean.replace(/<[^>]+>/g, "");

  // Clean encoded characters and extra spaces.
  clean = clean
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  return clean;
};

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
    <div className="w-full h-56 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-3 bg-gray-100 rounded w-24" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-2/3" />
    </div>
  </div>
);

export default function Blog({
  initialBlogs = [],
  initialPagination = {},
}) {
  const firstBlogs = Array.isArray(initialBlogs)
    ? initialBlogs.filter((blog) => blog && blog.published !== false)
    : [];

  const [blogs, setBlogs] = useState(firstBlogs);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(initialPagination || {});
  const [totalArticles, setTotalArticles] = useState(
    initialPagination?.total || firstBlogs.length || 0,
  );
  const [latestYear, setLatestYear] = useState(() => {
    if (firstBlogs.length === 0) return new Date().getFullYear();

    const years = firstBlogs
      .map((blog) => new Date(blog.createdAt).getFullYear())
      .filter(Boolean);

    return years.length > 0 ? Math.max(...years) : new Date().getFullYear();
  });

  const LIMIT = 9;

  useEffect(() => {
    let isActive = true;

    const loadBlogs = async () => {
      // First page without filter already came from server.
      // So we avoid showing skeleton in initial HTML.
      const shouldUseServerBlogs =
        page === 1 &&
        search.trim() === "" &&
        activeCategory === "All" &&
        firstBlogs.length > 0;

      if (shouldUseServerBlogs) {
        setBlogs(firstBlogs);
        setPagination(initialPagination || {});
        setTotalArticles(initialPagination?.total || firstBlogs.length || 0);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const params = { published: true, page, limit: LIMIT };

        if (search) params.search = search;
        if (activeCategory !== "All") params.category = activeCategory;

        const { blogs: apiBlogs, pagination: apiPagination } =
          await fetchBlogs(params);

        const publishedBlogs = apiBlogs.filter(isPublishedBlog);

        const filteredBlogs = publishedBlogs.filter((blog) => {
          const matchesSearch =
            !search ||
            [blog.title, blog.content, blog.category, blog.author]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
              .includes(search.toLowerCase());

          const matchesCategory =
            activeCategory === "All" ||
            normalizeCategory(blog.category) ===
              normalizeCategory(activeCategory);

          return matchesSearch && matchesCategory;
        });

        if (!isActive) return;

        setBlogs(filteredBlogs);
        setPagination(apiPagination || {});
        setTotalArticles(
          apiPagination?.total || publishedBlogs.length || filteredBlogs.length,
        );

        if (publishedBlogs.length > 0) {
          const years = publishedBlogs
            .map((blog) => new Date(blog.createdAt).getFullYear())
            .filter(Boolean);

          if (years.length > 0) {
            setLatestYear(Math.max(...years));
          }
        }
      } catch (err) {
        if (isActive) {
          console.error("Failed to fetch blogs:", err);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadBlogs();

    return () => {
      isActive = false;
    };
  }, [page, search, activeCategory]);

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section
        className="relative bg-white py-16 px-4 overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-gray-600 transition-colors">
              Home
            </Link>

            <span>›</span>

            <span className="text-red-500 font-semibold">Blog</span>
          </nav>

          <div className="mb-4">
            <span className="border border-red-500 text-red-500 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
              Learn New Technology
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            <span className="text-gray-800">OUR </span>
            <span className="text-red-500">BLOG</span>
          </h1>

          <p className="mt-4 text-gray-500 text-base max-w-xl leading-relaxed">
            Stay updated with the latest insights, guides, and trends in PUF
            panel technology, insulation solutions, and modern construction.
          </p>

          <div className="flex items-center gap-10 mt-8">
            <div>
              <p className="text-3xl font-extrabold text-red-500">
                {loading ? "—" : `${totalArticles}+`}
              </p>
              <p className="text-sm text-gray-400 mt-0.5">Articles Published</p>
            </div>

            <div>
              <p className="text-3xl font-extrabold text-red-500">
                {CATEGORIES.length - 1}+
              </p>
              <p className="text-sm text-gray-400 mt-0.5">Categories</p>
            </div>

            <div>
              <p className="text-3xl font-extrabold text-red-500">
                {loading ? "—" : latestYear}
              </p>
              <p className="text-sm text-gray-400 mt-0.5">Latest Year</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY FILTER + SEARCH */}
      <section className="max-w-7xl mx-auto px-4 pt-10">
        <div className="flex flex-wrap items-center gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}

          <div className="ml-auto relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search articles..."
              className="pl-9 pr-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 w-52"
            />
          </div>
        </div>
      </section>

      {/* BLOG GRID */}
      <section className="max-w-7xl mx-auto px-4 py-10 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5">
              <svg
                className="w-10 h-10 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-gray-700">
              No articles found
            </h3>

            <p className="text-gray-400 mt-2 text-sm">
              {search
                ? `No results for "${search}"`
                : activeCategory !== "All"
                  ? `No blogs in "${activeCategory}" category yet.`
                  : "Check back soon for new content."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs
                .filter((blog) => blog?.slug)
                .map((blog) => {
                  const badge = badgeStyle(blog.category);

                  return (
                    <Link
                      key={blog._id || blog.slug}
                      href={`/puf-panels/${blog.slug}`}
                      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                    >
                      <div className="relative w-full h-56 overflow-hidden bg-gray-100">
                        {blog.image ? (
                          <img
                            src={blog.image}
                            alt={blog.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://placehold.co/400x224?text=No+Image";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100">
                            <svg
                              className="w-12 h-12 text-red-200"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M4 16l4-4a3 3 0 014 0l4 4m0 0l-1-1a3 3 0 014 0l3 3"
                              />
                            </svg>
                          </div>
                        )}

                        {blog.category && (
                          <span
                            className={`absolute top-3 left-3 ${badge.bg} text-white text-xs font-bold px-3 py-1 rounded-full shadow`}
                          >
                            {badge.text}
                          </span>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>

                          {blog.createdAt
                            ? new Date(blog.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : ""}
                        </div>

                        <h2 className="font-bold text-gray-800 text-base leading-snug line-clamp-2 group-hover:text-red-500 transition-colors">
                          {blog.title}
                        </h2>

                        <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                          {getCleanPreview(blog.content)}
                        </p>

                        <div className="flex items-center gap-2 mt-4 text-red-500 font-bold text-sm group-hover:gap-3 transition-all">
                          Read More
                          <span className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>

            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-14">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-5 py-2 border border-gray-200 rounded-full text-sm text-gray-600 hover:border-red-400 hover:text-red-500 disabled:opacity-40 transition-colors"
                >
                  ← Previous
                </button>

                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors ${
                      page === i + 1
                        ? "bg-red-500 text-white"
                        : "border border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-500"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setPage((p) => Math.min(pagination.pages, p + 1))
                  }
                  disabled={page === pagination.pages}
                  className="px-5 py-2 border border-gray-200 rounded-full text-sm text-gray-600 hover:border-red-400 hover:text-red-500 disabled:opacity-40 transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
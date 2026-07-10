"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = `${
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
}/api`;

// This function uses the existing backend API.
// Backend code change panna vendam.
async function fetchBlogs({ published = true, page = 1, limit = 3 }) {
  const res = await fetch(
    `${API_BASE_URL}/blogs?published=${published}&page=${page}&limit=${limit}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }

  const data = await res.json();

  return {
    blogs: data.blogs || data.data || [],
  };
}

// This keeps only published blogs.
// Backend-la published/status field different-a irundha adjust panna mudiyum.
function isPublishedBlog(blog) {
  return blog?.published === true || blog?.status === "published";
}

const BlogSection = () => {
  const router = useRouter();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const { blogs: apiBlogs } = await fetchBlogs({
          published: true,
          page: 1,
          limit: 3,
        });

        setBlogs(apiBlogs.filter(isPublishedBlog).slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  const getPreview = (content) => {
    if (!content) return "";

    // Decode HTML entities safely in browser.
    const textarea = document.createElement("textarea");
    textarea.innerHTML = content;
    let decoded = textarea.value;

    // Remove HTML tags.
    decoded = decoded.replace(/<[^>]*>/g, "");

    // Clean extra spaces.
    decoded = decoded.replace(/\s+/g, " ").trim();

    return decoded.substring(0, 120);
  };

  const goToBlogDetails = (slug) => {
    if (!slug) return;

    // Arasfirma SEO blog route.
    router.push(`/puf-panels/${slug}`);
  };

  return (
    <section className="w-full py-12 md:py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 md:mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
              Learn New Technology
            </p>

            <h2 className="text-xl sm:text-2xl font-black uppercase text-gray-900">
              Read Our Blog
            </h2>

            <div className="w-12 h-1 bg-red-600 rounded mt-2" />
          </div>

          <button
            type="button"
            onClick={() => router.push("/blog")}
            className="shrink-0 text-sm font-semibold text-red-600 border border-red-200 px-5 py-2 rounded-full hover:bg-red-600 hover:text-white transition-all duration-300"
          >
            View More →
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse"
              >
                <div className="h-48 bg-gray-200" />
                <div className="p-5">
                  <div className="h-3 bg-gray-200 rounded w-24 mb-3" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-4/5 mb-3" />
                  <div className="h-3 bg-gray-100 rounded mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-white">
            No blogs found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {blogs.map((blog) => (
              <div
                key={blog._id || blog.slug}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                onClick={() => goToBlogDetails(blog.slug)}
              >
                {/* Image */}
                <div className="h-48 bg-gray-200 overflow-hidden">
                  {blog.image ? (
                    <img
                      src={blog.image}
                      alt={blog.title || "Blog image"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/600x400?text=Blog+Image";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
                      Blog Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-xs text-gray-400 mb-2">
                    {blog.createdAt
                      ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : ""}
                  </p>

                  <p className="text-sm font-black text-gray-900 leading-snug mb-2 line-clamp-2">
                    {blog.title}
                  </p>

                  <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">
                    {getPreview(blog.content)}...
                  </p>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToBlogDetails(blog.slug);
                    }}
                    className="bg-red-500 text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-red-600 active:scale-95 transition-all duration-200"
                  >
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
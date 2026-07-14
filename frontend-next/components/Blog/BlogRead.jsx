"use client";

// src/pages/Blog/BlogRead.jsx

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  fetchBlogBySlug,
  fetchBlogs,
  isPublishedBlog,
} from "@/lib/services/blogService";

const sanitizeHtml = (html = "") => {
  if (!html || typeof window === "undefined") return html;

  const doc = new DOMParser().parseFromString(html, "text/html");

  doc
    .querySelectorAll("script, iframe, object, embed, link, meta")
    .forEach((el) => el.remove());

  doc.querySelectorAll("*").forEach((el) => {
    [...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim();

      if (
        name.startsWith("on") ||
        name === "srcdoc" ||
        /^javascript:/i.test(value)
      ) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return doc.body.innerHTML;
};

const Skeleton = () => (
  <div className="animate-pulse max-w-4xl mx-auto px-4 pt-28 pb-14">
    <div className="h-5 bg-gray-200 rounded w-32 mb-6" />
    <div className="h-9 bg-gray-200 rounded w-3/4 mb-4" />
    <div className="h-4 bg-gray-100 rounded w-48 mb-8" />
    <div className="w-full h-72 bg-gray-200 rounded-2xl mb-8" />
    <div className="space-y-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-100 rounded ${
            i % 3 === 2 ? "w-2/3" : "w-full"
          }`}
        />
      ))}
    </div>
  </div>
);

export default function BlogRead({ slug, initialBlog = null }) {
  const router = useRouter();

  // Use server-side blog data first so H1/content render in initial HTML.
  const [blog, setBlog] = useState(initialBlog);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(!initialBlog);
  const [notFound, setNotFound] = useState(!initialBlog ? false : false);

  useEffect(() => {
    let isActive = true;

    const fetchData = async () => {
      // If server already sent blog data, do not show skeleton again.
      if (initialBlog) {
        setBlog(initialBlog);
        setLoading(false);
        setNotFound(false);
      } else {
        setLoading(true);
        setNotFound(false);

        try {
          const selectedBlog = await fetchBlogBySlug(slug);

          if (!isActive) return;

          if (!selectedBlog) {
            setNotFound(true);
            setBlog(null);
          } else {
            setBlog(selectedBlog);
          }
        } catch (err) {
          if (isActive) {
            if (err.response?.status === 404) {
              setNotFound(true);
            } else {
              console.error("Failed to fetch blog:", err);
            }
          }
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      }

      // Latest articles can load after hydration. Main article SEO is already rendered.
      try {
        const latestRes = await fetchBlogs({
          published: true,
          limit: 4,
        });

        if (!isActive) return;

        setLatest(
          (latestRes.blogs || [])
            .filter(isPublishedBlog)
            .filter((item) => item.slug !== slug)
            .slice(0, 3),
        );
      } catch (err) {
        if (isActive) {
          console.error("Failed to fetch latest blogs:", err);
        }
      }
    };

    fetchData();

    return () => {
      isActive = false;
    };
  }, [slug, initialBlog]);

  const getCleanExcerpt = (content) => {
    if (!content) return "";

    let clean = content;

    if (clean.includes("&lt;") || clean.includes("&gt;")) {
      const txt = document.createElement("textarea");
      txt.innerHTML = clean;
      clean = txt.value;
    }

    clean = clean
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();

    return clean.slice(0, 160);
  };

  // Remove first content image to avoid duplicate featured image.
  const removeFirstImageFromContent = (html = "") => {
    if (!html) return "";

    let cleanHtml = html;

    if (cleanHtml.includes("&lt;") || cleanHtml.includes("&gt;")) {
      const txt = document.createElement("textarea");
      txt.innerHTML = cleanHtml;
      cleanHtml = txt.value;
    }

    return cleanHtml.replace(/<img[^>]*>/i, "");
  };

  if (loading) return <Skeleton />;

  if (notFound || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-28 pb-12">
        <div className="text-center">
          <div className="text-7xl font-extrabold text-gray-100">404</div>

          <h2 className="text-2xl font-bold text-gray-800 mt-4">
            Blog Not Found
          </h2>

          <p className="text-gray-500 mt-2">
            The article you're looking for doesn't exist.
          </p>

          <Link
            href="/blog"
            className="inline-block mt-6 bg-red-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-red-600 transition"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <style>{`
          .blog-content {
            word-wrap: break-word;
            word-break: break-word;
            overflow-wrap: break-word;
            max-width: 100%;
          }

          .blog-content h1 {
            font-size: 2.3rem;
            font-weight: 800;
            margin: 1.5rem 0 1rem;
            color: #111827;
            line-height: 1.2;
          }

          .blog-content h2 {
            font-size: 1.9rem;
            font-weight: 700;
            margin: 1.3rem 0 1rem;
            color: #111827;
            line-height: 1.3;
          }

          .blog-content h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 1.2rem 0 0.8rem;
            color: #111827;
          }

          .blog-content p {
            margin-bottom: 1.25rem;
            line-height: 1.8;
            color: #374151;
            font-size: 1.05rem;
            word-wrap: break-word;
            word-break: break-word;
            overflow-wrap: break-word;
          }

          .blog-content ul {
            list-style: disc;
            padding-left: 2rem;
            margin-bottom: 1.25rem;
          }

          .blog-content ol {
            list-style: decimal;
            padding-left: 2rem;
            margin-bottom: 1.25rem;
          }

          .blog-content li {
            margin-bottom: 0.5rem;
            line-height: 1.8;
            color: #374151;
          }

          .blog-content strong {
            font-weight: 700;
            color: #111827;
          }

          .blog-content em {
            font-style: italic;
          }

          .blog-content u {
            text-decoration: underline;
          }

          .blog-content a {
            color: #ef4444;
            text-decoration: underline;
            font-weight: 500;
            word-wrap: break-word;
            word-break: break-all;
            overflow-wrap: break-word;
          }

          .blog-content blockquote {
            border-left: 4px solid #ef4444;
            padding: 1.25rem 1.25rem 1.25rem 1.5rem;
            margin: 1.5rem 0;
            font-style: italic;
            color: #4b5563;
            background: #fff;
            border-radius: 0.75rem;
            box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.02);
          }

          .blog-content pre {
            background: #111827;
            color: #f9fafb;
            padding: 1.25rem;
            border-radius: 12px;
            overflow-x: auto;
            max-width: 100%;
            white-space: pre-wrap;
            word-wrap: break-word;
            word-break: break-all;
            margin-bottom: 1.25rem;
            font-size: 14px;
            line-height: 1.6;
          }

          .blog-content img {
            max-width: 100%;
            height: auto;
            border-radius: 16px;
            margin: 1.75rem 0;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          }

          .blog-content .ql-align-center {
            text-align: center;
          }

          .blog-content .ql-align-right {
            text-align: right;
          }

          .blog-content .ql-align-justify {
            text-align: justify;
          }
        `}</style>

        <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <article className="flex-1 min-w-0">
              <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                <Link href="/" className="hover:text-gray-600 transition">
                  Home
                </Link>

                <span>/</span>

                <Link href="/blog" className="hover:text-gray-600 transition">
                  Blog
                </Link>

                <span>/</span>

                <span className="text-gray-600 truncate max-w-xs">
                  {blog.title}
                </span>
              </nav>

              {blog.category && (
                <span className="inline-block bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full mb-4">
                  {blog.category}
                </span>
              )}

              {/* Main SEO H1 */}
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mt-5 pb-6 border-b border-gray-200">
                {blog.author && (
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-red-600">
                        {blog.author.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    <span className="text-sm font-medium text-gray-700">
                      {blog.author}
                    </span>
                  </div>
                )}

                {blog.author && blog.createdAt && (
                  <span className="text-gray-300">•</span>
                )}

                {blog.createdAt && (
                  <span className="text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>

              {blog.image && (
                <div className="mt-8 rounded-2xl overflow-hidden shadow-sm">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full object-cover max-h-[500px]"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}

              <div
                className="blog-content w-full max-w-full break-words overflow-hidden mt-10 text-base"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(
                    blog.image
                      ? removeFirstImageFromContent(blog.content)
                      : blog.content || "",
                  ),
                }}
              />

              <div className="mt-12 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push("/blog")}
                  className="inline-flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium transition"
                >
                  ← Back to Blog
                </button>
              </div>
            </article>

            {latest.length > 0 && (
              <aside className="w-full lg:w-80 flex-shrink-0">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-28">
                  <h3 className="text-lg font-bold text-gray-800 mb-5">
                    Latest Articles
                  </h3>

                  <div className="space-y-4">
                    {latest.map((item) => (
                      <Link
                        key={item._id}
                        href={`/puf-panels/${item.slug}/`}
                        className="flex gap-3 group"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-14 object-cover rounded-xl flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-14 bg-red-50 rounded-xl flex items-center justify-center text-xs text-red-400 flex-shrink-0">
                            No Image
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-red-500 transition">
                            {item.title}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )
                              : ""}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <Link
                    href="/blog"
                    className="block text-center mt-5 py-2.5 border border-gray-200 text-sm text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium"
                  >
                    View All Articles →
                  </Link>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
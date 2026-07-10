"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

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

import api from "@/lib/api/axios";

const Skeleton = () => (
  <div className="animate-pulse max-w-[760px] mx-auto px-4 pt-24 pb-16">
    <div className="bg-white px-5 sm:px-8 md:px-10 py-8 sm:py-10">
      <div className="h-5 bg-gray-200 rounded w-32 mb-6" />

      <div className="h-9 bg-gray-200 rounded w-3/4 mb-4" />

      <div className="h-4 bg-gray-100 rounded w-48 mb-8" />

      <div className="w-full h-72 bg-gray-200 mb-8" />

      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}

            className={`h-4 bg-gray-100 rounded ${
              i % 3 === 2 ? "w-2/3" : "w-full"
            }`}
          />
        ))}
      </div>
    </div>
  </div>
);

const decodeHtml = (content) => {
  if (!content) return "";

  if (content.includes("&lt;") || content.includes("&gt;")) {
    const txt = document.createElement("textarea");

    txt.innerHTML = content;

    return txt.value;
  }

  return content;
};

const removeFirstImageFromContent = (content = "") => {
  if (!content) return "";

  return content.replace(/<img\b[^>]*\/?>/i, "");
};

const getSanitizedContent = (blog) => {
  const rawContent = blog?.image
    ? removeFirstImageFromContent(blog.content || "")
    : blog?.content || "";

  const decodedContent = decodeHtml(rawContent);

  return sanitizeHtml(decodedContent, {
    ADD_ATTR: ["class", "href", "target", "rel", "src", "alt"],

    FORBID_ATTR: ["style", "bgcolor"],

    ALLOW_DATA_ATTR: false,
  });
};

export default function SingleBlog({ slug }) {
  const router = useRouter();

  const [blog, setBlog] = useState(null);

  const [latest, setLatest] = useState([]);

  const [loading, setLoading] = useState(true);

  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      setNotFound(false);

      try {
        const { data } = await api.get(`/blogs/${slug}`);

        setBlog(data.data);

        const latestRes = await api.get("/blogs", {
          params: {
            published: true,

            limit: 4,
          },
        });

        setLatest(
          (latestRes.data.data || [])

            .filter((b) => b.slug !== slug)

            .slice(0, 3),
        );
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const getCleanExcerpt = (content) => {
    if (!content) return "";

    let clean = decodeHtml(content);

    clean = clean
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();

    return clean.slice(0, 160);
  };

  if (loading) return <Skeleton />;

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#edf3f8] flex items-center justify-center px-4 pt-28 pb-12">
        <div className="text-center bg-white px-8 py-10">
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
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#edf3f8] pt-24 pb-16">
        <style>{`


          .blog-content,


          .blog-content * {


            font-family: inherit !important;


            box-sizing: border-box !important;


          }





          .blog-content {


            color: #0f172a !important;


            font-size: 16px !important;


            line-height: 1.8 !important;


            text-align: justify !important;


            text-justify: inter-word !important;


            word-break: normal !important;


            overflow-wrap: break-word !important;


            max-width: 100% !important;


            background: transparent !important;


            background-color: transparent !important;


          }





          .blog-content p {


            font-size: 16px !important;


            line-height: 1.8 !important;


            color: #0f172a !important;


            text-align: justify !important;


            text-justify: inter-word !important;


            margin: 0 0 22px 0 !important;


            background: transparent !important;


            background-color: transparent !important;


          }





          .blog-content div,


          .blog-content span,


          .blog-content mark,


          .blog-content font,


          .blog-content em,


          .blog-content strong,


          .blog-content b {


            background: transparent !important;


            background-color: transparent !important;


          }





          .blog-content span,


          .blog-content div {


            font-size: inherit !important;


            line-height: inherit !important;


            color: inherit !important;


          }





          .blog-content h1,


          .blog-content h2,


          .blog-content h3,


          .blog-content h4,


          .blog-content h5,


          .blog-content h6 {


            font-family: inherit !important;


            color: #0f172a !important;


            text-align: left !important;


            font-weight: 700 !important;


            background: transparent !important;


            background-color: transparent !important;


          }





          .blog-content h1 {


            font-size: 30px !important;


            line-height: 1.25 !important;


            margin: 36px 0 16px !important;


          }





          .blog-content h2 {


            font-size: 27px !important;


            line-height: 1.3 !important;


            margin: 36px 0 14px !important;


          }





          .blog-content h3 {


            font-size: 22px !important;


            line-height: 1.35 !important;


            margin: 30px 0 12px !important;


          }





          .blog-content h4 {


            font-size: 19px !important;


            line-height: 1.4 !important;


            margin: 26px 0 10px !important;


          }





          .blog-content ul,


          .blog-content ol {


            margin: 0 0 22px 0 !important;


            padding-left: 24px !important;


            background: transparent !important;


          }





          .blog-content ul {


            list-style-type: disc !important;


          }





          .blog-content ol {


            list-style-type: decimal !important;


          }





          .blog-content li {


            font-size: 16px !important;


            line-height: 1.8 !important;


            margin-bottom: 8px !important;


            color: #0f172a !important;


            text-align: justify !important;


            text-justify: inter-word !important;


            background: transparent !important;


            background-color: transparent !important;


          }





          .blog-content strong,


          .blog-content b {


            font-weight: 700 !important;


            color: #0f172a !important;


          }





          .blog-content a,


          .blog-content a:link,


          .blog-content a:visited,


          .blog-content a:hover,


          .blog-content a:active {


            color: #ef4444 !important;


            text-decoration: underline !important;


            font-weight: 500 !important;


            display: inline !important;


            white-space: normal !important;


            word-break: normal !important;


            overflow-wrap: normal !important;


            background: transparent !important;


            background-color: transparent !important;


          }





          .blog-content img {


            max-width: 100% !important;


            width: 100% !important;


            height: auto !important;


            margin: 28px auto !important;


            display: block !important;


            border-radius: 0 !important;


            box-shadow: none !important;


            background: transparent !important;


          }





          .blog-content blockquote {


            border-left: 4px solid #ef4444 !important;


            padding: 16px 18px !important;


            margin: 24px 0 !important;


            color: #475569 !important;


            background: #f8fafc !important;


            font-style: italic !important;


            text-align: left !important;


          }





          .blog-content .ql-align-center,


          .blog-content .ql-align-right,


          .blog-content .ql-align-justify {


            text-align: justify !important;


            text-justify: inter-word !important;


          }





          @media (max-width: 640px) {


            .blog-content {


              font-size: 15.5px !important;


              line-height: 1.7 !important;


              text-align: left !important;


            }





            .blog-content p,


            .blog-content div,


            .blog-content span,


            .blog-content li {


              font-size: 15.5px !important;


              line-height: 1.7 !important;


              text-align: left !important;


            }





            .blog-content h1 {


              font-size: 27px !important;


            }





            .blog-content h2 {


              font-size: 24px !important;


            }





            .blog-content h3 {


              font-size: 21px !important;


            }


          }


        `}</style>

        <div className="px-4">
          <main className="max-w-[760px] mx-auto bg-white px-5 sm:px-8 md:px-10 py-10 sm:py-12 shadow-sm">
            <article>
              <h1 className="text-[28px] sm:text-[32px] font-bold text-gray-900 leading-tight mb-4">
                {blog?.title}
              </h1>

              <p className="text-[13px] text-red-500 mb-8">
                By {blog?.author || "arasfirma"} /{" "}
                {blog?.createdAt &&
                  new Date(blog.createdAt).toLocaleDateString("en-GB", {
                    weekday: "long",

                    day: "numeric",

                    month: "long",

                    year: "numeric",
                  })}
              </p>

              {blog?.image && (
                <div className="mb-8 bg-white">
                  <img
                    src={blog.image}

                    alt={blog.title}

                    className="w-full h-auto object-cover"

                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}

              <div
                className="blog-content mt-8"

                dangerouslySetInnerHTML={{
                  __html: getSanitizedContent(blog),
                }}
              />

              <div className="mt-12 pt-6 border-t border-gray-200">
                <button
                  onClick={() => router.push("/blog")}

                  className="inline-flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium transition"
                >
                  ← Back to Blog
                </button>
              </div>
            </article>
          </main>
        </div>
      </div>
    </>
  );
}

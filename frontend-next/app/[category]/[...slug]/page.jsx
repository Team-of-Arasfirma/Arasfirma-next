import { notFound, redirect } from "next/navigation";
import BlogRead from "@/components/Blog/BlogRead";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const SITE_URL = "https://www.arasfirma.com";

const ALLOWED_CATEGORIES = [
  "puf-panels",
  "puf-panel-roof",
  "puf-panel-wall",
  "puf-panels/poultry-farming",
  "puf-panels/mushroom-farming",
];

const getApiBase = () => API_BASE_URL.replace(/\/$/, "");

const stripHtml = (value = "") =>
  value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

const getBlogRouteData = (category, slugParam) => {
  const slugParts = Array.isArray(slugParam)
    ? slugParam
    : slugParam
    ? [slugParam]
    : [];

  const blogSlug = slugParts[slugParts.length - 1] || "";
  const categorySlug = [category, ...slugParts.slice(0, -1)].join("/");
  const fullPath = `/${categorySlug}/${blogSlug}`;

  return {
    blogSlug,
    categorySlug,
    fullPath,
  };
};

const fetchRedirectByPath = async (fromPath) => {
  try {
    const res = await fetch(
      `${getApiBase()}/api/redirects/check?from=${encodeURIComponent(
        fromPath
      )}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    if (!data?.success || !data?.data?.to) {
      return null;
    }

    return data.data;
  } catch {
    return null;
  }
};

const fetchBlogBySlug = async (slug) => {
  try {
    const res = await fetch(
      `${getApiBase()}/api/blogs/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const blog = data?.data || data?.blog || data;

    if (!blog || blog?.success === false) {
      return null;
    }

    return blog;
  } catch {
    return null;
  }
};

export async function generateMetadata({ params }) {
  const { category, slug } = await params;
  const { blogSlug, categorySlug, fullPath } = getBlogRouteData(
    category,
    slug
  );

  const url = `${SITE_URL}${fullPath}`;

  if (!ALLOWED_CATEGORIES.includes(categorySlug) || !blogSlug) {
    return {
      title: "Blog",
      description: "Arasfirma blog article.",
    };
  }

  const blog = await fetchBlogBySlug(blogSlug);

  if (!blog) {
    return {
      title: "Blog",
      description: "Arasfirma blog article.",
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: "Blog",
        description: "Arasfirma blog article.",
        type: "article",
        url,
      },
    };
  }

  const title = blog?.metaTitle || blog?.title || "Blog";
  const description =
    blog?.metaDescription ||
    stripHtml(blog?.content || "").slice(0, 160) ||
    "Arasfirma blog article.";

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url,
      images: blog?.image ? [blog.image] : [],
    },
  };
}

export default async function Page({ params }) {
  const { category, slug } = await params;
  const { blogSlug, categorySlug, fullPath } = getBlogRouteData(
    category,
    slug
  );

  if (!ALLOWED_CATEGORIES.includes(categorySlug) || !blogSlug) {
    notFound();
  }

  const redirectEntry = await fetchRedirectByPath(fullPath);

  if (redirectEntry?.to) {
    redirect(redirectEntry.to);
  }

  const blog = await fetchBlogBySlug(blogSlug);

  if (!blog) {
    notFound();
  }

  return <BlogRead slug={blogSlug} initialBlog={blog} />;
}
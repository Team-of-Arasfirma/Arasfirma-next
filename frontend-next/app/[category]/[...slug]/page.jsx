import { notFound, redirect } from "next/navigation";
import BlogRead from "@/components/Blog/BlogRead";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const SITE_URL = "https://www.arasfirma.com";

const ALLOWED_CATEGORIES = [
  "puf-panels",
  "puf-panel-roof",
  "puf-panel-wall",
];

const getApiBase = () => API_BASE_URL.replace(/\/$/, "");

const stripHtml = (value = "") =>
  value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

const buildSlugPath = (slugParam) => {
  if (Array.isArray(slugParam)) {
    return slugParam.join("/");
  }

  return slugParam || "";
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

  if (!ALLOWED_CATEGORIES.includes(category)) {
    return {
      title: "Blog",
      description: "Arasfirma blog article.",
    };
  }

  const slugPath = buildSlugPath(slug);
  const url = `${SITE_URL}/${category}/${slugPath}`;

  const blog = await fetchBlogBySlug(slugPath);

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
  const description = blog?.metaDescription || stripHtml(blog?.content || "");

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

  if (!ALLOWED_CATEGORIES.includes(category)) {
    notFound();
  }

  const slugPath = buildSlugPath(slug);
  const fromPath = `/${category}/${slugPath}`;

  const redirectEntry = await fetchRedirectByPath(fromPath);

  if (redirectEntry?.to) {
    redirect(redirectEntry.to);
  }

  const blog = await fetchBlogBySlug(slugPath);

  if (!blog) {
    notFound();
  }

  return <BlogRead slug={slugPath} initialBlog={blog} />;
}
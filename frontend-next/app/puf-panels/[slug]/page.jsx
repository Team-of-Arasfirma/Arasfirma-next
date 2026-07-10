import { redirect } from "next/navigation";
import BlogRead from "@/components/Blog/BlogRead";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const getApiBase = () => API_BASE_URL.replace(/\/$/, "");

const stripHtml = (value = "") =>
  value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

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
    const res = await fetch(`${getApiBase()}/api/blogs/${slug}`, {
      cache: "no-store",
    });

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
  const { slug } = await params;

  const url = `https://www.arasfirma.com/puf-panels/${slug}/`;

  const blog = await fetchBlogBySlug(slug);

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
  const { slug } = await params;

  const fromPath = `/puf-panels/${slug}`;

  // Redirect check first.
  // This allows redirect to work even if the old slug still exists as a blog.
  const redirectEntry = await fetchRedirectByPath(fromPath);

  if (redirectEntry?.to) {
    redirect(redirectEntry.to);
  }

  const blog = await fetchBlogBySlug(slug);

  return <BlogRead slug={slug} initialBlog={blog} />;
}
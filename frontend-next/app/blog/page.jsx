import BlogPage from "@/components/Blog";

export const dynamic = "force-dynamic";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://arasfirma-next.onrender.com";

export const metadata = {
  title: "Blogs - ARASFIRMA",
  description:
    "Discover insights and updates on PUF panels through our dedicated blog. From expert guides and technical know-how to practical applications and benefits, we",
  alternates: { canonical: "https://www.arasfirma.com/blog/" },
  openGraph: {
    title: "Blogs - ARASFIRMA",
    description:
      "Discover insights and updates on PUF panels through our dedicated blog. From expert guides and technical know-how to practical applications and benefits, we",
    type: "website",
    url: "https://www.arasfirma.com/blog/",
  },
};

async function getInitialBlogs() {
  try {
    const response = await fetch(
      `${API_BASE_URL.replace(/\/$/, "")}/api/blogs?published=true&page=1&limit=9`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return {
        blogs: [],
        pagination: {},
      };
    }

    const data = await response.json();

    return {
      blogs: data.blogs || data.data || [],
      pagination: data.pagination || {},
    };
  } catch (error) {
    console.error("Failed to fetch initial blogs:", error);

    return {
      blogs: [],
      pagination: {},
    };
  }
}

export default async function Page() {
  const { blogs, pagination } = await getInitialBlogs();

  return <BlogPage initialBlogs={blogs} initialPagination={pagination} />;
}
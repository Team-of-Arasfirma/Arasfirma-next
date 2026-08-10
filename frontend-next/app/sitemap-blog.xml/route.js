const SITE_URL = "https://www.arasfirma.com";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://arasfirma-next.onrender.com";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const escapeXml = (value = "") => {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
};

const formatDate = (value) => {
  if (!value) return new Date().toISOString().split("T")[0];

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().split("T")[0];
  }

  return date.toISOString().split("T")[0];
};

export async function GET() {
  try {
    const response = await fetch(
      `${API_BASE}/api/blogs?published=true&page=1&limit=1000`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch blogs");
    }

    const data = await response.json();

    const blogs = Array.isArray(data)
      ? data
      : data.blogs || data.data || data.items || [];

    const urls = blogs
      .filter((blog) => blog?.slug)
      .map((blog) => {
        const categorySlug = blog.categorySlug || "puf-panels";
        const lastmod = formatDate(
          blog.updatedAt || blog.publishDate || blog.createdAt
        );

        return `
  <url>
    <loc>${escapeXml(`${SITE_URL}/${categorySlug}/${blog.slug}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.6</priority>
  </url>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=300",
      },
    });
  }
}
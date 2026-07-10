import JobDetail from "@/components/Career/JobDetail";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const stripHtml = (value = "") =>
  value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const url = `https://www.arasfirma.com/career/${slug}/`;

  try {
    const res = await fetch(
      `${API_BASE_URL.replace(/\/$/, "")}/api/jobs/${slug}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed");

    const data = await res.json();
    const job = data?.data || data?.job || data;

    const title = job?.title
      ? `${job.title} | Careers at Arasfirma`
      : "Careers at Arasfirma";

    const description =
      stripHtml(job?.description || "").slice(0, 160) ||
      "Explore career opportunities at Arasfirma.";

    return {
      title,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        type: "website",
        url,
      },
    };
  } catch {
    return {
      title: "Careers at Arasfirma",
      description: "Explore career opportunities at Arasfirma.",
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: "Careers at Arasfirma",
        description: "Explore career opportunities at Arasfirma.",
        type: "website",
        url,
      },
    };
  }
}

export default async function Page({ params }) {
  const { slug } = await params;

  return <JobDetail slug={slug} />;
}
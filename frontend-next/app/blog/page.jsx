import BlogPage from "@/components/Blog";

export const metadata = {
  title: "Blogs - ARASFIRMA",
  description:
    "Discover insights and updates on PUF panels through our dedicated blog.",
  alternates: { canonical: "https://www.arasfirma.com/blog/" },
  openGraph: {
    title: "Blogs - ARASFIRMA",
    description:
      "Discover insights and updates on PUF panels through our dedicated blog.",
    type: "website",
    url: "https://www.arasfirma.com/blog/",
  },
};

export default function Page() {
  return <BlogPage />;
}

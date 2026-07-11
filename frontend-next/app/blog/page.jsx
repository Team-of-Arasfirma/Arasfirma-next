import BlogPage from "@/components/Blog";

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

export default function Page() {
  return <BlogPage />;
}

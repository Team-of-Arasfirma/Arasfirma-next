import CareerPage from "@/components/Career";

export const metadata = {
  title: "job - ARASFIRMA",
  description:
    "At Arasfirma, we don’t just manufacture PUF panels — we shape the future of sustainable construction. If you're driven by purpose, inspired by progress, and",
  alternates: { canonical: "https://www.arasfirma.com/career/" },
  openGraph: {
    title: "Career - ARASFIRMA",
    description:
      "At Arasfirma, we don’t just manufacture PUF panels — we shape the future of sustainable construction. If you're driven by purpose, inspired by progress, and",
    type: "website",
    url: "https://www.arasfirma.com/career/",
  },
};

export default function Page() {
  return <CareerPage />;
}

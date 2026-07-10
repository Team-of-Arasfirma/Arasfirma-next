import CareerPage from "@/components/Career";

export const metadata = {
  title: "Career - ARASFIRMA",
  description:
    "Explore career opportunities at Arasfirma and join our growing team.",
  alternates: { canonical: "https://www.arasfirma.com/career/" },
  openGraph: {
    title: "Career - ARASFIRMA",
    description:
      "Explore career opportunities at Arasfirma and join our growing team.",
    type: "website",
    url: "https://www.arasfirma.com/career/",
  },
};

export default function Page() {
  return <CareerPage />;
}

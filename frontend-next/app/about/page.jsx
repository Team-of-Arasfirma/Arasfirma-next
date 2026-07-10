import AboutPage from "@/components/About";

export const metadata = {
  title: "About - ARASFIRMA",
  description:
    "Arasfirma is a trusted name in the insulated building materials industry.",
  alternates: { canonical: "https://www.arasfirma.com/about/" },
  openGraph: {
    title: "About - ARASFIRMA",
    description:
      "Arasfirma is a trusted name in the insulated building materials industry.",
    type: "website",
    url: "https://www.arasfirma.com/about/",
  },
};

export default function About() {
  return <AboutPage />;
}

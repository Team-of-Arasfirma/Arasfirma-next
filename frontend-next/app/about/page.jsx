import AboutPage from "@/components/About";

export const metadata = {
  title: "About - ARASFIRMA",
  description:
    "Arasfirma is a trusted name in the insulated building materials industry, specializing in high-performance Sandwich PUF Panels for roofs and walls. With a",
  alternates: { canonical: "https://www.arasfirma.com/about/" },
  openGraph: {
    title: "About - ARASFIRMA",
    description:
      "Arasfirma is a trusted name in the insulated building materials industry, specializing in high-performance Sandwich PUF Panels for roofs and walls. With a",
    type: "website",
    url: "https://www.arasfirma.com/about/",
  },
};

export default function About() {
  return <AboutPage />;
}

import ProjectPage from "@/components/Project";

export const metadata = {
  title: "Our Projects | Arasfirma",
  description: "Explore Arasfirma's completed projects across India.",
  alternates: { canonical: "https://www.arasfirma.com/projects/" },
  openGraph: {
    title: "Our Projects | Arasfirma",
    description: "Explore Arasfirma's completed projects across India.",
    type: "website",
    url: "https://www.arasfirma.com/projects/",
  },
};

export default function Page() {
  return <ProjectPage />;
}

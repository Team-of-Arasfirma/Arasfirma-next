import ContactPage from "@/components/Contact";

export const metadata = {
  title: "Contact - ARASFIRMA",
  description:
    "Get in touch with Arasfirma for PUF panel inquiries, quotes, and support.",
  alternates: { canonical: "https://www.arasfirma.com/contact/" },
  openGraph: {
    title: "Contact - ARASFIRMA",
    description:
      "Get in touch with Arasfirma for PUF panel inquiries, quotes, and support.",
    type: "website",
    url: "https://www.arasfirma.com/contact/",
  },
};

export default function Page() {
  return <ContactPage />;
}

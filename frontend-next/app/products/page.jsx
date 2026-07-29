import ProductsPage from "@/components/Products";

export const metadata = {
  title: "Products | Arasfirma",
  description:
    "Explore Arasfirma's PUF roofing, mono wall, concealed panel, and cold storage PUF panel products.",
  alternates: {
    canonical: "https://www.arasfirma.com/products",
  },
  openGraph: {
    title: "Products | Arasfirma",
    description:
      "Explore Arasfirma's PUF roofing, mono wall, concealed panel, and cold storage PUF panel products.",
    type: "website",
    url: "https://www.arasfirma.com/products",
  },
};

export default function Page() {
  return <ProductsPage />;
}
"use client";

import { useRouter } from "next/navigation";

const products = [
  {
    name: "Concealed Panel",
    core: "Core: (PUF / PIR / Rock Wool)",
    image: "/assets/products/concealed.png",
    color: "#f0fdf4",
    badge: "New",
    link: "/products/concealed",
  },
  {
    name: "Roof Panel",
    core: "Core: (PUF / PIR / Rock Wool)",
    image: "/assets/products/Roof-panel.png",
    color: "#eff6ff",
    badge: "Popular",
    link: "/products/roof-panel",
  },
  {
    name: "Mono Wall",
    core: "Core: (PUF / PIR / Rock Wool)",
    image: "/assets/products/mono-wall.png",
    color: "#fff7ed",
    badge: null,
    link: "/products/mono-wall",
  },
  {
    name: "Cold Storage PUF Panel",
    core: "Core: High Density PUF Insulation",
    image: "/assets/products/Roof-panel.png",
    color: "#ecfeff",
    badge: "Cold Room",
    link: "/products/cold-storage-for-pufpanels",
  },
];

const ProductCard = ({ product, delay }) => {
  const router = useRouter();

  return (
    <div
      data-animate="up"
      data-delay={delay}
      onClick={() => router.push(product.link)}
      className="group cursor-pointer overflow-hidden rounded-[20px] border border-[#e5e7eb] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
    >
      <div
        className="relative flex h-[220px] items-center justify-center overflow-hidden"
        style={{ background: product.color }}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-40 object-contain transition-transform duration-300 group-hover:scale-110"
        />

        {product.badge && (
          <span className="absolute right-3 top-3 rounded-full bg-[#dc2626] px-[10px] py-[3px] text-[10px] font-bold uppercase tracking-[1px] text-white">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[#f3f4f6] px-5 py-4">
        <div>
          <p className="mb-1 font-extrabold text-[#111827]">{product.name}</p>
          <p className="text-xs text-[#9ca3af]">{product.core}</p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(product.link);
          }}
          className="rounded-full bg-[#fef2f2] px-4 py-2 text-xs font-bold text-[#dc2626] transition-colors duration-300 hover:bg-[#fee2e2]"
        >
          View -&gt;
        </button>
      </div>
    </div>
  );
};

const ProductRange = () => {
  return (
    <section className="w-full bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div data-animate="up" className="mb-12">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            Our Products
          </p>

          <h2 className="mb-3 max-w-6xl text-2xl font-black uppercase leading-tight text-red-600 md:text-4xl">
            Our Range Of PUF Panels For All Your Roofing And Wall Cladding Needs
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-500">
            As A Trusted Sandwich PUF Panel Manufacturer, We Offer PUF Panel For
            Roof, PUF Panel For Wall, Concealed Panel And Cold Storage PUF Panel
            Solutions Designed To Meet Your Building&apos;s Energy Efficiency
            And Structural Needs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard
              key={product.name}
              product={product}
              delay={index * 120}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductRange;

"use client";

import { useEffect, useRef } from "react";
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
];

const ProductCard = ({ product, index }) => {
  const router = useRouter();
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    card.style.opacity = "0";
    card.style.transform = "translateY(40px)";
    card.style.transition = `opacity 0.6s ease ${
      index * 120
    }ms, transform 0.6s ease ${index * 120}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(card);

    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={cardRef}
      onClick={() => router.push(product.link)}
      style={{
        borderRadius: 20,
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        background: "white",
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          background: product.color,
          height: 220,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          style={{
            height: 160,
            objectFit: "contain",
            transition: "transform 0.4s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        />

        {product.badge && (
          <span
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "#dc2626",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 999,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {product.badge}
          </span>
        )}
      </div>

      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #f3f4f6",
        }}
      >
        <div>
          <p style={{ fontWeight: 800, color: "#111827", marginBottom: 4 }}>
            {product.name}
          </p>
          <p style={{ fontSize: 12, color: "#9ca3af" }}>{product.core}</p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(product.link);
          }}
          style={{
            background: "#fef2f2",
            border: "none",
            borderRadius: 999,
            padding: "8px 16px",
            fontSize: 12,
            fontWeight: 700,
            color: "#dc2626",
            cursor: "pointer",
          }}
        >
          View →
        </button>
      </div>
    </div>
  );
};

const ProductRange = () => {
  const titleRef = useRef(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.7s ease, transform 0.7s ease";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Our Products
          </p>

          <h2 className="text-2xl md:text-4xl font-black uppercase text-red-600 leading-tight mb-3 max-w-6xl">
            Our Range Of PUF Panels For All Your Roofing And Wall Cladding Needs
          </h2>

          <p className="text-sm text-gray-500 mt-4 max-w-3xl leading-relaxed">
            As A Trusted Sandwich PUF Panel Manufacturer, We Offer Both PUF
            Panel For Roof And PUF Panel For Wall Solutions Designed To Meet
            Your Building&apos;s Energy Efficiency And Structural Needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.name} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductRange;

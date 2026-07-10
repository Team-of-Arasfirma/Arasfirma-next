"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

const ProductHero = ({ product }) => {
  const router = useRouter();

  const [selectedColor, setSelectedColor] = useState(
    product.colorOptions?.[0] || {
      hex: product.color,

      name: "Default",

      image: product.image,
    },
  );

  const [imgFading, setImgFading] = useState(false);

  const handleColorClick = (colorOption) => {
    if (colorOption.hex === selectedColor.hex) return;

    setImgFading(true);

    setTimeout(() => {
      setSelectedColor(colorOption);

      setImgFading(false);
    }, 250);
  };

  return (
    <section
      className="w-full pt-36 pb-16 px-6 relative overflow-hidden"

      style={{
        background: "linear-gradient(135deg, #fafafa 0%, #f3f4f6 100%)",
      }}
    >
      {/* Background Glow */}

      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"

        style={{
          background: selectedColor.hex,

          filter: "blur(80px)",

          transform: "translate(30%, -30%)",

          transition: "background 0.5s ease",
        }}
      />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
        {/* LEFT SIDE */}

        <div className="flex-1">
          <span
            className="inline-block text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 text-white"

            style={{ background: selectedColor.hex }}
          >
            {product.badge}
          </span>

          <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-3">
            {product.name}
          </h1>

          <p
            className="text-base font-semibold mb-5"

            style={{ color: selectedColor.hex }}
          >
            {product.tagline}
          </p>

          <p className="text-sm text-gray-500 leading-relaxed max-w-lg mb-8">
            {product.description?.slice(0, 200)}...
          </p>

          {/* COLOR SELECT */}

          <div className="mb-8">
            <p className="text-sm font-black text-gray-700 mb-3">
              Available Colors:
              <span
                className="ml-2 text-xs font-semibold"

                style={{ color: selectedColor.hex }}
              >
                {selectedColor.name}
              </span>
            </p>

            <div className="flex gap-2 flex-wrap">
              {product.colorOptions?.map((c) => (
                <button
                  key={c.hex}

                  onClick={() => handleColorClick(c)}

                  className="flex items-center justify-center hover:scale-110 transition-all duration-300"

                  style={{
                    width: 40,

                    height: 40,

                    borderRadius: 8,

                    background: c.hex,

                    border:
                      selectedColor.hex === c.hex
                        ? "3px solid white"
                        : "2px solid transparent",

                    boxShadow:
                      selectedColor.hex === c.hex
                        ? `0 0 0 2.5px ${c.hex}`
                        : "0 2px 6px rgba(0,0,0,0.15)",
                  }}
                >
                  {selectedColor.hex === c.hex && (
                    <svg width="16" height="16" viewBox="0 0 16 16">
                      <path
                        d="M3 8l3.5 3.5L13 5"

                        stroke={c.hex === "#d1d5db" ? "#000" : "#fff"}

                        strokeWidth="2.5"

                        fill="none"

                        strokeLinecap="round"

                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* QUICK SPECS */}

          <div className="flex gap-5 mt-10 pt-8 border-t border-gray-200">
            {product.specifications?.slice(0, 3).map((spec) => (
              <div key={spec.label}>
                <p
                  className="text-base font-black"

                  style={{ color: selectedColor.hex }}
                >
                  {spec.value}
                </p>

                <p className="text-xs text-gray-400">{spec.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-[420px] h-[320px] flex items-center justify-center">
            {/* Glow */}

            <div
              className="absolute inset-0 rounded-full opacity-20"

              style={{
                background: selectedColor.hex,

                filter: "blur(50px)",
              }}
            />

            {/* PRODUCT IMAGE */}

            <img
              key={selectedColor.hex}

              src={selectedColor.image}

              alt={product.name}

              loading="lazy"

              className="w-full max-h-[800px] object-contain drop-shadow-2xl"

              style={{
                opacity: imgFading ? 0 : 1,

                transition: "opacity 0.25s ease",
              }}

              onError={(e) => {
                e.currentTarget.src = product.image;
              }}
            />

            {/* COLOR TAG */}

            <div
              className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-white text-xs font-bold"

              style={{ background: selectedColor.hex }}
            >
              {selectedColor.name}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;

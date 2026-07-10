"use client";

import { useRouter } from "next/navigation";

import { PRODUCTS } from "./productData";

const ROUTES = {
  roofPanel: "/products/roof-panel",

  monoWall: "/products/mono-wall",

  concealed: "/products/concealed",
};

const RelatedProducts = ({ product }) => {
  const router = useRouter();

  return (
    <section className="w-full py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div data-animate="up" className="text-center mb-10">
          <h2 className="text-3xl font-black uppercase text-gray-900 mb-3">
            Related Products
          </h2>

          <div className="w-16 h-1 rounded mx-auto bg-gray-300" />
        </div>

        {/* Related cards */}

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          {product.related.map((id, i) => {
            const rel = PRODUCTS[id];

            return (
              <div
                key={id}

                data-animate="up"

                data-delay={i * 150}

                onClick={() => router.push(ROUTES[id])}

                className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex-1 max-w-sm"
              >
                {/* Image */}

                <div
                  className="h-40 rounded-xl flex items-center justify-center mb-5 overflow-hidden"

                  style={{ background: rel.lightColor }}
                >
                  <img
                    src={rel.image}

                    alt={rel.name}

                    loading="lazy"

                    className="h-28 object-contain group-hover:scale-105 transition-transform duration-300"

                    onError={(e) => {
                      e.currentTarget.style.display = "none";

                      e.currentTarget.parentElement.innerHTML += `<span style="font-size:56px">🏗️</span>`;
                    }}
                  />
                </div>

                {/* Badge */}

                <span
                  className="text-xs font-black text-white px-3 py-1 rounded-full"

                  style={{ background: rel.color }}
                >
                  {rel.badge}
                </span>

                <h3 className="font-black text-gray-900 text-lg mt-3 mb-1">
                  {rel.name}
                </h3>

                <p className="text-xs text-gray-400 mb-4">{rel.tagline}</p>

                <button
                  className="text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all duration-200"

                  style={{ color: rel.color }}
                >
                  View Product →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;

"use client";

import { useState } from "react";

const ProductDetails = ({ product }) => {
  const [tab, setTab] = useState("description");

  return (
    <section className="w-full py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-2 mb-10 border-b border-gray-100">
          {["description", "specifications"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-6 py-3 text-sm font-black uppercase tracking-wide transition-all duration-200 border-b-2 -mb-px"
              style={{
                borderColor: tab === t ? product.color : "transparent",
                color: tab === t ? product.color : "#9ca3af",
              }}
            >
              {t === "description" ? "Description" : "Specifications"}
            </button>
          ))}
        </div>

        {/* Description tab */}
        {tab === "description" && (
          <div className="max-w-4xl" style={{ animation: "fadeIn 0.3s ease" }}>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        )}

        {/* Specifications tab */}
        {tab === "specifications" && (
          <div className="max-w-3xl" style={{ animation: "fadeIn 0.3s ease" }}>
            <div className="overflow-hidden rounded-2xl border border-gray-100">
              {product.specifications.map((spec, i) => (
                <div
                  key={spec.label}
                  className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50"
                  style={{
                    background: i % 2 === 0 ? "white" : "#fafafa",
                    borderBottom:
                      i < product.specifications.length - 1
                        ? "1px solid #f3f4f6"
                        : "none",
                  }}
                >
                  <span className="text-sm font-semibold text-gray-700">
                    {spec.label}
                  </span>
                  <span
                    className="text-sm font-black"
                    style={{ color: product.color }}
                  >
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default ProductDetails;

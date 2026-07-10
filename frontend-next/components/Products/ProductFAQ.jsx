"use client";

import { useState } from "react";

const ProductFAQ = ({ product }) => {
  const [open, setOpen] = useState(null);

  return (
    <section className="w-full py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div data-animate="up" className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Got Questions?
          </p>
          <h2 className="text-3xl font-black uppercase text-gray-900 mb-3">
            Frequently Asked Questions
          </h2>
          <div
            className="w-16 h-1 rounded mx-auto"
            style={{ background: product.color }}
          />
        </div>

        {/* FAQ items */}
        <div className="flex flex-col gap-3">
          {product.faqs.map((faq, i) => (
            <div
              key={i}
              data-animate="up"
              data-delay={i * 80}
              className="rounded-2xl overflow-hidden border transition-all duration-300"
              style={{
                borderColor: open === i ? product.color : "#f3f4f6",
                boxShadow:
                  open === i ? `0 4px 20px ${product.color}20` : "none",
              }}
            >
              {/* Question */}
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-bold text-gray-800 pr-4">
                  {i + 1}. {faq.q}
                </span>
                <span
                  className="text-xl font-black transition-transform duration-300 shrink-0"
                  style={{
                    color: product.color,
                    transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  +
                </span>
              </button>

              {/* Answer */}
              {open === i && (
                <div
                  className="px-6 pb-5"
                  style={{ animation: "fadeIn 0.25s ease" }}
                >
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default ProductFAQ;

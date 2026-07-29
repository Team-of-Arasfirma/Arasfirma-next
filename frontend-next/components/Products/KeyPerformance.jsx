"use client";

import { useState } from "react";

const KeyPerformance = ({ product }) => {
  const [selectedCard, setSelectedCard] = useState(null);

  const closePopup = () => {
    setSelectedCard(null);
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div data-animate="up" className="text-center mb-12">
          <p className="text-xs font-black uppercase text-gray-900 mb-3">
            Why Choose This Panel
          </p>

          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Key Performance Attributes
          </h2>

          <div
            className="w-16 h-1 rounded mx-auto"
            style={{ background: product.color }}
          />
        </div>

        {/* Cards without icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {product.keyPerformance.map((item, i) => {
            const shouldShowReadMore = item.desc.length > 110;

            return (
              <article
                key={item.title}
                data-animate="up"
                data-delay={i * 100}
                className="h-full min-h-[230px] bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-default flex flex-col"
              >
                {/* Title */}
                <h3 className="font-black text-gray-900 text-base leading-snug mb-4 min-h-[48px] group-hover:text-red-600 transition-colors duration-300">
                  {item.title}
                </h3>

                {/* Short Description */}
                <p className="text-sm text-gray-500 leading-7 line-clamp-4">
                  {item.desc}
                </p>

                {/* Read More inside card */}
                {shouldShowReadMore && (
                  <button
                    type="button"
                    onClick={() => setSelectedCard(item)}
                    className="mt-auto pt-5 text-left text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
                  >
                    Read More →
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </div>

      {/* Popup Modal without icon */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
          onClick={closePopup}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closePopup}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center justify-center"
              aria-label="Close popup"
            >
              ×
            </button>

            {/* Title */}
            <h3 className="text-2xl font-black text-gray-900 leading-tight mb-4 pr-10">
              {selectedCard.title}
            </h3>

            {/* Full Description */}
            <p className="text-sm sm:text-base text-gray-600 leading-8">
              {selectedCard.desc}
            </p>

            {/* Bottom Button */}
            <button
              type="button"
              onClick={closePopup}
              className="mt-7 px-6 py-3 rounded-full bg-red-600 text-white text-sm font-bold hover:bg-red-700 active:scale-95 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default KeyPerformance;
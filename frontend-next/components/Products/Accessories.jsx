"use client";

import { useRef, useState } from "react";

const Accessories = ({ product }) => {
  const rowRef = useRef(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startLeft = useRef(0);
  const [isDrag, setIsDrag] = useState(false);

  const onMouseDown = (e) => {
    if (!rowRef.current) return;

    dragging.current = true;
    setIsDrag(true);
    startX.current = e.pageX;
    startLeft.current = rowRef.current.scrollLeft;
    rowRef.current.style.cursor = "grabbing";
  };

  const onMouseMove = (e) => {
    if (!dragging.current || !rowRef.current) return;

    rowRef.current.scrollLeft = startLeft.current - (e.pageX - startX.current);
  };

  const onMouseUp = () => {
    if (!rowRef.current) return;

    dragging.current = false;
    setIsDrag(false);
    rowRef.current.style.cursor = "grab";
  };

  const scrollLeft = () => {
    rowRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    rowRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          data-animate="up"
          className="flex items-center justify-between gap-4 mb-8"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
              Compatible
            </p>

            <h2 className="text-3xl font-black uppercase text-gray-900 mb-2">
              Accessories
            </h2>

            <div
              className="w-16 h-1 rounded"
              style={{ background: product.color }}
            />
          </div>

          {/* Arrow buttons */}
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-600 transition-all duration-200 hover:bg-red-600 hover:text-white hover:border-red-600"
              aria-label="Scroll accessories left"
            >
              ←
            </button>

            <button
              type="button"
              onClick={scrollRight}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-600 transition-all duration-200 hover:bg-red-600 hover:text-white hover:border-red-600"
              aria-label="Scroll accessories right"
            >
              →
            </button>
          </div>
        </div>

        {/* Draggable scroll row */}
        <div
          ref={rowRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          className="flex gap-5 overflow-x-auto select-none pb-3"
          style={{
            cursor: "grab",
            scrollbarWidth: "none",
          }}
        >
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {product.accessories.map((acc) => (
            <article
              key={acc.name}
              className="min-w-[300px] max-w-[300px] bg-white border border-gray-100 rounded-2xl overflow-hidden shrink-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              style={{
                cursor: isDrag ? "grabbing" : "default",
              }}
            >
              {/* Image */}
              <div
                className="h-44 flex items-center justify-center px-5"
                style={{ background: product.lightColor }}
              >
                <img
                  src={acc.image}
                  alt={acc.name}
                  loading="lazy"
                  draggable={false}
                  className="h-28 max-w-full object-contain pointer-events-none"
                />
              </div>

              {/* Full Text Content */}
              <div className="p-5">
                <h3 className="font-black text-base text-gray-900 leading-snug mb-3">
                  {acc.name}
                </h3>

                {acc.desc && (
                  <p className="text-sm text-gray-500 leading-7">
                    {acc.desc}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Accessories;
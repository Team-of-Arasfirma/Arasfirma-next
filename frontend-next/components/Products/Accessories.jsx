"use client";

import { useRef, useState } from "react";

const Accessories = ({ product }) => {
  const rowRef = useRef(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startLeft = useRef(0);
  const [isDrag, setIsDrag] = useState(false);

  const onMouseDown = (e) => {
    dragging.current = true;
    setIsDrag(true);
    startX.current = e.pageX;
    startLeft.current = rowRef.current.scrollLeft;
    rowRef.current.style.cursor = "grabbing";
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;
    rowRef.current.scrollLeft = startLeft.current - (e.pageX - startX.current);
  };

  const onMouseUp = () => {
    dragging.current = false;
    setIsDrag(false);
    rowRef.current.style.cursor = "grab";
  };

  const scrollLeft = () =>
    rowRef.current.scrollBy({ left: -260, behavior: "smooth" });
  const scrollRight = () =>
    rowRef.current.scrollBy({ left: 260, behavior: "smooth" });

  return (
    <section className="w-full py-16 px-6 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          data-animate="up"
          className="flex items-center justify-between mb-8"
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
          <div className="flex gap-2">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-600 hover:text-white transition-all duration-200"
              style={{ hover: { background: product.color } }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = product.color;
                e.currentTarget.style.color = "white";
                e.currentTarget.style.borderColor = product.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.color = "#4b5563";
                e.currentTarget.style.borderColor = "#e5e7eb";
              }}
            >
              ←
            </button>
            <button
              onClick={scrollRight}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-600 transition-all duration-200"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = product.color;
                e.currentTarget.style.color = "white";
                e.currentTarget.style.borderColor = product.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.color = "#4b5563";
                e.currentTarget.style.borderColor = "#e5e7eb";
              }}
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
          style={{
            display: "flex",
            gap: 16,
            overflowX: "auto",
            cursor: "grab",
            scrollbarWidth: "none",
            userSelect: "none",
            paddingBottom: 8,
          }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>

          {product.accessories.map((acc, i) => (
            <div
              key={acc.name}
              style={{
                minWidth: 200,
                maxWidth: 200,
                borderRadius: 16,
                overflow: "hidden",
                background: "white",
                border: "1px solid #f3f4f6",
                flexShrink: 0,
                cursor: isDrag ? "grabbing" : "default",
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!isDrag) {
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(0,0,0,0.1)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Image */}
              <div
                style={{
                  height: 160,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: product.lightColor,
                }}
              >
                <img
                  src={acc.image}
                  alt={acc.name}
                  loading="lazy"
                  draggable={false}
                  style={{
                    height: 90,
                    objectFit: "contain",
                    pointerEvents: "none",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement.innerHTML += `<span style="font-size:40px">🔧</span>`;
                  }}
                />
              </div>

              {/* Name */}
              <div style={{ padding: "12px 16px" }}>
                <p style={{ fontWeight: 800, fontSize: 13, color: "#111827" }}>
                  {acc.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Accessories;

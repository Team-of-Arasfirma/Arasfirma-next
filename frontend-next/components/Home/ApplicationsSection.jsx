"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const applications = [
  { label: "Educational Institution", image: "/assets/applications/app1.jpeg" },
  { label: "Industrial Shed", image: "/assets/applications/app2.JPG" },
  { label: "Portable Cabin", image: "/assets/applications/app3.png" },
  { label: "Cold Storage", image: "/assets/applications/app4.jpeg" },
  { label: "Warehouse", image: "/assets/applications/app5.jpeg" },
  { label: "Commercial Building", image: "/assets/applications/app6.png" },
];

const CARD_WIDTH = 280;
const CARD_HEIGHT = 220;
const CARD_GAP = 16;

const ApplicationsSection = () => {
  const router = useRouter();

  const rowRef = useRef(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startLeft = useRef(0);

  const [isDrag, setIsDrag] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToProjects = () => {
    router.push("/projects");
  };

  const handleScroll = () => {
    if (!rowRef.current) return;

    const index = Math.round(
      rowRef.current.scrollLeft / (CARD_WIDTH + CARD_GAP),
    );

    setActiveIndex(Math.min(index, applications.length - 1));
  };

  const handleMouseDown = (e) => {
    if (!rowRef.current) return;

    dragging.current = true;
    setIsDrag(true);

    startX.current = e.pageX;
    startLeft.current = rowRef.current.scrollLeft;

    rowRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!dragging.current || !rowRef.current) return;

    rowRef.current.scrollLeft = startLeft.current - (e.pageX - startX.current);
  };

  const handleMouseUp = () => {
    dragging.current = false;
    setIsDrag(false);

    if (rowRef.current) {
      rowRef.current.style.cursor = "grab";
    }
  };

  const handleTouchStart = (e) => {
    if (!rowRef.current) return;

    startX.current = e.touches[0].pageX;
    startLeft.current = rowRef.current.scrollLeft;
  };

  const handleTouchMove = (e) => {
    if (!rowRef.current) return;

    rowRef.current.scrollLeft =
      startLeft.current - (e.touches[0].pageX - startX.current);
  };

  const scrollLeft = () => {
    rowRef.current?.scrollBy({
      left: -(CARD_WIDTH + CARD_GAP),
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    rowRef.current?.scrollBy({
      left: CARD_WIDTH + CARD_GAP,
      behavior: "smooth",
    });
  };

  const scrollToIndex = (i) => {
    rowRef.current?.scrollTo({
      left: i * (CARD_WIDTH + CARD_GAP),
      behavior: "smooth",
    });

    setActiveIndex(i);
  };

  return (
    <section className="w-full py-16 bg-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex items-start justify-between mb-8">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
            Applications
          </p>

          <h2 className="text-2xl md:text-3xl font-black uppercase text-red-600">
            Our Sandwich Panels Are Ideal For
          </h2>
        </div>

        <button
          type="button"
          onClick={goToProjects}
          className="bg-red-600 text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-red-700 active:scale-95 transition-all shrink-0"
        >
          Visit More
        </button>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <button
          type="button"
          onClick={scrollLeft}
          className="absolute top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:bg-red-600 hover:text-white transition-all"
          style={{ left: 4 }}
          aria-label="Scroll left"
        >
          ←
        </button>

        <button
          type="button"
          onClick={scrollRight}
          className="absolute top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:bg-red-600 hover:text-white transition-all"
          style={{ right: 4 }}
          aria-label="Scroll right"
        >
          →
        </button>

        <div
          ref={rowRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          style={{
            display: "flex",
            gap: CARD_GAP,
            overflowX: "auto",
            cursor: "grab",
            paddingBottom: 8,
            scrollbarWidth: "none",
            userSelect: "none",
            scrollSnapType: "x mandatory",
          }}
        >
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {applications.map((app) => (
            <div
              key={app.label}
              onClick={() => {
                if (!isDrag) goToProjects();
              }}
              onMouseEnter={(e) => {
                const overlay = e.currentTarget.querySelector(".overlay");
                const label = e.currentTarget.querySelector(".label");
                const img = e.currentTarget.querySelector(".img");

                if (overlay) overlay.style.opacity = "1";
                if (label) label.style.transform = "translateY(0)";
                if (img) img.style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                const overlay = e.currentTarget.querySelector(".overlay");
                const label = e.currentTarget.querySelector(".label");
                const img = e.currentTarget.querySelector(".img");

                if (overlay) overlay.style.opacity = "0";
                if (label) label.style.transform = "translateY(100%)";
                if (img) img.style.transform = "scale(1)";
              }}
              style={{
                minWidth: CARD_WIDTH,
                maxWidth: CARD_WIDTH,
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                borderRadius: 20,
                overflow: "hidden",
                position: "relative",
                flexShrink: 0,
                cursor: isDrag ? "grabbing" : "pointer",
                scrollSnapAlign: "start",
              }}
            >
              <img
                className="img"
                src={app.image}
                alt={app.label}
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  transition: "transform 0.5s ease",
                  pointerEvents: "none",
                  display: "block",
                }}
              />

              <div
                className="overlay"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.75), transparent 60%)",
                  opacity: 0,
                  transition: "opacity 0.4s ease",
                }}
              />

              <div
                className="label"
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "16px 20px",
                  transform: "translateY(100%)",
                  transition: "transform 0.4s ease",
                }}
              >
                <p
                  style={{
                    color: "white",
                    fontWeight: 900,
                    fontSize: 15,
                    textTransform: "uppercase",
                  }}
                >
                  {app.label}
                </p>

                <p
                  style={{
                    color: "#fca5a5",
                    fontSize: 11,
                    fontWeight: 600,
                    marginTop: 4,
                  }}
                >
                  View Projects →
                </p>
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: "#dc2626",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        {applications.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to application ${i + 1}`}
            style={{
              width: i === activeIndex ? 28 : 8,
              height: 8,
              borderRadius: 999,
              background: i === activeIndex ? "#dc2626" : "#d1d5db",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default ApplicationsSection;

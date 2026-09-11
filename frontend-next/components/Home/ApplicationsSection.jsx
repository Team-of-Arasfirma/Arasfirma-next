"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  API_BASE_URL,
  FALLBACK_IMAGE,
  assertProjectApiUrl,
  categoryKey,
  formatTitleCase,
  firstText,
  extractProjects,
  isPublicProject,
  getProjectImage,
} from "@/lib/services/projectService";

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
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const goToProjects = () => {
    router.push("/projects");
  };

  useEffect(() => {
    const controller = new AbortController();

    const loadApplications = async () => {
      try {
        assertProjectApiUrl();

        const response = await fetch(
          `${API_BASE_URL}/api/projects?status=published`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch projects");
        }

        const data = await response.json();

        const publishedProjects = extractProjects(data).filter(isPublicProject);

        const categoryMap = new Map();

        publishedProjects.forEach((project) => {
          const category = firstText(project.category);

          if (!category) return;

          const key = categoryKey(category);

          if (!categoryMap.has(key)) {
            categoryMap.set(key, {
              label: formatTitleCase(category),
              image: getProjectImage(project) || FALLBACK_IMAGE,
            });
          }
        });

        const dynamicApplications = Array.from(categoryMap.values());

        if (!controller.signal.aborted) {
          setApplications(dynamicApplications);
        }
      } catch {
        if (!controller.signal.aborted) {
          setApplications([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadApplications();

    return () => controller.abort();
  }, []);

  const handleScroll = () => {
    if (!rowRef.current) return;

    const index = Math.round(
      rowRef.current.scrollLeft / (CARD_WIDTH + CARD_GAP)
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

  if (!loading && applications.length === 0) {
    return null;
  }

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
        {applications.length > 1 && (
          <>
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
          </>
        )}

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

          {loading &&
            Array.from({ length: 6 }, (_, index) => (
              <div
                key={`application-skeleton-${index}`}
                className="animate-pulse bg-gray-200"
                style={{
                  minWidth: CARD_WIDTH,
                  maxWidth: CARD_WIDTH,
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                  borderRadius: 20,
                  flexShrink: 0,
                }}
              />
            ))}

          {!loading &&
            applications.map((app) => (
              <div
                key={app.label}
                onClick={() => {
                  if (!isDrag) goToProjects();
                }}
                className="group"
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
                  className="img group-hover:scale-[1.08]"
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
                  onError={(event) => {
                    if (event.currentTarget.src !== FALLBACK_IMAGE) {
                      event.currentTarget.src = FALLBACK_IMAGE;
                    }
                  }}
                />

                <div
                  className="overlay group-hover:opacity-100"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.75), transparent 60%)",
                    opacity: 1,
                    transition: "opacity 0.4s ease",
                  }}
                />

                <div
                  className="label group-hover:translate-y-0"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "16px 20px",
                    transform: "translateY(0)",
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

      {!loading && applications.length > 1 && (
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
      )}
    </section>
  );
};

export default ApplicationsSection;
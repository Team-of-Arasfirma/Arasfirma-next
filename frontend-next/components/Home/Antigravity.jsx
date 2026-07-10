"use client";

import { useState, useEffect, useRef } from "react";

import { useRouter } from "next/navigation";

const SLIDES = [
  {
    id: 1,

    badge: "No.1 PUF Panel Manufacturer",

    heading: "Premium Sandwich Panels",

    sub: "Engineered for excellence — our PUF panels deliver unmatched energy efficiency, fire resistance, and structural integrity for every application.",

    image: "/assets/hero/factory.jpg",
  },

  {
    id: 2,

    badge: "No.1 PUF Panel Manufacturer",

    heading: "Built For Every Industry",

    sub: "From cold storage to industrial sheds, Arasfirma provides customizable panel solutions that meet the strictest quality standards.",

    image: "/assets/hero/hs2.png",
  },

  {
    id: 3,

    badge: "No.1 PUF Panel Manufacturer",

    heading: "Quality You Can Trust",

    sub: "Every panel is tested for strength, thermal performance, and durability before it leaves our factory.",

    image: "/assets/hero/hs3.jpg",
  },
];

// ─────────────────────────────────────────────────────────────

// Floating Orbs

// ─────────────────────────────────────────────────────────────

const AntiGravityOrbs = ({ mousePos }) => {
  const orbs = [
    { x: "10%", y: "20%", size: 80, color: "#dc262622", speed: 0.04 },

    { x: "80%", y: "15%", size: 120, color: "#dc262615", speed: 0.06 },

    { x: "20%", y: "70%", size: 60, color: "#dc262630", speed: 0.03 },

    { x: "70%", y: "65%", size: 100, color: "#dc262618", speed: 0.05 },

    { x: "50%", y: "40%", size: 50, color: "#dc262625", speed: 0.07 },

    { x: "90%", y: "50%", size: 70, color: "#dc262620", speed: 0.04 },
  ];

  return (
    <>
      {orbs.map((orb, i) => {
        const baseX = parseFloat(orb.x) / 100;

        const baseY = parseFloat(orb.y) / 100;

        const dx = (mousePos.x - baseX) * -60 * orb.speed * 10;

        const dy = (mousePos.y - baseY) * -60 * orb.speed * 10;

        return (
          <div
            key={i}

            style={{
              position: "absolute",

              left: orb.x,

              top: orb.y,

              width: orb.size,

              height: orb.size,

              borderRadius: "50%",

              background: orb.color,

              border: "1px solid #dc262633",

              transform: `translate(${dx}px, ${dy}px)`,

              transition: "transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)",

              pointerEvents: "none",

              zIndex: 1,
            }}
          />
        );
      })}
    </>
  );
};

// ─────────────────────────────────────────────────────────────

// Magnetic Button

// ─────────────────────────────────────────────────────────────

const MagneticButton = ({ children, onClick, primary }) => {
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    const btn = btnRef.current;

    if (!btn) return;

    const rect = btn.getBoundingClientRect();

    const cx = rect.left + rect.width / 2;

    const cy = rect.top + rect.height / 2;

    const dx = (e.clientX - cx) * 0.35;

    const dy = (e.clientY - cy) * 0.35;

    btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.08)`;
  };

  const resetButton = (e) => {
    const btn = btnRef.current;

    if (!btn) return;

    btn.style.transform = "translate(0px,0px) scale(1)";

    if (primary) {
      e.currentTarget.style.boxShadow = "0 4px 15px rgba(220,38,38,0.3)";
    } else {
      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
    }
  };

  return (
    <button
      ref={btnRef}

      onClick={onClick}

      onMouseMove={handleMouseMove}

      onMouseLeave={resetButton}

      onMouseEnter={(e) => {
        if (primary) {
          e.currentTarget.style.boxShadow = "0 8px 30px rgba(220,38,38,0.5)";
        } else {
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
        }
      }}

      style={{
        transition:
          "transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.3s ease",

        background: primary ? "#dc2626" : "white",

        color: primary ? "white" : "#374151",

        border: primary ? "none" : "1.5px solid #d1d5db",

        padding: "14px 32px",

        borderRadius: 999,

        fontWeight: 700,

        fontSize: 14,

        cursor: "pointer",

        boxShadow: primary
          ? "0 4px 15px rgba(220,38,38,0.3)"
          : "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      {children}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────

// Hero Carousel

// ─────────────────────────────────────────────────────────────

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  const [animating, setAnimating] = useState(false);

  const [mousePos, setMousePos] = useState({
    x: 0.5,

    y: 0.5,
  });

  const [imgTilt, setImgTilt] = useState({
    x: 0,

    y: 0,
  });

  const sectionRef = useRef(null);

  const router = useRouter();

  const goTo = (i) => {
    if (animating || i === current) return;

    setAnimating(true);

    setTimeout(() => {
      setCurrent(i);

      setAnimating(false);
    }, 350);
  };

  const next = () => {
    goTo((current + 1) % SLIDES.length);
  };

  const prev = () => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length);
  };

  useEffect(() => {
    const t = setInterval(next, 6000);

    return () => clearInterval(t);
  }, [current]);

  const handleMouseMove = (e) => {
    const section = sectionRef.current;

    if (!section) return;

    const rect = section.getBoundingClientRect();

    const nx = (e.clientX - rect.left) / rect.width;

    const ny = (e.clientY - rect.top) / rect.height;

    setMousePos({
      x: nx,

      y: ny,
    });

    const tiltX = (ny - 0.5) * -24;

    const tiltY = (nx - 0.5) * 24;

    setImgTilt({
      x: tiltX,

      y: tiltY,
    });
  };

  const handleMouseLeave = () => {
    setMousePos({
      x: 0.5,

      y: 0.5,
    });

    setImgTilt({
      x: 0,

      y: 0,
    });
  };

  const slide = SLIDES[current];

  return (
    <section
      ref={sectionRef}

      onMouseMove={handleMouseMove}

      onMouseLeave={handleMouseLeave}

      style={{
        minHeight: "100vh",

        background: "#fdf6ee",

        position: "relative",

        overflow: "hidden",

        display: "flex",

        alignItems: "center",
      }}
    >
      {/* Background Grid */}

      <div
        style={{
          position: "absolute",

          inset: 0,

          backgroundImage:
            "radial-gradient(circle, #d4b896 1px, transparent 1px)",

          backgroundSize: "26px 26px",

          opacity: 0.45,

          pointerEvents: "none",
        }}
      />

      {/* Floating Orbs */}

      <AntiGravityOrbs mousePos={mousePos} />

      {/* Main Content */}

      <div
        style={{
          position: "relative",

          zIndex: 10,

          width: "100%",

          maxWidth: 1280,

          margin: "0 auto",

          padding: "140px 64px 80px",

          display: "flex",

          alignItems: "center",

          justifyContent: "space-between",

          gap: 64,

          flexWrap: "wrap",
        }}
      >
        {/* LEFT */}

        <div
          style={{
            flex: 1,

            minWidth: 300,
          }}
        >
          <span
            style={{
              display: "inline-block",

              fontSize: 11,

              fontWeight: 700,

              textTransform: "uppercase",

              letterSpacing: 2,

              color: "#6b7280",

              border: "1px solid #d1d5db",

              background: "rgba(255,255,255,0.8)",

              padding: "6px 18px",

              borderRadius: 999,

              marginBottom: 24,
            }}
          >
            {slide.badge}
          </span>

          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 64px)",

              fontWeight: 900,

              color: "#111827",

              lineHeight: 1.1,

              marginBottom: 20,
            }}
          >
            {slide.heading}
          </h1>

          <p
            style={{
              fontSize: 16,

              color: "#6b7280",

              lineHeight: 1.7,

              maxWidth: 460,

              marginBottom: 36,
            }}
          >
            {slide.sub}
          </p>

          {/* Buttons */}

          <div
            style={{
              display: "flex",

              gap: 16,

              flexWrap: "wrap",
            }}
          >
            <MagneticButton
              primary

              onClick={() => router.push("/contact")}
            >
              Request a Quote
            </MagneticButton>

            <MagneticButton
              onClick={() => {
                window.open(
                  "https://drive.google.com/uc?export=download&id=1swnF7FYXZZWrkHVpxr6ZQCp499ZkUmCL",

                  "_blank",
                );
              }}
            >
              ⬇ Download Brochure
            </MagneticButton>
          </div>

          {/* Dots */}

          <div
            style={{
              display: "flex",

              gap: 8,

              marginTop: 48,
            }}
          >
            {SLIDES.map((_, i) => (
              <button
                key={i}

                onClick={() => goTo(i)}

                style={{
                  width: i === current ? 36 : 10,

                  height: 10,

                  borderRadius: 999,

                  border: "none",

                  background: i === current ? "#dc2626" : "#d1d5db",

                  cursor: "pointer",

                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT IMAGE */}

        <div
          style={{
            flex: 1,

            minWidth: 300,

            display: "flex",

            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "relative",

              width: "100%",

              maxWidth: 520,
            }}
          >
            <div
              style={{
                transform: `perspective(1000px)

                rotateX(${imgTilt.x}deg)

                rotateY(${imgTilt.y}deg)`,

                transition: "transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",

                borderRadius: 28,

                overflow: "hidden",

                boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              }}
            >
              <img
                src={slide.image}

                alt={slide.heading}

                style={{
                  width: "100%",

                  aspectRatio: "4/3",

                  objectFit: "cover",

                  display: "block",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Arrow Buttons */}

      <div
        style={{
          position: "absolute",

          right: 24,

          top: "50%",

          transform: "translateY(-50%)",

          display: "flex",

          flexDirection: "column",

          gap: 10,

          zIndex: 20,
        }}
      >
        {[
          { label: "↑", fn: prev },

          { label: "↓", fn: next },
        ].map(({ label, fn }) => (
          <button
            key={label}

            onClick={fn}

            style={{
              width: 38,

              height: 38,

              borderRadius: "50%",

              background: "white",

              border: "1px solid #e5e7eb",

              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",

              cursor: "pointer",

              fontSize: 16,

              display: "flex",

              alignItems: "center",

              justifyContent: "center",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;

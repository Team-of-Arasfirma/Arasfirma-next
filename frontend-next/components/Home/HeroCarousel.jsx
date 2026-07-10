"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { createInquiry } from "@/lib/inquiryService";

const SLIDES = [
  {
    id: 1,
    badge: "No.1 PUF Panel Manufacturer",
    heading: "Premium Sandwich Panels",
    sub: "Engineered for excellence — our PUF panels deliver unmatched energy efficiency, fire resistance, and structural integrity for every application.",
    image: "/assets/hero/factory.jpg",
    shimmer: "from-red-500 via-orange-400 to-red-500",
    ring: "rgba(220,38,38,0.18)",
    btnBg: "#dc2626",
    btnHover: "#b91c1c",
    btnShadow: "rgba(220,38,38,0.35)",
  },
  {
    id: 2,
    badge: "No.1 PUF Panel Manufacturer",
    heading: "Built For Every Industry",
    sub: "From cold storage to industrial sheds, Arasfirma provides customizable panel solutions that meet the strictest quality standards.",
    image: "/assets/hero/hs2.png",
    shimmer: "from-rose-500 via-orange-400 to-rose-500",
    ring: "rgba(244,63,94,0.18)",
    btnBg: "#f43f5e",
    btnHover: "#e11d48",
    btnShadow: "rgba(244,63,94,0.35)",
  },
  {
    id: 3,
    badge: "No.1 PUF Panel Manufacturer",
    heading: "Quality You Can Trust",
    sub: "Every panel is tested for strength, thermal performance, and durability before it leaves our factory.",
    image: "/assets/hero/hs3.jpg",
    shimmer: "from-teal-500 via-cyan-400 to-teal-500",
    ring: "rgba(13,148,136,0.18)",
    btnBg: "#0d9488",
    btnHover: "#0f766e",
    btnShadow: "rgba(13,148,136,0.35)",
  },
];

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

const MagneticButton = ({ children, onClick, primary, btnBg, btnShadow }) => {
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    const btn = btnRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.35;

    btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.08)`;
  };

  const reset = () => {
    const btn = btnRef.current;
    if (!btn) return;
    btn.style.transform = "translate(0,0) scale(1)";
  };

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = primary
          ? `0 8px 30px ${btnShadow}`
          : "0 8px 20px rgba(0,0,0,0.15)";
      }}
      style={{
        transition:
          "transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.3s ease, background 0.3s ease",
        background: primary ? btnBg || "#dc2626" : "white",
        color: primary ? "white" : "#374151",
        border: primary ? "none" : "1.5px solid #d1d5db",
        padding: "14px 32px",
        borderRadius: 999,
        fontWeight: 700,
        fontSize: 14,
        cursor: "pointer",
        boxShadow: primary
          ? `0 4px 15px ${btnShadow}`
          : "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      {children}
    </button>
  );
};

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [imgTilt, setImgTilt] = useState({ x: 0, y: 0 });

  // Popup states
  const [openModal, setOpenModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    sqft: "",
  });

  const sectionRef = useRef(null);
  const slide = SLIDES[current];

  const goTo = (i) => {
    if (animating || i === current) return;

    setAnimating(true);

    setTimeout(() => {
      setCurrent(i);
      setAnimating(false);
    }, 350);
  };

  const next = () => goTo((current + 1) % SLIDES.length);
  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [current]);

  const handleMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;

    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;

    setMousePos({ x: nx, y: ny });
    setImgTilt({
      x: (ny - 0.5) * -24,
      y: (nx - 0.5) * 24,
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0.5, y: 0.5 });
    setImgTilt({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setIsVisible(true)),
      );
    } else {
      setIsVisible(false);

      const timer = setTimeout(() => {
        document.body.style.overflow = "";
      }, 380);

      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [openModal]);

  const closeModal = () => {
    setOpenModal(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.mobile,
        subject: "Quote Request",
        message: `Quote Request. City: ${
          formData.city
        }, Sq Ft: ${formData.sqft || "Not specified"}`,
        businessName: formData.name,
        city: formData.city,
        sqFt: formData.sqft,
        isQuote: true,
      });

      toast.success("Quote Request Sent Successfully!");

      setFormData({
        name: "",
        mobile: "",
        email: "",
        city: "",
        sqft: "",
      });

      closeModal();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to submit quote request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Eg. Business Consulting",
      required: true,
    },
    {
      name: "mobile",
      label: "Mobile Number",
      type: "tel",
      placeholder: "Enter Mobile number",
      required: true,
    },
    {
      name: "email",
      label: "Mail ID",
      type: "email",
      placeholder: "Eg. arun@gmail.com",
      required: true,
    },
    {
      name: "city",
      label: "City",
      type: "text",
      placeholder: "Enter your city",
      required: true,
    },
    {
      name: "sqft",
      label: "Approximate Sq Ft Required",
      type: "text",
      placeholder: "e.g. 5,000 sq ft",
      required: false,
    },
  ];

  return (
    <>
      <style>{`
        .qm-overlay { opacity:0; transition:opacity .35s ease; }
        .qm-overlay.vis { opacity:1; }

        .qm-card {
          opacity:0;
          transform:translateY(52px) scale(0.96);
          transition:opacity .38s ease, transform .38s cubic-bezier(0.34,1.56,0.64,1);
        }

        .qm-card.vis {
          opacity:1;
          transform:translateY(0) scale(1);
        }

        .qm-field {
          opacity:0;
          transform:translateX(-18px);
          transition:opacity .28s ease, transform .28s ease;
        }

        .qm-field.vis {
          opacity:1;
          transform:translateX(0);
        }

        .qm-field:nth-child(1){transition-delay:.07s}
        .qm-field:nth-child(2){transition-delay:.13s}
        .qm-field:nth-child(3){transition-delay:.19s}
        .qm-field:nth-child(4){transition-delay:.25s}
        .qm-field:nth-child(5){transition-delay:.31s}

        .qm-btns {
          opacity:0;
          transform:translateY(14px);
          transition:opacity .28s ease .37s, transform .28s ease .37s;
        }

        .qm-btns.vis {
          opacity:1;
          transform:translateY(0);
        }

        .qm-input {
          transition:background .2s, border-color .2s, box-shadow .2s;
        }

        .qm-input:focus {
          outline:none;
          background:#fff;
        }

        @keyframes shimmer {
          0% {background-position:-200% center}
          100% {background-position: 200% center}
        }

        .qm-shimmer {
          background-size:200% auto;
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:shimmer 3s linear infinite;
        }

        @keyframes bar-slide {
          from {transform:translateX(-100%)}
          to {transform:translateX(100%)}
        }

        .qm-bar {
          position:relative;
          overflow:hidden;
        }

        .qm-bar::after {
          content:'';
          position:absolute;
          inset:0;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent);
          animation:bar-slide 2s ease-in-out infinite;
        }

        @keyframes ripple {
          from {transform:scale(0); opacity:.4}
          to {transform:scale(4); opacity:0}
        }

        .qm-ripple {
          position:relative;
          overflow:hidden;
        }

        .qm-ripple .rpl {
          position:absolute;
          border-radius:50%;
          width:60px;
          height:60px;
          background:rgba(255,255,255,.35);
          margin:-30px 0 0 -30px;
          animation:ripple .55s linear;
          pointer-events:none;
        }

        .hero-content {
          padding: 100px 20px 60px;
          flex-direction: column;
          gap: 32px;
        }

        .hero-col-left {
          flex: 1;
          min-width: 0;
          width: 100%;
        }

        .hero-col-right {
          flex: 1;
          min-width: 0;
          width: 100%;
        }

        .hero-arrow-nav {
          display: none;
        }

        .hero-btn-row {
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }

        .hero-btn-row button {
          width: 100%;
        }

        @media (min-width: 640px) {
          .hero-content {
            padding: 120px 40px 60px;
            gap: 40px;
          }

          .hero-btn-row {
            flex-direction: row;
            align-items: center;
          }

          .hero-btn-row button {
            width: auto;
          }
        }

        @media (min-width: 768px) {
          .hero-content {
            padding: 140px 48px 80px;
            flex-direction: row;
            gap: 48px;
          }

          .hero-col-left {
            min-width: 280px;
          }

          .hero-col-right {
            min-width: 280px;
          }

          .hero-arrow-nav {
            display: flex;
          }
        }

        @media (min-width: 1024px) {
          .hero-content {
            padding: 140px 64px 80px;
            gap: 64px;
          }

          .hero-col-left {
            min-width: 340px;
          }

          .hero-col-right {
            min-width: 340px;
          }
        }
      `}</style>

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

        <AntiGravityOrbs mousePos={mousePos} />

        <div
          className="hero-content"
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxSizing: "border-box",
          }}
        >
          <div className="hero-col-left" style={{ flex: 1 }}>
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
                fontSize: "clamp(36px,5vw,64px)",
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

            <div
              className="hero-btn-row"
              style={{ display: "flex", flexWrap: "wrap" }}
            >
              <MagneticButton
                primary
                btnBg={slide.btnBg}
                btnShadow={slide.btnShadow}
                onClick={() => setOpenModal(true)}
              >
                Request a Quote
              </MagneticButton>

              <MagneticButton
                onClick={() =>
                  window.open(
                    "https://drive.google.com/uc?export=download&id=1swnF7FYXZZWrkHVpxr6ZQCp499ZkUmCL",
                    "_blank",
                  )
                }
              >
                ⬇ Download Brochure
              </MagneticButton>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 48 }}>
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  style={{
                    width: i === current ? 36 : 10,
                    height: 10,
                    borderRadius: 999,
                    border: "none",
                    background: i === current ? slide.btnBg : "#d1d5db",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>
          </div>

          <div
            className="hero-col-right"
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div style={{ position: "relative", width: "100%", maxWidth: 520 }}>
              <div
                style={{
                  transform: `perspective(1000px) rotateX(${imgTilt.x}deg) rotateY(${imgTilt.y}deg)`,
                  transition:
                    "transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
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

        <div
          className="hero-arrow-nav"
          style={{
            position: "absolute",
            right: 24,
            top: "50%",
            transform: "translateY(-50%)",
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
              type="button"
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

      {openModal && (
        <div
          className={`qm-overlay ${
            isVisible ? "vis" : ""
          } fixed inset-0 z-50 flex items-center justify-center p-4`}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div
            className={`qm-card ${
              isVisible ? "vis" : ""
            } relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden`}
          >
            <div
              className={`qm-bar h-1 w-full bg-gradient-to-r ${slide.shimmer}`}
            />

            <div className="px-8 pt-6 pb-3 flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
                  Arasfirma · Quote Request
                </p>

                <h3
                  className={`qm-shimmer text-xl font-black bg-gradient-to-r ${slide.shimmer}`}
                >
                  Get a Custom Quote
                </h3>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="mt-1 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 active:scale-90 transition-all"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 pb-8 pt-2 space-y-4">
              {fields.map((field) => (
                <div
                  key={field.name}
                  className={`qm-field ${isVisible ? "vis" : ""} space-y-1.5`}
                >
                  <label
                    className="block text-xs font-semibold uppercase tracking-wide transition-colors"
                    style={{
                      color:
                        focusedField === field.name ? slide.btnBg : "#6b7280",
                    }}
                  >
                    {field.label}{" "}
                    {field.required && <span className="text-red-400">*</span>}
                  </label>

                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    onFocus={() => setFocusedField(field.name)}
                    onBlur={() => setFocusedField(null)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="qm-input w-full px-4 py-3 rounded-xl bg-gray-100 border-2 border-transparent text-sm text-gray-800 placeholder-gray-400"
                    style={
                      focusedField === field.name
                        ? {
                            borderColor: slide.btnBg,
                            boxShadow: `0 0 0 3px ${slide.ring}`,
                            background: "#fff",
                          }
                        : {}
                    }
                  />
                </div>
              ))}

              <div
                className={`qm-btns ${
                  isVisible ? "vis" : ""
                } flex items-center gap-3 pt-2`}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm uppercase tracking-wide hover:bg-gray-50 active:scale-[0.97] transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={(e) => {
                    if (isSubmitting) return;

                    const btn = e.currentTarget;
                    const ripple = document.createElement("span");
                    ripple.className = "rpl";

                    const rect = btn.getBoundingClientRect();
                    ripple.style.left = `${e.clientX - rect.left}px`;
                    ripple.style.top = `${e.clientY - rect.top}px`;

                    btn.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 600);
                  }}
                  className={`qm-ripple flex-1 py-3 rounded-xl text-white font-semibold text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? "opacity-70 cursor-not-allowed"
                      : "active:scale-[0.97]"
                  }`}
                  style={{
                    background: slide.btnBg,
                    boxShadow: `0 4px 14px ${slide.btnShadow}`,
                  }}
                >
                  {isSubmitting ? "Sending..." : "Send Request →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroCarousel;

"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// ════════════════════════════════════════════════════════
// 1. SCROLL ANIMATIONS
// Usage: <div data-animate="up" data-delay="200">...</div>
// Values: up | down | left | right | zoom | flip
// ════════════════════════════════════════════════════════
export const useScrollAnimation = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Re-run when page changes
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll("[data-animate]");

      elements.forEach((el) => {
        const direction = el.getAttribute("data-animate") || "up";
        const delay = el.getAttribute("data-delay") || "0";

        el.style.opacity = "0";
        el.style.transition = `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`;

        switch (direction) {
          case "up":
            el.style.transform = "translateY(50px)";
            break;
          case "down":
            el.style.transform = "translateY(-50px)";
            break;
          case "left":
            el.style.transform = "translateX(-60px)";
            break;
          case "right":
            el.style.transform = "translateX(60px)";
            break;
          case "zoom":
            el.style.transform = "scale(0.8)";
            break;
          case "flip":
            el.style.transform = "rotateX(90deg)";
            break;
          default:
            el.style.transform = "translateY(50px)";
        }
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "none";
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 },
      );

      elements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);
};

// ════════════════════════════════════════════════════════
// 2. PARALLAX SCROLL EFFECT
// Usage: <div data-parallax="0.3">...</div>
// ════════════════════════════════════════════════════════
export const useParallax = () => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const elements = document.querySelectorAll("[data-parallax]");

      elements.forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-parallax")) || 0.3;
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
};

// ════════════════════════════════════════════════════════
// 3. STICKY HERO LOCK
// ════════════════════════════════════════════════════════
export const useStickyHero = (isHomePage = false) => {
  const pathname = usePathname();

  useEffect(() => {
    // Reset all styles first
    const resetAll = () => {
      const hero = document.getElementById("hero-section");

      if (hero) {
        hero.style.position = "";
        hero.style.top = "";
        hero.style.zIndex = "";
        hero.style.height = "";

        let next = hero.nextElementSibling;

        while (next) {
          next.style.position = "";
          next.style.zIndex = "";
          next.style.boxShadow = "";
          next = next.nextElementSibling;
        }
      }

      window.scrollTo(0, 0);
    };

    resetAll();

    if (!isHomePage) return;

    const hero = document.getElementById("hero-section");

    if (!hero) return;

    hero.style.position = "sticky";
    hero.style.top = "0";
    hero.style.zIndex = "1";
    hero.style.height = "100vh";

    let next = hero.nextElementSibling;

    while (next) {
      next.style.position = "relative";
      next.style.zIndex = "2";
      next.style.boxShadow = "0 -12px 50px rgba(0,0,0,0.18)";
      next = next.nextElementSibling;
    }

    return () => {
      resetAll();
    };
  }, [isHomePage, pathname]);
};

// ════════════════════════════════════════════════════════
// 4. BACK TO TOP BUTTON
// ════════════════════════════════════════════════════════
const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: "#dc2626",
        color: "white",
        border: "none",
        fontSize: 20,
        cursor: "pointer",
        zIndex: 9999,
        boxShadow: "0 4px 20px rgba(220,38,38,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1) translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(220,38,38,0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(220,38,38,0.4)";
      }}
      aria-label="Back to top"
    >
      ↑
    </button>
  );
};

// ════════════════════════════════════════════════════════
// MAIN EXPORT
// ════════════════════════════════════════════════════════
const GlobalEffects = ({ isHomePage = false }) => {
  useScrollAnimation();
  useParallax();
  useStickyHero(isHomePage);

  return <BackToTop />;
};

export default GlobalEffects;

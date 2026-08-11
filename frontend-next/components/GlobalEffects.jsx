"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// ============================================================================
// 1. SCROLL ANIMATIONS
// Usage: <div data-animate="up" data-delay="200">...</div>
// Values: up | down | left | right | zoom | flip
// ============================================================================
export const useScrollAnimation = () => {
  const pathname = usePathname();

  useEffect(() => {
    let observer;
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll("[data-animate]");
      if (!elements.length) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, [pathname]);
};

// ============================================================================
// 2. PARALLAX SCROLL EFFECT
// Usage: <div data-parallax="0.3">...</div>
// ============================================================================
export const useParallax = () => {
  useEffect(() => {
    let ticking = false;
    let rafId = 0;

    const updateParallax = () => {
      const elements = document.querySelectorAll("[data-parallax]");
      if (elements.length > 0) {
        const scrollY = window.scrollY;
        elements.forEach((el) => {
          const speed = parseFloat(el.getAttribute("data-parallax")) || 0.3;
          el.style.transform = "translate3d(0, " + scrollY * speed + "px, 0)";
        });
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);
};

// ============================================================================
// 3. STICKY HERO LOCK
// ============================================================================
export const useStickyHero = (isHomePage = false) => {
  useEffect(() => {
    if (!isHomePage) return;

    const hero = document.getElementById("hero-section");
    if (!hero) return;

    hero.classList.add("sticky-hero-section");

    return () => {
      hero.classList.remove("sticky-hero-section");
    };
  }, [isHomePage]);
};

// ============================================================================
// 4. BACK TO TOP BUTTON
// ============================================================================
const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    let rafId = 0;

    const onScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          setVisible(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
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
      className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-red-600 text-white border-none text-xl cursor-pointer z-[9999] shadow-[0_4px_20px_rgba(220,38,38,0.4)] flex items-center justify-center transition-all duration-200 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(220,38,38,0.5)]"
      aria-label="Back to top"
    >
      ?
    </button>
  );
};

// ============================================================================
// MAIN EXPORT
// ============================================================================
const GlobalEffects = ({ isHomePage = false }) => {
  useScrollAnimation();
  useParallax();
  useStickyHero(isHomePage);

  return <BackToTop />;
};

export default GlobalEffects;

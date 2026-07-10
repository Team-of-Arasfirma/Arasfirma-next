"use client";
import { useEffect, useRef } from "react";

const reasons = [
  {
    icon: "/assets/icon/premium.svg",
    title: "Premium Quality",
    desc: "Manufactured using advanced technology and high-grade materials",
  },
  {
    icon: "/assets/icon/energy.svg",
    title: "Energy Efficiency",
    desc: "Superior insulation properties reduce energy loss significantly",
  },
  {
    icon: "/assets/icon/custom.svg",
    title: "Custom Solutions",
    desc: "Tailored designs to meet your specific project requirements",
  },
  {
    icon: "/assets/icon/delivery.svg",
    title: "On-Time Delivery",
    desc: "Efficient production and logistics for timely supply",
  },
  {
    icon: "/assets/icon/expertise.svg",
    title: "Industry Expertise",
    desc: "Years of experience in PUF panel manufacturing",
  },
];

const Card = ({ item, index, delay }) => {
  const cardRef = useRef(null);
  const iconRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(50px)";
    el.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const handleMouseEnter = () => {
    if (boxRef.current) {
      boxRef.current.style.background = "#dc2626";
      boxRef.current.style.borderColor = "#dc2626";
    }
    if (iconRef.current) {
      iconRef.current.style.filter = "brightness(0) invert(1)";
    }
  };

  const handleMouseLeave = () => {
    if (boxRef.current) {
      boxRef.current.style.background = "#fef2f2";
      boxRef.current.style.borderColor = "#fecaca";
    }
    if (iconRef.current) {
      iconRef.current.style.filter =
        "invert(20%) sepia(90%) saturate(500%) hue-rotate(340deg)";
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-full flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-6 hover:border-red-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      <div
        ref={boxRef}
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: "#fef2f2",
          border: "1px solid #fecaca",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 0.3s ease",
        }}
      >
        <img
          ref={iconRef}
          src={item.icon}
          alt={item.title}
          style={{
            width: 28,
            height: 28,
            objectFit: "contain",
            transition: "filter 0.3s ease",
            filter: "invert(20%) sepia(90%) saturate(500%) hue-rotate(340deg)",
          }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      <div>
        <p className="font-black text-gray-900 mb-1 group-hover:text-red-600 transition-colors duration-300">
          {item.title}
        </p>
        <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
      </div>
    </div>
  );
};

const WhyChooseUs = () => {
  const titleRef = useRef(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.7s ease, transform 0.7s ease";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const topRow = reasons.slice(0, 3);
  const bottomRow = reasons.slice(3, 5);

  return (
    <section className="w-full py-12 md:py-20 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-10 md:mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Our Strengths
          </p>
          <h2 className="text-xl sm:text-2xl md:text-4xl font-black uppercase text-gray-900 mb-3">
            Why Choose Us?
          </h2>
          <div className="w-16 h-1 bg-red-600 rounded mx-auto" />
        </div>

        {/* Top Row — 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {topRow.map((item, i) => (
            <Card key={item.title} item={item} index={i} delay={i * 150} />
          ))}
        </div>
        {/* Bottom Row — 2 cards centered */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mt-5 md:mt-6 lg:flex lg:justify-center">
          {bottomRow.map((item, i) => (
            <div key={item.title} className="w-full lg:w-[calc(33.333%-16px)]">
              <Card item={item} index={i + 3} delay={(i + 3) * 150} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

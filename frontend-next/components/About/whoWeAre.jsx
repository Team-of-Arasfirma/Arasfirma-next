"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 1000, suffix: "+", label: "Project Completed" },
  { value: 262, suffix: "+", label: "Industries Served" },
  { value: 17, suffix: "+", label: "Commitment" },
  { value: 6, suffix: "+", label: "Industry Experience" },
];

// ── Count-up hook ──
const useCountUp = (target, started) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const duration = 1800;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [started, target]);

  return count;
};

// ── Single stat card ──
const StatCard = ({ value, suffix, label, delay, started, index }) => {
  const count = useCountUp(value, started);

  return (
    <div
      key={label}
      data-animate="up"
      data-delay={index * 100}
      className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 hover:border-red-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p className="text-3xl font-black text-red-600 mb-1">
        {count}
        {suffix}
      </p>
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
        {label}
      </p>
    </div>
  );
};

const WhoWeAre = () => {
  const sectionRef = useRef(null);
  const [started, setStarted] = useState(false);

  // ── Trigger count when section enters viewport ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.3 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* ── Heading — red color ── */}
        <p
          data-animate="up"
          className="text-md font-bold uppercase tracking-widest mb-2 text-red-600"
        >
          Who We Are
        </p>

        <div data-animate="left" className="w-16 h-1 bg-red-600 rounded mb-6" />

        <p
          data-animate="up"
          data-delay="100"
          className="text-sm text-gray-600 leading-relaxed max-w-4xl mb-12"
        >
          Arasfirma Is A Well-Born In The Industrial Building Materials
          Industry, Specializing In High-Performance Insulation PUF Panels For
          Roofs And Walls. With A Legacy Built On Precision, Performance, And
          Progress.
        </p>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <StatCard
              key={s.label}
              value={s.value}
              suffix={s.suffix}
              label={s.label}
              delay={i * 100}
              started={started}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;

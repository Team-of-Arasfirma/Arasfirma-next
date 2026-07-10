"use client";

import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";

const CareerHero = ({ jobCount = 0 }) => {
  const scrollToJobs = () => {
    document
      .getElementById("job-listings")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[560px] flex items-center overflow-hidden bg-[#ffffff] pt-32 pb-16 px-6">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, #dc2626 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full text-center">
        {/* Hiring Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#e5e7eb] bg-[#f9fafb] text-[#dc2626] text-sm font-semibold mb-8 shadow-sm"
        >
          <Sparkles size={14} />
          <span>
            We&apos;re Hiring - {jobCount} Open Position
            {jobCount !== 1 ? "s" : ""}
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-[#1f2937] uppercase leading-tight mb-6"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Grow Your Career With{" "}
          <span className="text-[#dc2626]">Arasfirma</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-lg text-[#6b7280] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Join a team that values innovation, responsibility, and continuous
          growth. Explore opportunities to build your skills, contribute to
          meaningful work, and grow with Arasfirma.
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={scrollToJobs}
            className="group px-8 py-4 rounded-xl bg-[#dc2626] text-[#ffffff] font-semibold text-base hover:bg-[#f87171] transition-all duration-300 shadow-lg shadow-[#dc2626]/20 hover:shadow-xl hover:shadow-[#dc2626]/25 flex items-center gap-2"
          >
            View Open Roles
            <ArrowDown
              size={16}
              className="group-hover:translate-y-1 transition-transform"
            />
          </button>
        </motion.div>

        {/* Career Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 gap-4 sm:gap-8 max-w-md mx-auto border-t border-[#e5e7eb] pt-10"
        >
          {[
            { label: "Team Members", value: "50+" },
            { label: "Open Roles", value: jobCount },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-black text-[#1f2937] mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-[#9ca3af] uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CareerHero;

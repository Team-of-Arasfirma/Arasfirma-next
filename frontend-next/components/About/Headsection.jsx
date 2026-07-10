"use client";

import { useRouter } from "next/navigation";

const AboutHero = () => {
  const router = useRouter();

  return (
    <section
      className="w-full min-h-[360px] flex items-center relative overflow-hidden pt-40 pb-12 px-6 bg-white"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #ffffff 100%)",
      }}
    >
      {/* Background dotted pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, #dc2626 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="hover:text-red-400 transition-colors"
          >
            Home
          </button>

          <span>→</span>

          <span className="text-red-400 font-semibold">About Us</span>
        </div>

        {/* Page title */}
        <h1
          data-animate="up"
          className="text-5xl md:text-7xl font-black text-gray-800 uppercase leading-tight mb-4"
        >
          About <span className="text-red-600">Us</span>
        </h1>

        {/* Page description */}
        <p
          data-animate="up"
          data-delay="200"
          className="text-gray-500 text-base max-w-2xl leading-relaxed"
        >
          Arasfirma is a trusted name in the insulated building materials
          industry, specializing in high-performance Sandwich PUF Panels for
          roofs and walls. With a legacy built on precision, performance, and
          progress, we empower industrial and commercial spaces with superior
          thermal insulation and structural strength.
        </p>
      </div>
    </section>
  );
};

export default AboutHero;

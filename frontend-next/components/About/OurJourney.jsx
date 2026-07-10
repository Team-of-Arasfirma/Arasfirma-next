"use client";

const milestones = [
  {
    year: "2020",

    title: "Company Established",

    desc: "Founded with a vision to transform India's insulation industry.",

    icon: "/assets/icon/commercialIcon.svg", // ← replace with your filename
  },

  {
    year: "2021",

    title: "Rapid Market Expansion",

    desc: "Expanded operations across South India with 100+ projects.",

    icon: "/assets/icon/MarketExpansion.svg", // ← replace with your filename
  },

  {
    year: "2023",

    title: "Operational Scale-Up",

    desc: "Scaled manufacturing capacity to meet growing demand.",

    icon: "/assets/icon/OperationalScale.svg", // ← replace with your filename
  },

  {
    year: "2025",

    title: "Industry's Largest Growth",

    desc: "Became India's No.1 trusted PUF panel manufacturer.",

    icon: "/assets/icon/IndustryGrowth.svg", // ← replace with your filename
  },
];

const OurJourney = () => {
  return (
    <section className="w-full py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}

        <div data-animate="up" className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Our Journey
          </p>

          <h2 className="text-2xl md:text-3xl font-black uppercase text-gray-900 mb-2">
            Our Story So Far
          </h2>

          <div className="w-16 h-1 bg-red-600 rounded" />
        </div>

        {/* ── Timeline ── */}

        <div className="relative">
          {/* Horizontal line */}

          <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-red-100" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {milestones.map((m, i) => (
              <div
                key={m.year}

                data-animate="up"

                data-delay={i * 150}

                className="flex flex-col items-center text-center relative"
              >
                {/* Icon Circle */}

                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-4 relative z-10 border-4 border-white shadow-lg"

                  style={{ background: i % 2 === 0 ? "#dc2626" : "#1f2937" }}
                >
                  <img
                    src={m.icon}

                    alt={m.title}

                    className="w-9 h-9 object-contain"

                    style={{ filter: "brightness(0) invert(1)" }} // makes icon white
                  />
                </div>

                {/* Year Badge */}

                <span
                  className="text-xs font-black text-white px-3 py-1 rounded-full mb-3"

                  style={{ background: i % 2 === 0 ? "#dc2626" : "#1f2937" }}
                >
                  {m.year}
                </span>

                {/* Title */}

                <p className="font-black text-gray-900 text-sm mb-2">
                  {m.title}
                </p>

                {/* Description */}

                <p className="text-xs text-gray-500 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurJourney;

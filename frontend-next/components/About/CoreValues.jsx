"use client";

const values = [
  {
    icon: "/assets/icon/QualityFirst.svg", // ← replace with your filename

    title: "Quality First",

    desc: "Uncompromising quality in every panel we manufacture.",

    color: "#fef2f2",
  },

  {
    icon: "/assets/icon/BuiltToLast.svg", // ← replace with your filename

    title: "Built To Last",

    desc: "Engineered for durability and long-term structural reliability.",

    color: "#fff7ed",
  },

  {
    icon: "/assets/icon/Innovation.svg", // ← replace with your filename

    title: "Innovation Always",

    desc: "Consistently adopting new technology to improve performance.",

    color: "#eff6ff",
  },

  {
    icon: "/assets/icon/Sustainability.svg", // ← replace with your filename

    title: "Sustainability At Heart",

    desc: "Eco-conscious manufacturing for a greener tomorrow.",

    color: "#f0fdf4",
  },
];

const CoreValues = () => {
  return (
    <section className="w-full py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}

        <div data-animate="up" className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            What We Stand For
          </p>

          <h2 className="text-2xl md:text-3xl font-black uppercase text-gray-900 mb-3">
            Core Values That Drive Us
          </h2>

          <div className="w-16 h-1 bg-red-600 rounded mx-auto" />
        </div>

        {/* ── Cards ── */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div
              key={v.title}

              data-animate="up"

              data-delay={i * 120}

              className="rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group"

              style={{ background: v.color }}
            >
              {/* ✅ Local icon as <img> instead of emoji */}

              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <img
                  src={v.icon}

                  alt={v.title}

                  className="w-9 h-9 object-contain"
                />
              </div>

              <h3 className="font-black text-gray-900 mb-2">{v.title}</h3>

              <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValues;

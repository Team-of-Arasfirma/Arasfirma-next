// ✅ No imports needed at top — DELETE these 3 lines

// import missionIcon from "../public/assets/icon/OurMission.svg";

// import visionIcon  from "../public/assets/icon/OurVision.svg";

// import valueIcon   from "../public/assets/icon/OurVision.svg";

const cards = [
  {
    icon: "/assets/icon/OurMission.svg", // ✅ just the path string

    title: "Our Mission",

    color: "#fef2f2",

    border: "#fecaca",

    text: "At Arasfirma, Our Mission Is To Deliver Industry-Leading Roofing Solutions That Ensure Safety, Durability, And Peak Performance For Both Industrial And Domestic Applications.",
  },

  {
    icon: "/assets/icon/OurVision.svg",

    title: "Our Vision",

    color: "#eff6ff",

    border: "#bfdbfe",

    text: "Our Vision Is To Revolutionize The Roofing Landscape In India By Creating A Brighter, More Sustainable Future Where Innovation, Quality, And Environmental Responsibility Go Hand In Hand.",
  },

  {
    icon: "/assets/icon/OurValue.svg", // ✅ fixed — was OurVision.svg before

    title: "Our Value",

    color: "#fdf4ff",

    border: "#e9d5ff",

    text: "At Arasfirma, Our Values Are Rooted In Innovation, Quality, And Integrity. We Are Committed To Providing Reliable And Sustainable Solutions That Prioritize Customer Satisfaction.",
  },
];

const MissionVision = () => {
  return (
    <section className="w-full py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div data-animate="up" className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Our Mission & Vision
          </p>

          <h2 className="text-2xl md:text-3xl font-black uppercase text-gray-900 mb-2">
            Driving Innovation And Excellence In Everything We Do
          </h2>

          <div className="w-16 h-1 bg-red-600 rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <div
              key={card.title}

              data-animate="up"

              data-delay={i * 150}

              className="rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"

              style={{
                background: card.color,
                border: `1.5px solid ${card.border}`,
              }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-white shadow-sm">
                <img
                  src={card.icon}

                  alt={card.title}

                  className="w-7 h-7 object-contain"
                />
              </div>

              <h3 className="text-lg font-black text-gray-900 mb-3">
                {card.title}
              </h3>

              <p className="text-xs text-gray-600 leading-relaxed">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionVision;

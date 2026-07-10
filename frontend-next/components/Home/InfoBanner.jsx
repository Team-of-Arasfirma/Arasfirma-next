const InfoBanner = () => {
  const features = [
    {
      icon: "/assets/icon/manufacturingIcon.svg",
      title: "Manufacturing Unit",
    },
    {
      icon: "/assets/icon/bulkIcon.svg",
      title: "Bulk Production",
    },
    {
      icon: "/assets/icon/fireIcon.svg",
      title: "Fire Retardant",
    },
  ];

  return (
    <section className="w-full bg-white py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-black uppercase text-red-600 leading-tight mb-3">
            Building Stronger Structures With Advanced Insulation Technology
          </h2>
          <p className="text-sm md:text-md text-gray-500 leading-relaxed">
            Delivering High-Performance Insulation Solutions Engineered For
            Durability, Efficiency, And Long-Term Structural Strength.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center justify-center gap-2 border-2 border-red-500 rounded-2xl px-4 py-4 w-28 h-28 sm:w-32 sm:h-32 hover:bg-red-50 transition-colors duration-200"
            >
              <img
                src={feature.icon}
                alt={feature.title}
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain"
              />
              <p className="text-xs font-semibold text-red-600 text-center leading-tight">
                {feature.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoBanner;

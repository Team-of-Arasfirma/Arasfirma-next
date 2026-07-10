const categories = [
  { icon: "/assets/icon/industrialIcon.svg", label: "Industrial Sheds" },
  { icon: "/assets/icon/warehouseIcon.svg", label: "Warehouses" },
  { icon: "/assets/icon/coldStorageIcon.svg", label: "Cold Storage" },
  { icon: "/assets/icon/commercialIcon.svg", label: "Commercial Buildings" },
  { icon: "/assets/icon/residentialIcon.svg", label: "Residential Projects" },
];

const ManufacturingExcellence = () => {
  return (
    <section className="w-full py-12 md:py-16 px-4 sm:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-center text-gray-900 mb-8 md:mb-10">
          Our Manufacturing Excellence
        </h2>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-10">
          {categories.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center justify-center gap-3 bg-gray-900 text-white rounded-2xl px-5 py-5 sm:px-8 sm:py-6 w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 hover:bg-red-600 transition-colors duration-300 cursor-pointer group"
            >
              <img
                src={item.icon}
                alt={item.label}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain brightness-0 invert group-hover:brightness-0 group-hover:invert"
              />
              <p className="text-xs font-semibold text-center leading-tight">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManufacturingExcellence;

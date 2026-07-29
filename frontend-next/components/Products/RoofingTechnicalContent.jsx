const technicalDetails = [
  {
    title: "Profile Specifications",
    text: "The roofing profile offers an effective cover width of 1000 mm and an overall width of 1090 mm, ensuring optimal coverage and fewer installation joints. It features four crests spaced at 335 mm, paired with a 45 mm deep rib, a design that significantly boosts rigidity and improves water flow during heavy rains. The sheets can be manufactured in lengths ranging from 1500 mm to 16,000 mm, offering flexibility for various building spans and architectural layouts.",
  },
  {
    title: "Sheet Thickness Options",
    text: "Both top and bottom sheets are available in thicknesses ranging from 0.35 mm to 0.60 mm, allowing customisation based on structural load requirements, insulation needs, and project budget. This adjustable thickness range ensures the panel can be adapted for light commercial use as well as heavy industrial applications.",
  },
  {
    title: "Coating Systems",
    text: "The panels are protected with advanced coating options, including Z70 GSM, AZ150 GSM, and additional coatings tailored to project needs. These coatings significantly enhance corrosion resistance, ensuring long-term durability even in humid, coastal or industrial environments.",
  },
  {
    title: "Paint Types Available",
    text: "A variety of paint systems, RMP, SDP, SMP and PVDF are available to improve UV stability, colour retention and surface protection. These coatings help maintain the roof's aesthetic appeal while enhancing its resistance to harsh weather.",
  },
  {
    title: "Mechanical Characteristics of PU Foam",
    text: "The insulation core has a density of 40 ± 2 kg/m³ and exhibits exceptional mechanical strength, with tensile, compression, and shear strengths of 150–250 kPa, 100–210 kPa, and 100–240 kPa, respectively. These capabilities ensure the panel remains dimensionally stable under mechanical load, wind pressure and varying temperatures.",
  },
  {
    title: "Thermal & Moisture Properties",
    text: "PUF panels deliver excellent insulation, with a low thermal conductivity of 0.020 W/mK, helping maintain efficient indoor temperature control. The foam has a 93% closed-cell structure and absorbs only 1% water after 24 hours, preventing moisture penetration and ensuring long-lasting insulation performance.",
  },
];

const materialOptions = [
  "Pre-painted galvanised steel",
  "Stainless steel",
  "Aluminium",
  "GRP",
  "Membrane finishes",
];

const coreOptions = [
  "Polyurethane (PU)",
  "Polyisocyanurate (PIR)",
  "Mineral wool",
  "Expandable polystyrene",
];

const applications = [
  {
    title: "Cold Storages",
    text: "PUF panels help maintain consistent low temperatures with their superior insulation. They minimise energy loss, making them ideal for perishables and temperature-sensitive goods.",
  },
  {
    title: "Industrial Buildings",
    text: "Strong load-bearing capacity allows these sheets to withstand heavy machinery operations and structural vibrations. They also reduce internal heat buildup, improving working conditions.",
  },
  {
    title: "Clean Rooms",
    text: "Their airtight and vapour-resistant design makes them suitable for controlled environments. The smooth surfaces promote hygiene and easy maintenance.",
  },
  {
    title: "Commercial Buildings",
    text: "PUF panels offer a clean, modern aesthetic with excellent durability. They help reduce air-conditioning loads, improving operational efficiency.",
  },
  {
    title: "Warehouses",
    text: "The panels support wider spans while delivering robust protection from heat and moisture. This ensures stored goods remain safe in varying weather conditions.",
  },
  {
    title: "Prefabricated Cabins",
    text: "Lightweight yet strong panels make cabins easy to transport and assemble. They provide reliable shelter with excellent thermal comfort.",
  },
  {
    title: "Poultry Farms",
    text: "Thermal insulation helps maintain ideal temperatures for livestock. Panels also resist bacterial growth due to their hygienic surface finish.",
  },
  {
    title: "Hospitals & Labs",
    text: "Their ability to create clean, climate-controlled spaces makes them suitable for sensitive medical environments. They also support quick installation for urgent expansions.",
  },
  {
    title: "Residential Buildings",
    text: "PUF roofing reduces indoor heat gain, enhancing comfort in living spaces. It is a cost-effective option for modern, energy-efficient homes.",
  },
  {
    title: "Food Processing Units",
    text: "The stable temperature control provided by PUF panels ensures compliance with food safety standards. They also reduce long-term operating costs.",
  },
  {
    title: "Transport Containers",
    text: "High insulation efficiency ensures agricultural goods, chemicals and perishable items remain protected during transit. Their structural rigidity withstands handling and movement.",
  },
];



const RoofingTechnicalContent = () => {
  return (
    <section className="w-full bg-white py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Technical Excellence */}
        <div className="mb-16">
          <div className="max-w-4xl mb-10">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500 mb-3">
              Technical Excellence
            </p>

            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-5">
              PUF Panel Roof Sheet Technical Excellence
            </h2>

            <p className="text-gray-600 leading-8">
              A well-engineered PUF panel roof sheet, such as a 1000 mm
              effective cover profile, is crafted to achieve maximum performance
              in demanding conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {technicalDetails.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-gray-100 bg-gray-50 p-6 hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-lg font-black text-gray-900 mb-3">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600 leading-7">{item.text}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Material Options */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-3xl bg-gray-900 text-white p-7 md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-red-400 mb-3">
              Sandwich Panel Roof
            </p>

            <h2 className="text-2xl md:text-3xl font-black mb-4">
              Material Options for Sandwich Panel Roof Systems
            </h2>

            <p className="text-gray-300 leading-7 mb-7">
              A sandwich panel roof consists of protective outer and inner
              sheets with an insulation core.
            </p>

            <h3 className="font-black mb-4">Outer & Inner Sheet Choices</h3>

            <div className="flex flex-wrap gap-3">
              {materialOptions.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-white/10 border border-white/10 px-4 py-2 text-sm text-gray-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 p-7 md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500 mb-3">
              Insulation Core
            </p>

            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">
              Insulation Core Options
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coreOptions.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-gray-50 border border-gray-100 px-5 py-4 text-sm font-bold text-gray-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="mb-16">
          <div className="max-w-4xl mb-10">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-red-500 mb-3">
              Applications
            </p>

            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-5">
              Applications of PUF Sheet Roofing
            </h2>

            <p className="text-gray-600 leading-8">
              PUF sheet roofing is widely used across industries due to its
              insulation performance, structural strength and long-lasting
              durability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {applications.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-lg font-black text-gray-900 mb-3">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600 leading-7">{item.text}</p>
              </article>
            ))}
          </div>
        </div>

        

        {/* Colour + Conclusion */}
        <div className="rounded-3xl bg-gray-900 p-7 md:p-10 text-white">
          <h2 className="text-2xl md:text-3xl font-black mb-4">
            Colour Options & Customisation
          </h2>

          <p className="text-red-50 leading-8 mb-8">
            Standard roofing colours include Off White, Grey, Brick Red, Sky
            Blue, Caulified Green, Royal Blue and Bare metal finishes. For
            large-scale requirements, over 45 custom colour options are
            available, allowing complete architectural flexibility.
          </p>

          <h2 className="text-2xl md:text-3xl font-black mb-4">
            A Complete Roofing Solution Built for Performance
          </h2>

          <p className="text-red-50 leading-8">
            With advanced manufacturing processes, high-quality raw materials,
            and precision engineering, PUF panel manufacturers today deliver
            roofing products that stand up to extreme weather conditions, reduce
            energy costs, and extend the lifespan of any structure. Choosing a
            PUF panel roof, PUF roofing sheet, or sandwich panel roof system
            ensures long-term efficiency, stable indoor temperatures, and
            superior protection, all of which are essential for modern
            construction in India.
          </p>
        </div>
      </div>
    </section>
  );
};

export default RoofingTechnicalContent;
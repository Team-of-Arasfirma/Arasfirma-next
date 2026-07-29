const sections = [
  {
    title: "What is a Cold Storage PUF Panel?",
    text: "A cold storage PUF panel is a sandwich panel made using rigid polyurethane foam as the core material, placed between two layers of metal sheets, typically galvanised steel or aluminium. These panels are manufactured under controlled conditions to ensure consistent density and insulation properties.",
  },
  {
    title: "Structure and Composition",
    text: "The structure of a cold storage PUF panel is designed to deliver maximum thermal resistance. The outer metal sheets provide strength and protection, while the PUF core acts as a powerful insulator. This combination ensures minimal heat transfer, making it ideal for cold storage environments.",
  },
  {
    title: "How does it work?",
    text: "The primary function of a cold storage PUF panel is to maintain a stable internal temperature by preventing heat exchange between the inside and outside environment. The polyurethane foam core has low thermal conductivity, significantly slowing heat transfer.",
  },
];

const benefits = [
  {
    title: "High Thermal Insulation",
    text: "The closed-cell structure of polyurethane foam minimises heat transfer, helping maintain precise temperatures inside the storage unit.",
  },
  {
    title: "Energy Efficiency",
    text: "A well-installed cold storage PUF panel reduces the load on refrigeration systems by maintaining temperature more efficiently.",
  },
  {
    title: "Quick Installation",
    text: "Cold storage PUF panels are designed for modular construction and can be assembled quickly on-site.",
  },
  {
    title: "Durability and Strength",
    text: "Despite their lightweight design, cold-storage PUF panels are highly durable and maintain structural integrity.",
  },
];

const applications = [
  {
    title: "Food and Beverage Industry",
    text: "Used in refrigerated warehouses, meat processing facilities and dairy storage facilities to maintain freshness.",
  },
  {
    title: "Pharmaceutical Storage",
    text: "Helps maintain strict temperature conditions for medicines, vaccines and healthcare products.",
  },
  {
    title: "Agriculture and Horticulture",
    text: "Supports preservation of fruits, vegetables, flowers and agricultural produce after harvest.",
  },
  {
    title: "Dairy Storage",
    text: "Maintains controlled cooling for milk, cheese, butter and other dairy products.",
  },
  {
    title: "Refrigerated Warehouses",
    text: "Ideal for large-scale temperature-controlled storage and logistics facilities.",
  },
  {
    title: "Meat Processing Facilities",
    text: "Supports hygienic cold storage environments for meat and seafood processing.",
  },
];

const types = [
  {
    title: "Wall Panels",
    text: "Wall panels form the main structure of a cold storage facility. They provide insulation and support, helping maintain a stable internal environment. These panels are designed for easy interlocking, which helps in creating airtight structures.",
  },
  {
    title: "Roof Panels",
    text: "Roof panels are exposed to direct sunlight and external weather conditions. They are designed to provide superior insulation and protection. A good cold storage PUF panel for roofing helps prevent heat gain from the top.",
  },
  {
    title: "Floor Panels",
    text: "Floor panels are built to withstand heavy loads while maintaining insulation. They are commonly used in facilities with high foot traffic or equipment movement.",
  },
];

const factors = [
  {
    title: "Panel Thickness",
    text: "The thickness of the panel determines its insulation capacity. Thicker panels offer better thermal resistance and are suitable for lower-temperature applications.",
  },
  {
    title: "Density of PUF Core",
    text: "The density of the polyurethane foam affects both insulation and strength. Higher-density panels offer better performance and durability.",
  },
  {
    title: "Surface Finish",
    text: "Surface options include pre-painted galvanised steel, stainless steel or aluminium based on hygiene, corrosion resistance and aesthetic needs.",
  },
  {
    title: "Installation Quality",
    text: "Proper alignment and sealing are essential to reduce air leakage and maintain long-term efficiency.",
  },
  {
    title: "Joint Sealing",
    text: "Tight joints and high-quality sealants improve airtightness and reduce refrigeration load.",
  },
  {
    title: "Maintenance Requirement",
    text: "Regular inspection, cleaning and joint checks help maintain consistent performance for many years.",
  },
];

export default function ColdStoragePufPanel() {
  return (
    <main className="w-full bg-white pt-24">
      {/* Light hero section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-cyan-50 px-6 py-20 text-gray-900">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-red-100 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-100 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-red-600">
            Cold Storage Solution
          </p>

          <h1 className="max-w-4xl text-4xl font-black uppercase leading-tight text-gray-950 md:text-6xl">
            Cold Storage PUF Panel
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-gray-600 md:text-lg">
            High-performance insulated PUF panels for cold rooms, food
            processing, pharmaceuticals, dairy, agriculture and
            temperature-controlled facilities.
          </p>

          <a
            href="/contact"
            className="mt-8 inline-flex rounded-full bg-red-600 px-7 py-3 text-sm font-bold uppercase text-white transition hover:bg-red-700"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* Intro sections */}
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <h2 className="mb-4 text-xl font-black text-gray-900">
                {section.title}
              </h2>

              <p className="text-sm leading-7 text-gray-600">{section.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            Benefits
          </p>

          <h2 className="mb-10 text-3xl font-black uppercase text-red-600">
            Benefits of Using Cold Storage PUF Panels
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="text-lg font-black text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            Applications
          </p>

          <h2 className="mb-10 text-3xl font-black uppercase text-gray-900">
            Applications of Cold Storage PUF Panels
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {applications.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-cyan-100 bg-cyan-50 p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="font-black text-gray-900">{item.title}</h3>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Panel types */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            Panel Types
          </p>

          <h2 className="mb-10 text-3xl font-black uppercase text-red-600">
            Types of Cold Storage PUF Panels
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {types.map((type) => (
              <article
                key={type.title}
                className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <h3 className="mb-3 text-xl font-black text-gray-900">
                  {type.title}
                </h3>

                <p className="text-sm leading-7 text-gray-600">{type.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Selection guide */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            Selection Guide
          </p>

          <h2 className="mb-10 text-3xl font-black uppercase text-gray-900">
            Factors to Consider When Choosing a Cold Storage PUF Panel
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {factors.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="text-base font-black text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation and maintenance */}
      <section className="bg-red-50 px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
          <article className="rounded-3xl bg-white p-8 shadow-sm">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
              Installation
            </p>

            <h2 className="mb-4 text-2xl font-black uppercase text-gray-900">
              Installation Best Practices
            </h2>

            <p className="text-sm leading-8 text-gray-600">
              Trained professionals should install cold storage PUF panels to
              ensure proper alignment and sealing. Any gaps or improper joints
              can lead to air leakage and reduced efficiency. Using high-quality
              sealants and accessories enhances the overall system performance.
            </p>
          </article>

          <article className="rounded-3xl bg-white p-8 shadow-sm">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
              Maintenance
            </p>

            <h2 className="mb-4 text-2xl font-black uppercase text-gray-900">
              Maintenance Tips
            </h2>

            <p className="text-sm leading-8 text-gray-600">
              Regular inspection helps identify damage or wear in the panels.
              Cleaning the surface and checking joint integrity ensures
              consistent performance. Well-maintained cold storage PUF panels
              can last for many years with strong cost efficiency.
            </p>
          </article>
        </div>
      </section>

      {/* Why choose */}
      <section className="bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-5 text-3xl font-black uppercase">
            Why Choose Arasfirma for Cold Storage PUF Panels?
          </h2>

          <p className="max-w-4xl text-sm leading-8 text-gray-300">
            Arasfirma offers high-quality cold storage PUF panels focused on
            precision manufacturing, durability and energy efficiency. With
            customised solutions and reliable product quality, Arasfirma is a
            trusted partner for food, pharma, dairy, agriculture and industrial
            cold storage requirements across India.
          </p>

          <a
            href="/contact"
            className="mt-8 inline-flex rounded-full bg-red-600 px-7 py-3 text-sm font-bold uppercase text-white transition hover:bg-red-700"
          >
            Get Enquiry
          </a>
        </div>
      </section>
    </main>
  );
}
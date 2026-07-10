const testimonials = [
  {
    name: "Raj Kumar",
    role: "Civil Engineer",
    review:
      "We had an excellent experience working with Arasfirma for our cold storage project. The PUF panels delivered outstanding performance and quality. Truly a reliable choice.",
  },
  {
    name: "Ar.Sanjeev",
    role: "Architect",
    review:
      "Great experience with Arasfirma! The PUF panels were top quality and worked perfectly for our cold storage. Definitely recommend them.",
  },
  {
    name: "Kavitha",
    role: "Civil Engineer",
    review:
      "Choosing Arasfirma for our cold storage facility was the right decision. Their PUF panels showcased superior quality, efficiency, and durability. Highly recommended for anyone seeking excellence.",
  },
  {
    name: "Arun",
    role: "Project Manager",
    review:
      "Our experience with Arasfirma was truly impressive. The PUF panels not only met but exceeded our expectations in terms of performance and build quality. Highly recommended for cold storage solutions.",
  },
];

const Testimonials = () => {
  return (
    <section className="w-full py-12 md:py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-gray-900 mb-8 md:mb-10">
          What Our Client's Say
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
              <div className="text-yellow-400 text-md mb-2">★★★★★</div>

              <p className="text-sm text-gray-500 leading-relaxed">
                {t.review}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

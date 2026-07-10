const KeyPerformance = ({ product }) => {
  return (
    <section className="w-full py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div data-animate="up" className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
            Why Choose This Panel
          </p>
          <h2 className="text-3xl font-black uppercase text-gray-900 mb-3">
            Key Performance Attributes
          </h2>
          <div
            className="w-16 h-1 rounded mx-auto"
            style={{ background: product.color }}
          />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {product.keyPerformance.map((item, i) => (
            <div
              key={item.title}
              data-animate="up"
              data-delay={i * 100}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-default"
            >
              {/* ✅ Icon — now renders your local image file */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300"
                style={{ background: product.lightColor }}
              >
                <img
                  src={item.icon}
                  alt={item.title}
                  loading="lazy"
                  className="w-7 h-7 object-contain"
                />
              </div>

              <h3 className="font-black text-gray-900 mb-2 group-hover:text-opacity-80 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyPerformance;

const AvailableJoints = ({ product }) => {
  return (
    <section className="w-full py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold tracking-[5px] uppercase text-gray-400 mb-3">
            Connection System
          </p>

          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Available Joints
          </h2>

          <div
            className="w-24 h-1 rounded-full mx-auto mt-5"
            style={{ background: product.color }}
          />
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {product.joints.map((joint, i) => (
            <div
              key={joint.name}
              className="
                group
                bg-white
                rounded-3xl
                overflow-hidden
                border border-gray-200
                hover:border-transparent
                hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                transition-all duration-500
                hover:-translate-y-2
              "
            >
              {/* IMAGE */}
              <div className="bg-[#f7f7f7] h-[280px] flex items-center justify-center overflow-hidden">
                <img
                  src={joint.image}
                  alt={joint.name}
                  loading="lazy"
                  className="
                    w-full
                    h-full
                    object-contain
                    group-hover:scale-105
                    transition-transform
                    duration-500
                  "
                />
              </div>

              {/* CONTENT */}
              <div className="px-7 py-7 text-center">
                {/* TITLE */}
                <h3 className="text-[16x] font-bold text-gray-900 leading-snug mb-3">
                  {joint.name}
                </h3>

                {/* LINE */}
                <div
                  className="w-12 h-[2px] mx-auto rounded-full mb-4"
                  style={{ background: product.color }}
                />

                {/* DESC */}
                <p className="text-gray-500 text-sm leading-relaxed max-w-[260px] mx-auto">
                  {joint.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AvailableJoints;

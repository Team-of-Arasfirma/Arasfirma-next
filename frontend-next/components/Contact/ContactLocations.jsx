const locations = [
  {
    name: "Head Office",
    phone: "+91 99440 15565",
    address:
      "5/131, Avinaski Ingammapalayam, Palanguari, Avinaski, TI, Tamilnadu - 641654",
    isHead: true,
  },
  {
    name: "Factory",
    phone: "+91 99440 15565",
    address:
      "S.F. No: 181/87/1, D.No: 3/185, Puliyapatti ayam, Chithambalam, Palladam, Tirupur 641654",
    isHead: false,
  },
  {
    name: "Chennai Depot",
    phone: "+91 99440 15565",
    address:
      "D.NO-26/6, S.F.NO-154, Pammarasakkam Road, Nattur Village, Ponneri Taluk Tiruvallur, Tamilnadu - 600067",
    isHead: false,
  },
  {
    name: "Madurai Depot",
    phone: "+91 99440 15565",
    address:
      "Ramana Avenue, Plot No 14, Madhanpatti Rd, near Govt Market, Madurai, Tamilnadu - 625020",
    isHead: false,
  },
  {
    name: "Thoothukudi Depot",
    phone: "+91 99440 15565",
    address:
      "D.No-2/79-2, ECR Road, Keela Arasadi, Ottapidaram, Thoothukudi, Tamilnadu",
    isHead: false,
  },
  {
    name: "Erode Depot",
    phone: "+91 99440 15565",
    address:
      "RSF No-159/46, S.F No 63.64/1, HSF No-159, 1 & New, Periya Semur, Erode, Tamilnadu",
    isHead: false,
  },
  {
    name: "Salem Depot",
    phone: "+91 99440 15565",
    address:
      "D, 3/706, Sanniyasigundu Rd, Erumapalayam, Salem, Tamilnadu - 636015",
    isHead: false,
  },
  {
    name: "Vijayawada Depot",
    phone: "+91 99440 15565",
    address:
      "D.No:78, Iron Complex, R.S No: 16/20, 18-306A/1, Partha 2, Bhavaniporam, Vijayawada, Andhra Pradesh 520012",
    isHead: false,
  },
];

const ContactLocations = () => {
  return (
    <section className="w-full py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h2
          data-animate="up"
          className="text-2xl font-black text-gray-900 mb-8"
        >
          Located Globally
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {locations.map((loc, i) => (
            <div
              key={loc.name}
              data-animate="up"
              data-delay={i * 80}
              className="rounded-xl p-5 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{
                background: loc.isHead ? "#dc2626" : "white",
                borderColor: loc.isHead ? "#dc2626" : "#e5e7eb",
              }}
            >
              {/* Location name */}
              <p
                className="font-black text-sm mb-3"
                style={{ color: loc.isHead ? "white" : "#111827" }}
              >
                {loc.name}
              </p>

              {/* Phone */}
              <div className="flex items-center gap-2 mb-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill={loc.isHead ? "white" : "#dc2626"}
                >
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.93 2.18 2 2 0 012.92 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" />
                </svg>

                {/* ✅ Fixed — added missing <a tag */}

                <a
                  href={`tel:${loc.phone}`}
                  className="text-xs font-semibold hover:underline"
                  style={{ color: loc.isHead ? "white" : "#dc2626" }}
                >
                  {loc.phone}
                </a>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2">
                <svg
                  width="12"
                  height="14"
                  viewBox="0 0 24 24"
                  fill={loc.isHead ? "rgba(255,255,255,0.7)" : "#9ca3af"}
                  className="shrink-0 mt-0.5"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <p
                  className="text-xs leading-relaxed"
                  style={{
                    color: loc.isHead ? "rgba(255,255,255,0.85)" : "#6b7280",
                  }}
                >
                  {loc.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactLocations;

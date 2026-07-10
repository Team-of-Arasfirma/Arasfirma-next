"use client";

import { useRouter } from "next/navigation";

const CTABanner = () => {
  const router = useRouter();

  return (
    <section className="w-full py-12 md:py-16 px-4 sm:px-6 bg-gray-50">
      <div className="flex flex-col sm:flex-row max-w-5xl mx-auto gap-4">
        <div
          className="relative flex flex-1 items-center justify-between overflow-hidden px-6 sm:px-10 py-8 shadow-lg w-full"
          style={{
            background: "#dc2626",
            borderRadius: 20,
          }}
        >
          <div className="absolute inset-y-1 right-6 flex items-end pointer-events-none">
            <img
              src="/assets/icon/work.svg"
              alt=""
              className="h-[110%] w-auto object-contain opacity-30"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          <h2
            className="relative z-10 max-w-[200px] sm:max-w-[250px] text-[22px] sm:text-[26px] font-extrabold leading-snug text-white"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Looking for a
            <br />
            Quality Product?
          </h2>

          <button
            type="button"
            onClick={() => router.push("/contact")}
            className="relative z-10 flex shrink-0 items-center gap-3 rounded-full bg-white py-2.5 pl-5 pr-3.5 text-sm font-semibold text-gray-800 hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-200"
          >
            Contact Us
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2D2D2D]">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 13L13 3M13 3H6M13 3V10"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>

        <div
          className="flex w-full sm:w-auto shrink-0 flex-col justify-center gap-4 px-5 py-6 shadow-lg"
          style={{ background: "#2D2D2D", borderRadius: 20 }}
        >
          <div className="flex items-center">
            {[
              "/assets/Client/client1.png",
              "/assets/Client/client2.png",
              "/assets/Client/client3.png",
              "/assets/Client/client4.png",
              "/assets/Client/client5.png",
              "/assets/Client/client6.png",
            ].map((src, i) => (
              <div
                key={src}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  border: "2px solid #ef4444",
                  background: "white",
                  overflow: "hidden",
                  flexShrink: 0,
                  marginLeft: i !== 0 ? -12 : 0,
                  zIndex: 5 - i,
                  position: "relative",
                  transition: "transform 0.3s ease, z-index 0s",
                  cursor: "pointer",
                }}
              >
                <img
                  src={src}
                  alt={`Client ${i + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    padding: 6,
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>

          <p className="text-sm leading-relaxed text-gray-300">
            Trusted By More than,{" "}
            <span className="font-black text-white">200+</span>
            <br />
            Satisfied{" "}
            <span className="font-semibold text-red-400">Customers</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;

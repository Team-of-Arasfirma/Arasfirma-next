"use client";

import { useRouter } from "next/navigation";

const AboutSection = () => {
  const router = useRouter();

  return (
    <section className="w-full bg-white relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-12 py-12 md:py-16 px-4 sm:px-6">
        <div className="flex-1" data-animate="left" data-delay="100">
          <img
            src="/assets/hero/factory.jpg"
            alt="Arasfirma Factory"
            className="w-full rounded-2xl shadow-lg object-cover aspect-[4/3]"
            data-parallax="0.04"
          />
        </div>

        <div className="flex-1" data-animate="right" data-delay="200">
          <p
            data-animate="up"
            data-delay="300"
            className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2"
          >
            About Us
          </p>

          <h2
            data-animate="up"
            data-delay="400"
            className="text-2xl md:text-4xl font-black uppercase text-red-600 leading-tight mb-4"
          >
            Committed To Excellence
          </h2>

          <p
            data-animate="up"
            data-delay="500"
            className="text-md text-gray-600 leading-relaxed mb-8"
          >
            At Arasfirma, We Are Dedicated To Providing Premium PUF Panel
            Solutions Tailored To Meet Your Specific Requirements. With Years Of
            Expertise In The Manufacturing Industry, We Ensure Top-Notch Quality
            Through Advanced Technology And Stringent Quality Control Processes.
            Our Panels Are Used In A Wide Range Of Applications, From Warehouses
            And Cold Storages To Industrial Sheds And Residential Buildings.
          </p>

          <button
            data-animate="zoom"
            data-delay="600"
            onClick={() => router.push("/about")}
            className="bg-red-600 text-white text-sm font-semibold px-8 py-3 rounded-full flex items-center gap-2 hover:bg-red-400 hover:shadow-lg hover:shadow-red-200 active:scale-95 transition-all duration-300"
          >
            Know More <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

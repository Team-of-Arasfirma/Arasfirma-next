"use client";

import { useState } from "react";

const reasons = [
  {
    icon: "/assets/icon/premium.svg",
    title: "Premium Quality",
    desc: "Manufactured using advanced technology and high-grade materials",
  },
  {
    icon: "/assets/icon/energy.svg",
    title: "Energy Efficiency",
    desc: "Superior insulation properties reduce energy loss significantly",
  },
  {
    icon: "/assets/icon/custom.svg",
    title: "Custom Solutions",
    desc: "Tailored designs to meet your specific project requirements",
  },
  {
    icon: "/assets/icon/delivery.svg",
    title: "On-Time Delivery",
    desc: "Efficient production and logistics for timely supply",
  },
  {
    icon: "/assets/icon/expertise.svg",
    title: "Industry Expertise",
    desc: "Years of experience in PUF panel manufacturing",
  },
];

const Card = ({ item, delay }) => {
  const [iconMissing, setIconMissing] = useState(false);

  return (
    <div
      data-animate="up"
      data-delay={delay}
      className="group flex w-full cursor-pointer items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-xl"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#fecaca] bg-[#fef2f2] transition-all duration-300 group-hover:border-[#dc2626] group-hover:bg-[#dc2626]">
        <img
          src={item.icon}
          alt={item.title}
          className={
            "h-7 w-7 object-contain transition-all duration-300 [filter:invert(20%)_sepia(90%)_saturate(500%)_hue-rotate(340deg)] group-hover:brightness-0 group-hover:invert" +
            (iconMissing ? " hidden" : "")
          }
          onError={() => setIconMissing(true)}
        />
      </div>

      <div>
        <p className="mb-1 font-black text-gray-900 transition-colors duration-300 group-hover:text-red-600">
          {item.title}
        </p>
        <p className="text-xs leading-relaxed text-gray-500">{item.desc}</p>
      </div>
    </div>
  );
};

const WhyChooseUs = () => {
  const topRow = reasons.slice(0, 3);
  const bottomRow = reasons.slice(3, 5);

  return (
    <section className="w-full bg-gray-50 px-4 py-12 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div data-animate="up" className="mb-10 text-center md:mb-12">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            Our Strengths
          </p>
          <h2 className="mb-3 text-xl font-black uppercase text-gray-900 sm:text-2xl md:text-4xl">
            Why Choose Us?
          </h2>
          <div className="mx-auto h-1 w-16 rounded bg-red-600" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {topRow.map((item, i) => (
            <Card key={item.title} item={item} delay={i * 150} />
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:flex lg:justify-center md:gap-6 md:mt-6 lg:grid-cols-3">
          {bottomRow.map((item, i) => (
            <div key={item.title} className="w-full lg:w-[calc(33.333%-16px)]">
              <Card item={item} delay={(i + 3) * 150} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

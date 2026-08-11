"use client";

import { useEffect, useRef, useState } from "react";

const ClientLogo = ({ client }) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <p className="p-1 text-center text-[11px] font-extrabold text-red-600">
        {client.name}
      </p>
    );
  }

  return (
    <img
      src={client.logo}
      alt={client.name}
      draggable={false}
      className="object-contain transition-transform duration-300 group-hover:scale-110"
      style={{ width: 100, height: 60, objectFit: "contain" }}
      onError={() => setFailed(true)}
    />
  );
};

const clients = [
  { name: "Tex Valley", logo: "/assets/Client/client1.png" },
  { name: "Chera", logo: "/assets/Client/client2.png" },
  { name: "MTC", logo: "/assets/Client/client3.png" },
  { name: "Broadway", logo: "/assets/Client/client4.png" },
  { name: "Tuskers Hill", logo: "/assets/Client/client5.png" },
  { name: "I-Pro Visuals", logo: "/assets/Client/client6.png" },
  {
    name: "Sindhu Cinema",
    logo: "/assets/Client/OUR-CLIENTS_0006_Layer-36.png",
  },
  {
    name: "Veera Cinema",
    logo: "/assets/Client/OUR-CLIENTS_0007_Layer-35.png",
  },
  {
    name: "Zeon Cinemas",
    logo: "/assets/Client/OUR-CLIENTS_0008_Layer-34.png",
  },
  { name: "AMC", logo: "/assets/Client/OUR-CLIENTS_0009_Layer-26.png" },
  { name: "Sathyabama", logo: "/assets/Client/OUR-CLIENTS_0010_Layer-25.png" },
  { name: "St. Joseph", logo: "/assets/Client/OUR-CLIENTS_0011_Layer-27.png" },
  { name: "College", logo: "/assets/Client/OUR-CLIENTS_0012_Layer-24.png" },
  { name: "John", logo: "/assets/Client/OUR-CLIENTS_0013_Layer-22.png" },
  { name: "Avalon", logo: "/assets/Client/OUR-CLIENTS_0014_Layer-21.png" },
  { name: "Propel", logo: "/assets/Client/OUR-CLIENTS_0015_Layer-19.png" },
  { name: "Pricol", logo: "/assets/Client/OUR-CLIENTS_0016_Layer-18.png" },
  { name: "Imperial", logo: "/assets/Client/OUR-CLIENTS_0017_Layer-16.png" },
  { name: "KPR Mill", logo: "/assets/Client/OUR-CLIENTS_0018_Layer-15.png" },
  { name: "Eastman", logo: "/assets/Client/OUR-CLIENTS_0019_Layer-13.png" },
  { name: "Sahana", logo: "/assets/Client/OUR-CLIENTS_0020_Layer-10.png" },
  { name: "SCM", logo: "/assets/Client/OUR-CLIENTS_0021_Layer-14.png" },
  { name: "Eveready", logo: "/assets/Client/OUR-CLIENTS_0022_Layer-11.png" },
  {
    name: "Vasa Nonwoven",
    logo: "/assets/Client/OUR-CLIENTS_0023_Layer-9.png",
  },
  { name: "INDIAN", logo: "/assets/Client/OUR-CLIENTS_0024_Layer-4.png" },
  {
    name: "PSG Hospitals",
    logo: "/assets/Client/OUR-CLIENTS_0025_Layer-3.png",
  },
  { name: "Royal Care", logo: "/assets/Client/OUR-CLIENTS_0026_Layer-2.png" },
  { name: "KMCH", logo: "/assets/Client/OUR-CLIENTS_0027_Layer-1.png" },
  { name: "Ramraj", logo: "/assets/Client/OUR-CLIENTS_0028_Layer-12.png" },
  {
    name: "Jay Jay Mills",
    logo: "/assets/Client/OUR-CLIENTS_0029_Jay-Jay-Mills.png",
  },
  { name: "Ferromonk", logo: "/assets/Client/OUR-CLIENTS_0030_Layer-33.png" },
  {
    name: "Davison Products",
    logo: "/assets/Client/OUR-CLIENTS_0031_Layer-32.png",
  },
  {
    name: "PG Infrastructure",
    logo: "/assets/Client/OUR-CLIENTS_0032_Layer-31.png",
  },
  { name: "ASVIN", logo: "/assets/Client/OUR-CLIENTS_0033_Layer-30.png" },
  { name: "Triangle", logo: "/assets/Client/OUR-CLIENTS_0034_Layer-29.png" },
  { name: "URC", logo: "/assets/Client/OUR-CLIENTS_0035_Layer-28.png" },
  { name: "Kumaraguru", logo: "/assets/Client/OUR-CLIENTS_0051_Layer-23.png" },
  { name: "Milky Mist", logo: "/assets/Client/OUR-CLIENTS_0052_Layer-5.png" },
];

const MarqueeRow = ({ items, reverse = false }) => {
  const rowRef = useRef(null);
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const updateDuration = () => {
      const halfWidth = el.scrollWidth / 2;
      setDuration(Math.max(halfWidth / 30, 20));
    };

    updateDuration();

    if (typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const observer = new ResizeObserver(updateDuration);
    observer.observe(el);

    return () => observer.disconnect();
  }, [reverse]);

  const doubled = [...items, ...items];

  return (
    <div className="w-full overflow-hidden">
      <div
        ref={rowRef}
        className={"marquee-track" + (reverse ? " marquee-track--reverse" : "")}
        style={{ ["--marquee-duration"]: duration + "s" }}
      >
        {doubled.map((client, i) => (
          <div
            key={client.name + "-" + i}
            className="group flex shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
            style={{ width: 140, height: 90 }}
          >
            <ClientLogo client={client} />
          </div>
        ))}
      </div>
    </div>
  );
};

const OurClients = () => {
  const row1 = clients.slice(0, 19);
  const row2 = clients.slice(19, 38);

  return (
    <section className="w-full overflow-hidden bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div data-animate="up" className="mb-12 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            Trusted By
          </p>

          <h2 className="mb-3 text-2xl font-black uppercase text-gray-900 md:text-3xl">
            Our Clients
          </h2>

          <div className="mx-auto h-1 w-16 rounded bg-red-600" />
        </div>
      </div>

      <div className="mb-4">
        <MarqueeRow items={row1} reverse={false} />
      </div>

      <MarqueeRow items={row2} reverse={true} />
    </section>
  );
};

export default OurClients;

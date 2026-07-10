"use client";

// src/pages/Career/index.jsx

import { useState } from "react";
import CareerHero from "./CareerHero";

import JobListings from "./JobListings";

const CareerPage = () => {
  const [jobCount, setJobCount] = useState(0);

  return (
    <>
      <main className="bg-[#ffffff] text-[#1f2937]">
        <CareerHero jobCount={jobCount} />

        <JobListings onStatsLoaded={setJobCount} />
      </main>
    </>
  );
};

export default CareerPage;

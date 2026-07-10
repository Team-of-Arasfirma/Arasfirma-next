"use client";

import { useState, useEffect, useCallback, useRef } from "react";

import { Star } from "lucide-react";

import JobCard from "./JobCard";

import JobFilters from "./JobFilters";

import { JobCardSkeleton, EmptyState } from "./LoadingSkeleton";

import { fetchPublicJobs } from "@/lib/services/jobService";

const EMPTY_FILTERS = {
  search: "",
  department: "",
  location: "",
  employmentType: "",
};

const JobListings = ({ onStatsLoaded }) => {
  const [jobs, setJobs] = useState([]);

  const [featured, setFeatured] = useState([]);

  const [filterOptions, setFilterOptions] = useState({
    departments: [],
    locations: [],
    types: [],
  });

  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const [loading, setLoading] = useState(true);

  const isMounted = useRef(false);

  const didInitialLoad = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadJobs = useCallback(
    async (page = 1) => {
      setLoading(true);

      try {
        const data = await fetchPublicJobs({ ...filters, page, limit: 9 });

        if (!isMounted.current) return;

        setJobs(data?.jobs ?? []);

        setFilterOptions(
          data?.filterOptions ?? { departments: [], locations: [], types: [] },
        );

        const nextPagination = data?.pagination ?? {
          page: 1,
          pages: 1,
          total: 0,
        };

        setPagination(nextPagination);

        onStatsLoaded?.(nextPagination.total || 0);
      } catch (err) {
        if (!isMounted.current) return;

        console.error(err);

        setJobs([]);

        setFilterOptions({ departments: [], locations: [], types: [] });

        setPagination({ page: 1, pages: 1, total: 0 });

        onStatsLoaded?.(0);
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    },
    [filters, onStatsLoaded],
  );

  const loadFeatured = async () => {
    try {
      const data = await fetchPublicJobs({ featured: true, limit: 3 });

      if (!isMounted.current) return;

      setFeatured(data?.jobs ?? []);
    } catch {
      if (!isMounted.current) return;

      setFeatured([]);
    }
  };

  useEffect(() => {
    loadFeatured();
  }, []);

  useEffect(() => {
    if (!didInitialLoad.current) {
      didInitialLoad.current = true;

      loadJobs(1);

      return;
    }

    const debounce = setTimeout(() => loadJobs(1), 300);

    return () => clearTimeout(debounce);
  }, [loadJobs]);

  const handlePageChange = (p) => {
    loadJobs(p);

    document
      .getElementById("job-listings")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="job-listings"
      className="bg-[#f9fafb] py-12 md:py-16 lg:py-20 min-h-[60vh]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {featured?.length > 0 && (
          <div className="mb-12 md:mb-16">
            <div className="flex items-center gap-2 mb-5 md:mb-6">
              <Star size={16} className="text-[#dc2626]" fill="currentColor" />

              <span className="text-sm font-semibold text-[#dc2626] uppercase tracking-widest">
                Featured Roles
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((job, i) => (
                <JobCard key={job._id} job={job} index={i} />
              ))}
            </div>

            <div className="border-t border-[#e5e7eb] mt-10 md:mt-14 mb-10 md:mb-14" />
          </div>
        )}

        <div className="mb-6 md:mb-8">
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-black text-[#1f2937] mb-2"

            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            All Open Roles
          </h2>

          {!loading && (
            <p className="text-[#9ca3af] text-sm">
              {pagination.total} position{pagination.total !== 1 ? "s" : ""}{" "}
              available
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          <aside className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-24">
              <JobFilters
                filters={filters}

                onChange={setFilters}

                filterOptions={filterOptions}

                onClear={() => setFilters(EMPTY_FILTERS)}
              />
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="grid md:grid-cols-2 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : jobs?.length === 0 ? (
              <EmptyState
                message="No matching roles"

                subtitle="Try adjusting your filters or check back soon for new openings."
              />
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-5">
                  {jobs.map((job, i) => (
                    <JobCard key={job._id} job={job} index={i} />
                  ))}
                </div>

                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    {Array.from(
                      { length: pagination.pages },
                      (_, i) => i + 1,
                    ).map((p) => (
                      <button
                        key={p}

                        onClick={() => handlePageChange(p)}

                        className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                          p === pagination.page
                            ? "bg-[#dc2626] text-[#ffffff] shadow-lg shadow-[#dc2626]/20"
                            : "bg-[#ffffff] text-[#9ca3af] border border-[#e5e7eb] hover:text-[#dc2626] hover:border-[#f87171]"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobListings;

"use client";

// src/pages/Career/JobDetail.jsx

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  TrendingUp,
  IndianRupee,
  Calendar,
  CheckCircle2,
  Users,
} from "lucide-react";

import { fetchJobBySlug } from "@/lib/services/jobService";

import ApplyForm from "./ApplyForm";

import { JobDetailSkeleton } from "./LoadingSkeleton";

import JobCard from "./JobCard";

const Section = ({ title, items, icon: Icon }) => {
  if (!items?.length) return null;

  return (
    <div className="mb-8 bg-[#ffffff] border border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={16} className="text-[#dc2626]" />

        <h3 className="text-lg font-semibold text-[#1f2937]">{title}</h3>
      </div>

      <ul className="space-y-3">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-[#9ca3af] text-sm leading-relaxed"
          >
            <CheckCircle2
              size={14}
              className="text-[#dc2626] mt-0.5 shrink-0"
            />

            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const JobDetail = ({ slug }) => {
  const [job, setJob] = useState(null);

  const [similar, setSimilar] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showApply, setShowApply] = useState(false);

  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.resolve()

      .then(() => {
        if (!active) return null;

        setLoading(true);

        setNotFound(false);

        return fetchJobBySlug(slug);
      })

      .then((data) => {
        if (!active || !data) return;

        setJob(data.job);

        setSimilar(data.similar || []);
      })

      .catch(() => {
        if (active) setNotFound(true);
      })

      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading)
    return (
      <div className="bg-[#ffffff] min-h-screen">
        <JobDetailSkeleton />
      </div>
    );

  if (notFound) {
    return (
      <div className="bg-[#ffffff] min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl font-bold text-[#1f2937] mb-3">
          Job Not Found
        </h1>

        <p className="text-[#9ca3af] mb-8">
          This role may have been filled or removed.
        </p>

        <Link
          href="/career"
          className="text-[#dc2626] hover:text-[#f87171] transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Careers
        </Link>
      </div>
    );
  }

  const salary =
    job.salaryMin && job.salaryMax
      ? `${job.currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
      : null;

  const metaDescription = job.description
    ?.replace(/<[^>]*>/g, "")
    .slice(0, 160);

  return (
    <>
      <div className="bg-[#f9fafb] min-h-screen">
        <div className="relative overflow-hidden bg-[#ffffff] border-b border-[#e5e7eb]">
          <div
            className="absolute inset-0 opacity-20"

            style={{
              backgroundImage:
                "radial-gradient(circle, #dc2626 1px, transparent 1px)",

              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-24 md:pt-32 pb-10 md:pb-12">
            <Link
              href="/career"

              className="inline-flex items-center gap-2 text-sm text-[#9ca3af] hover:text-[#dc2626] transition-colors mb-6"
            >
              <ArrowLeft size={14} /> Back to all roles
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div>
                <span className="text-xs font-semibold text-[#dc2626] uppercase tracking-widest">
                  {job.department}
                </span>

                <h1
                  className="text-3xl lg:text-5xl font-black text-[#1f2937] mt-2 mb-4"

                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  {job.title}
                </h1>

                <div className="flex flex-wrap gap-3 text-sm text-[#9ca3af]">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} /> {job.location}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Clock size={13} /> {job.employmentType}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <TrendingUp size={13} /> {job.experienceLevel}
                  </span>

                  {salary && (
                    <span className="flex items-center gap-1.5">
                      <IndianRupee size={13} /> {salary}
                    </span>
                  )}

                  {job.closingDate && (
                    <span className="flex items-center gap-1.5 text-[#dc2626]">
                      <Calendar size={13} /> Closes{" "}
                      {new Date(job.closingDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setShowApply(true)}

                className="shrink-0 w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#dc2626] text-[#ffffff] font-semibold hover:bg-[#f87171] transition-all shadow-lg shadow-[#dc2626]/20"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-2 space-y-8 min-w-0">
              {job.description && (
                <div className="bg-[#ffffff] border border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-[#1f2937] mb-4">
                    About the Role
                  </h2>

                  <div
                    className="max-w-none text-[#6b7280] text-sm leading-relaxed break-words overflow-hidden [&_p]:mb-4 [&_strong]:text-[#1f2937] [&_ul]:space-y-2 [&_li]:leading-relaxed"

                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                </div>
              )}

              <Section
                title="Responsibilities"
                items={job.responsibilities}
                icon={Briefcase}
              />

              <Section
                title="Requirements"
                items={job.requirements}
                icon={CheckCircle2}
              />

              <Section title="Benefits" items={job.benefits} icon={Users} />

              {job.skills?.length > 0 && (
                <div className="bg-[#ffffff] border border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-[#1f2937] mb-4">
                    Skills
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1.5 rounded-xl text-sm bg-[#f9fafb] border border-[#e5e7eb] text-[#dc2626] font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-[#ffffff] border border-[#e5e7eb] rounded-2xl p-8 text-center mt-8 shadow-sm">
                <h3 className="text-xl font-bold text-[#1f2937] mb-2">
                  Ready to Apply?
                </h3>

                <p className="text-[#9ca3af] text-sm mb-6">
                  Take the next step in your career journey.
                </p>

                <button
                  onClick={() => setShowApply(true)}

                  className="px-8 py-3 rounded-xl bg-[#dc2626] text-[#ffffff] font-semibold hover:bg-[#f87171] transition-all shadow-lg shadow-[#dc2626]/20"
                >
                  Submit Your Application
                </button>
              </div>
            </div>

            <div className="space-y-5 lg:sticky lg:top-24 self-start">
              <div className="bg-[#ffffff] border border-[#e5e7eb] rounded-2xl p-5 text-sm shadow-sm w-full overflow-hidden">
                <h4 className="text-[#1f2937] font-semibold mb-4">
                  Role Details
                </h4>

                {[
                  { label: "Department", value: job.department },

                  { label: "Location", value: job.location },

                  { label: "Type", value: job.employmentType },

                  { label: "Level", value: job.experienceLevel },

                  salary ? { label: "Salary", value: salary } : null,

                  {
                    label: "Posted",

                    value: new Date(job.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }),
                  },
                ]

                  .filter(Boolean)

                  .map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex justify-between gap-4 py-2 border-b border-[#e5e7eb] last:border-0"
                    >
                      <span className="text-[#9ca3af]">{label}</span>

                      <span className="text-[#1f2937] font-medium text-right max-w-[60%] break-words">
                        {value}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {similar.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-bold text-[#1f2937] mb-6">
                Similar Roles
              </h2>

              <div className="grid md:grid-cols-3 gap-5">
                {similar.map((j, i) => (
                  <JobCard key={j._id} job={j} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showApply && <ApplyForm job={job} onClose={() => setShowApply(false)} />}
    </>
  );
};

export default JobDetail;

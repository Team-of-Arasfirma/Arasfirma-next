"use client";

import { motion } from "framer-motion";

import {
  MapPin,
  Clock,
  TrendingUp,
  IndianRupee,
  ArrowRight,
  Star,
} from "lucide-react";

import Link from "next/link";

const TYPE_COLORS = {
  "Full-time": "bg-[#f9fafb] text-[#dc2626] border-[#e5e7eb]",

  "Part-time": "bg-[#ffffff] text-[#1f2937] border-[#e5e7eb]",

  Contract: "bg-[#ffffff] text-[#1f2937] border-[#e5e7eb]",

  Freelance: "bg-[#ffffff] text-[#1f2937] border-[#e5e7eb]",

  Internship: "bg-[#f9fafb] text-[#dc2626] border-[#e5e7eb]",
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatSalary = (min, max, currency = "USD") => {
  if (!min && !max) return null;

  const fmt = (n) =>
    new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 0,
    }).format(n);

  if (min && max) return `${currency} ${fmt(min)} - ${fmt(max)}`;

  if (min) return `${currency} ${fmt(min)}+`;

  return `Up to ${currency} ${fmt(max)}`;
};

const JobCard = ({ job, index = 0 }) => {
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.currency);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}

      animate={{ opacity: 1, y: 0 }}

      transition={{ duration: 0.4, delay: index * 0.06 }}

      className="group relative bg-[#ffffff] border border-[#e5e7eb] rounded-2xl p-6 shadow-sm hover:border-[#f87171] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#dc2626]/10"
    >
      {job.featured && (
        <span className="absolute top-4 right-4 flex items-center gap-1 text-xs font-semibold text-[#dc2626] bg-[#f9fafb] border border-[#e5e7eb] rounded-full px-2.5 py-1">
          <Star size={10} fill="currentColor" /> Featured
        </span>
      )}

      <div className="mb-4 pr-20">
        <span className="text-xs font-semibold text-[#dc2626] uppercase tracking-widest">
          {job.department}
        </span>

        <h3 className="text-lg font-bold text-[#1f2937] mt-1 group-hover:text-[#dc2626] transition-colors line-clamp-2">
          {job.title}
        </h3>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
            TYPE_COLORS[job.employmentType] ||
            "bg-[#ffffff] text-[#9ca3af] border-[#e5e7eb]"
          }`}
        >
          <Clock size={10} />

          {job.employmentType}
        </span>

        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-[#f9fafb] text-[#9ca3af] border-[#e5e7eb]">
          <MapPin size={10} />

          {job.location}
        </span>

        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-[#f9fafb] text-[#9ca3af] border-[#e5e7eb]">
          <TrendingUp size={10} />

          {job.experienceLevel}
        </span>
      </div>

      {job.description && (
        <p
          className="text-sm text-[#9ca3af] line-clamp-2 mb-4 leading-relaxed"

          dangerouslySetInnerHTML={{
            __html: job.description.replace(/<[^>]*>/g, ""),
          }}
        />
      )}

      <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-[#e5e7eb]">
        <div className="flex flex-col gap-1 min-w-0">
          {salary && (
            <span className="flex items-center gap-1 text-sm font-semibold text-[#1f2937]">
              <IndianRupee size={13} className="text-[#dc2626]" />

              {salary}
            </span>
          )}

          <span className="text-xs text-[#9ca3af]">
            Posted {formatDate(job.createdAt)}
          </span>
        </div>

        <Link
          href={`/career/${job.slug}`}

          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#dc2626] hover:text-[#ffffff] bg-[#ffffff] hover:bg-[#dc2626] border border-[#e5e7eb] hover:border-[#dc2626] px-4 py-2 rounded-xl transition-all duration-200 group/btn shrink-0"
        >
          Apply
          <ArrowRight
            size={14}
            className="group-hover/btn:translate-x-0.5 transition-transform"
          />
        </Link>
      </div>
    </motion.div>
  );
};

export default JobCard;

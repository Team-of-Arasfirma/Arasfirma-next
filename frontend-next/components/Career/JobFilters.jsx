import { Search, X, SlidersHorizontal } from "lucide-react";

const JobFilters = ({ filters, onChange, filterOptions, onClear }) => {
  const handleChange = (key, value) => onChange({ ...filters, [key]: value });

  const hasActive =
    filters.search ||
    filters.department ||
    filters.location ||
    filters.employmentType;

  return (
    <div className="bg-[#ffffff] border border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-[#1f2937] font-semibold">
          <SlidersHorizontal size={16} className="text-[#dc2626]" />
          Filters
        </div>
        {hasActive && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-[#9ca3af] hover:text-[#dc2626] transition-colors"
          >
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      <div className="relative mb-4">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
        />
        <input
          type="text"
          placeholder="Search jobs..."
          value={filters.search || ""}
          onChange={(e) => handleChange("search", e.target.value)}
          className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#1f2937] placeholder-[#9ca3af] focus:outline-none focus:border-[#dc2626] focus:bg-[#ffffff] transition-colors"
        />
      </div>

      {filterOptions.departments?.length > 0 && (
        <div className="mb-4">
          <label className="block text-xs text-[#9ca3af] uppercase tracking-widest mb-2">
            Department
          </label>
          <select
            value={filters.department || ""}
            onChange={(e) => handleChange("department", e.target.value)}
            className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-3 py-2.5 text-sm text-[#1f2937] focus:outline-none focus:border-[#dc2626] focus:bg-[#ffffff] transition-colors appearance-none"
          >
            <option value="">All Departments</option>
            {filterOptions.departments.map((d) => (
              <option key={d} value={d} className="bg-[#ffffff]">
                {d}
              </option>
            ))}
          </select>
        </div>
      )}

      {filterOptions.locations?.length > 0 && (
        <div className="mb-4">
          <label className="block text-xs text-[#9ca3af] uppercase tracking-widest mb-2">
            Location
          </label>
          <select
            value={filters.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-3 py-2.5 text-sm text-[#1f2937] focus:outline-none focus:border-[#dc2626] focus:bg-[#ffffff] transition-colors appearance-none"
          >
            <option value="">All Locations</option>
            {filterOptions.locations.map((l) => (
              <option key={l} value={l} className="bg-[#ffffff]">
                {l}
              </option>
            ))}
          </select>
        </div>
      )}

      {filterOptions.types?.length > 0 && (
        <div className="mb-4">
          <label className="block text-xs text-[#9ca3af] uppercase tracking-widest mb-2">
            Job Type
          </label>
          <div className="flex flex-wrap gap-2">
            {filterOptions.types.map((t) => (
              <button
                key={t}
                onClick={() =>
                  handleChange(
                    "employmentType",
                    filters.employmentType === t ? "" : t,
                  )
                }
                className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all ${
                  filters.employmentType === t
                    ? "bg-[#dc2626] border-[#dc2626] text-[#ffffff] shadow-sm"
                    : "bg-[#ffffff] border-[#e5e7eb] text-[#9ca3af] hover:text-[#dc2626] hover:border-[#f87171]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobFilters;

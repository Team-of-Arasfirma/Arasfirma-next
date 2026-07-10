export const JobCardSkeleton = () => (
  <div className="bg-[#ffffff] border border-[#e5e7eb] rounded-2xl p-6 shadow-sm animate-pulse">
    <div className="h-3 w-24 bg-[#e5e7eb] rounded mb-3" />
    <div className="h-5 w-3/4 bg-[#e5e7eb] rounded mb-4" />
    <div className="flex gap-2 mb-4">
      <div className="h-6 w-20 bg-[#e5e7eb] rounded-full" />
      <div className="h-6 w-24 bg-[#e5e7eb] rounded-full" />
      <div className="h-6 w-20 bg-[#e5e7eb] rounded-full" />
    </div>
    <div className="h-3 w-full bg-[#e5e7eb] rounded mb-2" />
    <div className="h-3 w-5/6 bg-[#e5e7eb] rounded mb-6" />
    <div className="flex justify-between items-center pt-4 border-t border-[#e5e7eb]">
      <div className="h-4 w-24 bg-[#e5e7eb] rounded" />
      <div className="h-8 w-20 bg-[#e5e7eb] rounded-lg" />
    </div>
  </div>
);

export const JobDetailSkeleton = () => (
  <div className="animate-pulse max-w-4xl mx-auto px-6 py-16">
    <div className="h-4 w-32 bg-[#e5e7eb] rounded mb-8" />
    <div className="h-10 w-2/3 bg-[#e5e7eb] rounded mb-4" />
    <div className="flex gap-3 mb-10">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-7 w-24 bg-[#e5e7eb] rounded-full" />
      ))}
    </div>
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-4 w-full bg-[#e5e7eb] rounded" />
      ))}
    </div>
  </div>
);

export const EmptyState = ({ message = "No jobs found", subtitle }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center bg-[#ffffff] border border-[#e5e7eb] rounded-2xl shadow-sm">
    <div className="w-20 h-20 rounded-2xl bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-center mb-6">
      <svg
        className="w-10 h-10 text-[#dc2626]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-[#1f2937] mb-2">{message}</h3>
    {subtitle && <p className="text-[#9ca3af] text-sm max-w-xs">{subtitle}</p>}
  </div>
);

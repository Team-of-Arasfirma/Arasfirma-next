"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Briefcase,
  Globe,
  FileText,
  Archive,
  Loader2,
  Star,
  Filter,
} from "lucide-react";
import {
  adminFetchJobs,
  adminDeleteJob,
  adminToggleJobStatus,
  adminFetchJobStats,
} from "@/lib/services/jobService";
import toast from "react-hot-toast";
import AddEditJob from "./AddEditJob";
import { useAuth } from "../context/AuthContext";
import { canCreate, canEdit, canDelete } from "@/lib/adminPermissions";
import AccessDeniedModal from "@/components/Admin/common/AccessDeniedModal";

const STATUS_BADGE = {
  Published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Draft: "bg-slate-100 text-slate-600 border-slate-200",
  Closed: "bg-rose-50 text-rose-700 border-rose-200",
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </p>
      </div>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
      >
        <Icon size={22} />
      </div>
    </div>
  </div>
);

const LoadingRows = () => (
  <>
    {Array.from({ length: 6 }).map((_, i) => (
      <tr key={i} className="animate-pulse border-b border-slate-100">
        {Array.from({ length: 7 }).map((__, j) => (
          <td key={j} className="px-5 py-5">
            <div className="h-4 w-24 rounded bg-slate-100" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

const EmptyState = ({ onCreate }) => (
  <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
      <Briefcase size={28} />
    </div>

    <h3 className="text-lg font-semibold text-slate-900">No jobs available</h3>

    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
      Create your first job opening or adjust the search and status filters.
    </p>

    <button
      type="button"
      onClick={onCreate}
      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-md"
    >
      <Plus size={16} /> Add Job
    </button>
  </div>
);

const AdminCareers = () => {
  const { user, admin } = useAuth();
  const activeUser = user || admin;

  const allowCreate = canCreate(activeUser, "careers");
  const allowEdit = canEdit(activeUser, "careers");
  const allowDelete = canDelete(activeUser, "careers");

  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    publishedJobs: 0,
    draftJobs: 0,
    closedJobs: 0,
  });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editJob, setEditJob] = useState(null);
  const [deniedMessage, setDeniedMessage] = useState("");

  const showDenied = (message) => {
    setDeniedMessage(message);
  };

  const load = useCallback(
    async (page = 1) => {
      setLoading(true);

      try {
        const [jobData, statData] = await Promise.all([
          adminFetchJobs({ search, status: statusFilter, page, limit: 10 }),
          adminFetchJobStats(),
        ]);

        setJobs(jobData.jobs || []);

        setStats({
          totalJobs: statData.totalJobs || 0,
          publishedJobs: statData.publishedJobs || 0,
          draftJobs:
            statData.draftJobs ??
            Math.max(
              (statData.totalJobs || 0) - (statData.publishedJobs || 0),
              0
            ),
          closedJobs: statData.closedJobs || 0,
        });

        setPagination({
          page: jobData.page || page,
          pages: jobData.pages || 1,
          total: jobData.total || 0,
        });
      } catch (error) {
        if (error?.response?.status === 403) {
          showDenied("You don't have permission to view careers.");
        } else {
          toast.error("Failed to load jobs");
        }
      } finally {
        setLoading(false);
      }
    },
    [search, statusFilter]
  );

  useEffect(() => {
    const timeout = setTimeout(() => load(1), 250);
    return () => clearTimeout(timeout);
  }, [load]);

  const createJob = () => {
    if (!allowCreate) {
      showDenied("You don't have permission to create careers.");
      return;
    }

    setEditJob({});
  };

  const openEditJob = (job) => {
    if (!allowEdit) {
      showDenied("You don't have permission to edit careers.");
      return;
    }

    setEditJob(job);
  };

  const handleDelete = async (id) => {
    if (!allowDelete) {
      showDenied("You don't have permission to delete careers.");
      return;
    }

    if (!window.confirm("Delete this job? This cannot be undone.")) return;

    try {
      await adminDeleteJob(id);
      toast.success("Job deleted");
      load(pagination.page);
    } catch (error) {
      if (error?.response?.status === 403) {
        showDenied("You don't have permission to delete careers.");
      } else {
        toast.error("Failed to delete job");
      }
    }
  };

  const handleToggle = async (id) => {
    if (!allowEdit) {
      showDenied("You don't have permission to update career status.");
      return;
    }

    try {
      await adminToggleJobStatus(id);
      toast.success("Status updated");
      load(pagination.page);
    } catch (error) {
      if (error?.response?.status === 403) {
        showDenied("You don't have permission to update career status.");
      } else {
        toast.error("Failed to update status");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Admin Dashboard
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Careers
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage job openings, publishing status, and applications.
            </p>
          </div>

          <button
            type="button"
            onClick={createJob}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
          >
            <Plus size={17} /> Add Job
          </button>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Briefcase}
            label="Total Jobs"
            value={stats.totalJobs}
            color="bg-blue-50 text-blue-600"
          />
          <StatCard
            icon={Globe}
            label="Active Jobs"
            value={stats.publishedJobs}
            color="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            icon={FileText}
            label="Draft Jobs"
            value={stats.draftJobs}
            color="bg-amber-50 text-amber-600"
          />
          <StatCard
            icon={Archive}
            label="Closed Jobs"
            value={stats.closedJobs}
            color="bg-slate-100 text-slate-600"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4 sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Job Listings
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {pagination.total} jobs found
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 sm:w-80">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title, department, location..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                <div className="relative">
                  <Filter
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full min-w-40 rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50 sm:w-auto"
                  >
                    <option value="">All Status</option>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur">
                <tr className="border-b border-slate-200">
                  {[
                    "Job Title",
                    "Department",
                    "Location",
                    "Type",
                    "Status",
                    "Applications",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {loading ? (
                  <LoadingRows />
                ) : jobs.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState onCreate={createJob} />
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr
                      key={job._id}
                      className="transition-colors hover:bg-blue-50/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                            <Briefcase size={16} />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="truncate font-semibold text-slate-900">
                                {job.title}
                              </span>

                              {job.featured && (
                                <Star
                                  size={13}
                                  className="shrink-0 text-amber-500"
                                  fill="currentColor"
                                />
                              )}
                            </div>

                            <span className="mt-1 block truncate text-xs text-slate-400">
                              /{job.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-600">
                        {job.department}
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {job.location}
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {job.employmentType}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                            STATUS_BADGE[job.status] || STATUS_BADGE.Draft
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-700">
                        {job.applicationCount || 0}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggle(job._id)}
                            title={
                              job.status === "Published"
                                ? "Unpublish"
                                : "Publish"
                            }
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          >
                            {job.status === "Published" ? (
                              <EyeOff size={15} />
                            ) : (
                              <Eye size={15} />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditJob(job)}
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(job._id)}
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="text-sm text-slate-500">
              Page{" "}
              <span className="font-semibold text-slate-700">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {pagination.pages}
              </span>
            </div>

            {loading ? (
              <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                <Loader2 size={15} className="animate-spin" /> Loading
              </div>
            ) : (
              pagination.pages > 1 && (
                <div className="flex flex-wrap gap-2">
                  {Array.from(
                    { length: pagination.pages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => load(page)}
                      className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition ${
                        page === pagination.page
                          ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {editJob !== null && (
        <AddEditJob
          job={Object.keys(editJob).length === 0 ? null : editJob}
          onClose={() => setEditJob(null)}
          onSaved={() => {
            setEditJob(null);
            load(pagination.page);
          }}
        />
      )}

      <AccessDeniedModal
        open={Boolean(deniedMessage)}
        message={deniedMessage}
        onClose={() => setDeniedMessage("")}
      />
    </div>
  );
};

export default AdminCareers;
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Download,
  Trash2,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Mail,
  FileText,
  Loader2,
  Filter,
  Briefcase,
  FileDown,
} from "lucide-react";
import {
  adminFetchApplications,
  adminUpdateApplicationStatus,
  adminDeleteApplication,
  adminFetchApplicationStats,
  adminGetApplicationById,
  buildResumeUrl,
} from "@/lib/services/applicationService";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { canEdit, canDelete } from "@/lib/adminPermissions";
import AccessDeniedModal from "@/components/Admin/common/AccessDeniedModal";

const STATUSES = ["New", "Reviewed", "Shortlisted", "Rejected"];

const STATUS_STYLES = {
  New: "bg-blue-50 text-blue-700 border-blue-200",
  Reviewed: "bg-slate-100 text-slate-700 border-slate-200",
  Shortlisted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
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
        {Array.from({ length: 9 }).map((__, j) => (
          <td key={j} className="px-5 py-5">
            <div className="h-4 w-24 rounded bg-slate-100" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
      <Users size={28} />
    </div>

    <h3 className="text-lg font-semibold text-slate-950">
      No applications found
    </h3>

    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
      Applications will appear here when candidates apply, or when your filters
      match existing records.
    </p>
  </div>
);

const DetailRow = ({ label, value }) => {
  if (!value) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-800">
        {value}
      </p>
    </div>
  );
};

const AdminApplications = () => {
  const { user, admin } = useAuth();
  const activeUser = user || admin;

  const allowEdit = canEdit(activeUser, "applications");
  const allowDelete = canDelete(activeUser, "applications");

  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    newApplications: 0,
    shortlisted: 0,
    rejected: 0,
    statusCounts: {},
  });
  const [filterOptions, setFilterOptions] = useState({
    jobTitles: [],
    statuses: STATUSES,
  });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [jobTitleFilter, setJobTitleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deniedMessage, setDeniedMessage] = useState("");

  const showDenied = (message) => {
    setDeniedMessage(message);
  };

  const load = useCallback(
    async (page = 1) => {
      setLoading(true);

      try {
        const [applicationData, statsData] = await Promise.all([
          adminFetchApplications({
            search,
            jobTitle: jobTitleFilter,
            status: statusFilter,
            page,
            limit: 10,
          }),
          adminFetchApplicationStats(),
        ]);

        setApplications(applicationData.applications || []);
        setFilterOptions(
          applicationData.filterOptions || {
            jobTitles: [],
            statuses: STATUSES,
          }
        );

        setPagination({
          page: applicationData.page || page,
          pages: applicationData.pages || 1,
          total: applicationData.total || 0,
        });

        setStats({
          totalApplications: statsData.totalApplications || 0,
          newApplications: statsData.newApplications || 0,
          shortlisted: statsData.shortlisted || 0,
          rejected: statsData.rejected || 0,
          statusCounts: statsData.statusCounts || {},
        });

        setSelectedIds([]);
      } catch (error) {
        if (error?.response?.status === 403) {
          showDenied("You don't have permission to view applications.");
        } else {
          toast.error("Failed to load applications");
        }
      } finally {
        setLoading(false);
      }
    },
    [jobTitleFilter, search, statusFilter]
  );

  useEffect(() => {
    const timeout = setTimeout(() => load(1), 250);
    return () => clearTimeout(timeout);
  }, [load]);

  const selectedCount = selectedIds.length;

  const allVisibleSelected = useMemo(
    () =>
      applications.length > 0 &&
      applications.every((app) => selectedIds.includes(app._id)),
    [applications, selectedIds]
  );

  const toggleAllVisible = () => {
    setSelectedIds(
      allVisibleSelected ? [] : applications.map((app) => app._id)
    );
  };

  const toggleSelected = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleStatus = async (id, status) => {
    if (!allowEdit) {
      showDenied("You don't have permission to update application status.");
      return;
    }

    try {
      await adminUpdateApplicationStatus(id, status);
      toast.success(`Status updated to ${status}`);
      load(pagination.page);
    } catch (error) {
      if (error?.response?.status === 403) {
        showDenied("You don't have permission to update application status.");
      } else {
        toast.error("Status update failed");
      }
    }
  };

  const handleBulkStatus = async (status) => {
    if (selectedIds.length === 0) return;

    if (!allowEdit) {
      showDenied("You don't have permission to bulk update applications.");
      return;
    }

    try {
      await Promise.all(
        selectedIds.map((id) => adminUpdateApplicationStatus(id, status))
      );

      toast.success(`${selectedIds.length} applications updated`);
      load(pagination.page);
    } catch (error) {
      if (error?.response?.status === 403) {
        showDenied("You don't have permission to bulk update applications.");
      } else {
        toast.error("Bulk update failed");
      }
    }
  };

  const confirmDelete = (application) => {
    if (!allowDelete) {
      showDenied("You don't have permission to delete applications.");
      return;
    }

    setDeleteTarget(application);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    if (!allowDelete) {
      showDenied("You don't have permission to delete applications.");
      setDeleteTarget(null);
      return;
    }

    try {
      await adminDeleteApplication(deleteTarget._id);

      toast.success("Application deleted");
      setDeleteTarget(null);
      load(pagination.page);
    } catch (error) {
      if (error?.response?.status === 403) {
        showDenied("You don't have permission to delete applications.");
      } else {
        toast.error("Delete failed");
      }
    }
  };

  const openDetail = async (application) => {
    setDetailLoading(true);
    setSelected(application);

    try {
      const data = await adminGetApplicationById(application._id);
      setSelected(data.application);
    } catch (error) {
      if (error?.response?.status === 403) {
        showDenied("You don't have permission to view this application.");
      } else {
        toast.error("Failed to load application");
      }
    } finally {
      setDetailLoading(false);
    }
  };

  const exportCsv = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Job Title",
      "Experience",
      "Status",
      "Applied Date",
    ];

    const rows = applications.map((app) => [
      app.name || app.fullName || "",
      app.email || "",
      app.phone || "",
      app.jobTitle || "",
      app.experience || "",
      app.status || "",
      app.createdAt ? new Date(app.createdAt).toLocaleString() : "",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "job-applications.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Admin Dashboard
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Applications
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Review applicants, manage status, and download resumes.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={exportCsv}
              disabled={applications.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileDown size={16} /> Export CSV
            </button>

            <a
              href="mailto:"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
            >
              <Mail size={16} /> Email Candidate
            </a>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Users}
            label="Total Applications"
            value={stats.totalApplications}
            color="bg-blue-50 text-blue-600"
          />
          <StatCard
            icon={Clock}
            label="New Applications"
            value={stats.newApplications}
            color="bg-sky-50 text-sky-600"
          />
          <StatCard
            icon={CheckCircle2}
            label="Shortlisted"
            value={stats.shortlisted}
            color="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            icon={XCircle}
            label="Rejected"
            value={stats.rejected}
            color="bg-rose-50 text-rose-600"
          />
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Application Analytics
              </h2>

              <p className="text-sm text-slate-500">
                Status distribution across all applications.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {STATUSES.map((status) => {
              const value = stats.statusCounts?.[status] || 0;
              const percent = stats.totalApplications
                ? Math.round((value / stats.totalApplications) * 100)
                : 0;

              return (
                <div key={status}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700">
                      {status}
                    </span>

                    <span className="text-slate-500">
                      {value} ({percent}%)
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all ${
                        status === "Rejected"
                          ? "bg-rose-500"
                          : status === "Shortlisted"
                            ? "bg-emerald-500"
                            : status === "Reviewed"
                              ? "bg-slate-500"
                              : "bg-blue-500"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_180px_auto]">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by candidate name or email..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div className="relative">
              <Briefcase
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={jobTitleFilter}
                onChange={(e) => setJobTitleFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              >
                <option value="">All Jobs</option>

                {filterOptions.jobTitles?.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Filter
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              >
                <option value="">All Status</option>

                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <select
              value=""
              onChange={(e) => {
                if (e.target.value) handleBulkStatus(e.target.value);
              }}
              disabled={selectedCount === 0}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">
                Bulk Update {selectedCount ? `(${selectedCount})` : ""}
              </option>

              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px] text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleAllVisible}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>

                  {[
                    "Candidate Name",
                    "Email",
                    "Phone",
                    "Applied Job Title",
                    "Experience",
                    "Resume File",
                    "Applied Date",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {loading ? (
                  <LoadingRows />
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan={10}>
                      <EmptyState />
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr
                      key={app._id}
                      className="transition-colors hover:bg-blue-50/40"
                    >
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(app._id)}
                          onChange={() => toggleSelected(app._id)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {app.name || app.fullName}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {app.email}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {app.phone}
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-700">
                        {app.jobTitle}
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {app.experience || "Not provided"}
                      </td>

                      <td className="px-5 py-4">
                        {app.resume ? (
                          <a
                            href={app.resumeUrl || buildResumeUrl(app.resume)}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-blue-600 transition hover:border-blue-200 hover:bg-blue-50"
                          >
                            <Download size={14} /> Download
                          </a>
                        ) : (
                          <span className="text-slate-400">No file</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {app.createdAt
                          ? new Date(app.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "-"}
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleStatus(app._id, e.target.value)
                          }
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold outline-none transition ${
                            STATUS_STYLES[app.status] || STATUS_STYLES.New
                          }`}
                        >
                          {STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openDetail(app)}
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            title="View application"
                          >
                            <Eye size={15} />
                          </button>

                          <a
                            href={`mailto:${app.email}`}
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            title="Email candidate"
                          >
                            <Mail size={15} />
                          </a>

                          <button
                            type="button"
                            onClick={() => confirmDelete(app)}
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                            title="Delete application"
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

          <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing page{" "}
              <span className="font-semibold text-slate-700">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {pagination.pages}
              </span>
            </p>

            {loading ? (
              <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                <Loader2 size={15} className="animate-spin" /> Loading
              </span>
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

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                  Application Details
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-950">
                  {selected.name || selected.fullName}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selected.jobTitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                x
              </button>
            </div>

            <div className="space-y-6 px-6 py-6">
              {detailLoading && (
                <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
                  <Loader2 size={16} className="animate-spin" /> Loading latest
                  details
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <DetailRow label="Email" value={selected.email} />
                <DetailRow label="Phone" value={selected.phone} />
                <DetailRow
                  label="Experience"
                  value={selected.experience || "Not provided"}
                />
                <DetailRow label="Status" value={selected.status} />
                <DetailRow label="Portfolio" value={selected.portfolio} />
                <DetailRow label="LinkedIn" value={selected.linkedin} />
              </div>

              {selected.skills?.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Skills
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {selected.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Cover Letter
                </p>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {selected.coverLetter || "No cover letter provided."}
                </div>
              </div>

              {selected.resume && (
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Resume
                  </p>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <FileText size={20} />
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {selected.resumeOriginalName || "Resume file"}
                          </p>

                          <p className="text-xs text-slate-500">
                            Preview or download candidate resume
                          </p>
                        </div>
                      </div>

                      <a
                        href={
                          selected.resumeUrl || buildResumeUrl(selected.resume)
                        }
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
                      >
                        <Download size={16} /> Download
                      </a>
                    </div>

                    <iframe
                      src={
                        selected.resumeUrl || buildResumeUrl(selected.resume)
                      }
                      title="Resume preview"
                      className="h-96 w-full rounded-xl border border-slate-200 bg-slate-50"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/20">
            <h3 className="text-lg font-bold text-slate-950">
              Delete application?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This will permanently remove{" "}
              {deleteTarget.name || deleteTarget.fullName}'s application.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-rose-600/20 transition hover:bg-rose-700"
              >
                Delete Application
              </button>
            </div>
          </div>
        </div>
      )}

      <AccessDeniedModal
        open={Boolean(deniedMessage)}
        message={deniedMessage}
        onClose={() => setDeniedMessage("")}
      />
    </div>
  );
};

export default AdminApplications;
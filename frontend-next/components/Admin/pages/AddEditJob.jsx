"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import ReactQuill from "react-quill-new";

import { adminCreateJob, adminUpdateJob } from "@/lib/services/jobService";
import toast from "react-hot-toast";

const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "Operations",
  "HR",
  "Finance",
  "Other",
];
const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
];
const EXPERIENCE_LEVELS = [
  "Entry Level",
  "Mid Level",
  "Senior Level",
  "Lead",
  "Manager",
];

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50";
const labelCls =
  "mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }],
    ["link"],
    ["clean"],
  ],
};

const buildSlug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const EMPTY = {
  title: "",
  slug: "",
  department: "",
  location: "",
  employmentType: "Full-time",
  experienceLevel: "Mid Level",
  salaryMin: "",
  salaryMax: "",
  currency: "USD",
  description: "",
  responsibilities: [""],
  requirements: [""],
  skills: [""],
  benefits: [""],
  status: "Draft",
  featured: false,
  closingDate: "",
};

const ListEditor = ({ label, items, onChange }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
    <label className={labelCls}>{label}</label>
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            className={`${inputCls} flex-1`}
            placeholder={`${label} item...`}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            title="Remove item"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 hover:text-blue-700"
      >
        <Plus size={13} /> Add item
      </button>
    </div>
  </div>
);

const AddEditJob = ({ job, onClose, onSaved }) => {
  const [form, setForm] = useState(
    job
      ? {
          ...job,
          salaryMin: job.salaryMin || "",
          salaryMax: job.salaryMax || "",
          closingDate: job.closingDate
            ? new Date(job.closingDate).toISOString().split("T")[0]
            : "",
          responsibilities: job.responsibilities?.length
            ? job.responsibilities
            : [""],
          requirements: job.requirements?.length ? job.requirements : [""],
          skills: job.skills?.length ? job.skills : [""],
          benefits: job.benefits?.length ? job.benefits : [""],
        }
      : EMPTY,
  );
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!job);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleTitle = (val) => {
    set("title", val);
    if (autoSlug) set("slug", buildSlug(val));
  };

  const handleSlugChange = (val) => {
    setAutoSlug(false);
    set("slug", val);
  };

  const handleSubmit = async () => {
    if (
      !form.title ||
      !form.department ||
      !form.location ||
      !form.description
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      ...form,
      salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
      responsibilities: form.responsibilities.filter(Boolean),
      requirements: form.requirements.filter(Boolean),
      skills: form.skills.filter(Boolean),
      benefits: form.benefits.filter(Boolean),
      closingDate: form.closingDate || null,
    };

    setSaving(true);
    try {
      if (job?._id) {
        await adminUpdateJob(job._id, payload);
        toast.success("Job updated!");
      } else {
        await adminCreateJob(payload);
        toast.success("Job created!");
      }
      onSaved();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20"
        >
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                {job ? "Edit Job" : "Create New Job"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Fill the role details and publishing settings.
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={19} />
            </button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto bg-white px-5 py-6 sm:px-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>
                  Job Title <span className="text-rose-500">*</span>
                </label>
                <input
                  value={form.title}
                  onChange={(e) => handleTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="auto-generated"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>
                  Department <span className="text-rose-500">*</span>
                </label>
                <select
                  value={form.department}
                  onChange={(e) => set("department", e.target.value)}
                  className={`${inputCls} appearance-none`}
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>
                  Location <span className="text-rose-500">*</span>
                </label>
                <input
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="e.g. Remote, New York, London"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Employment Type</label>
                <select
                  value={form.employmentType}
                  onChange={(e) => set("employmentType", e.target.value)}
                  className={`${inputCls} appearance-none`}
                >
                  {EMPLOYMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Experience Level</label>
                <select
                  value={form.experienceLevel}
                  onChange={(e) => set("experienceLevel", e.target.value)}
                  className={`${inputCls} appearance-none`}
                >
                  {EXPERIENCE_LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className={labelCls}>Min Salary</label>
                <input
                  type="number"
                  value={form.salaryMin}
                  onChange={(e) => set("salaryMin", e.target.value)}
                  placeholder="e.g. 80000"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Max Salary</label>
                <input
                  type="number"
                  value={form.salaryMax}
                  onChange={(e) => set("salaryMax", e.target.value)}
                  placeholder="e.g. 120000"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Currency</label>
                <select
                  value={form.currency}
                  onChange={(e) => set("currency", e.target.value)}
                  className={`${inputCls} appearance-none`}
                >
                  {["USD", "EUR", "GBP", "INR", "CAD", "AUD"].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className={labelCls}>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                  className={`${inputCls} appearance-none`}
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Closing Date</label>
                <input
                  type="date"
                  value={form.closingDate}
                  onChange={(e) => set("closingDate", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div className="flex flex-col justify-end">
                <button
                  type="button"
                  onClick={() => set("featured", !form.featured)}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <span className="text-sm font-semibold text-slate-700">
                    Featured Job
                  </span>
                  <span
                    className={`relative h-6 w-11 rounded-full transition-colors ${form.featured ? "bg-blue-600" : "bg-slate-300"}`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.featured ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label className={labelCls}>
                Job Description <span className="text-rose-500">*</span>
              </label>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white [&_.ql-container]:min-h-48 [&_.ql-container]:border-0 [&_.ql-editor]:min-h-48 [&_.ql-editor]:text-sm [&_.ql-editor]:text-slate-800 [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 [&_.ql-toolbar]:bg-slate-50">
                <ReactQuill
                  theme="snow"
                  value={form.description}
                  onChange={(val) => set("description", val)}
                  modules={quillModules}
                />
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <ListEditor
                label="Responsibilities"
                items={form.responsibilities}
                onChange={(v) => set("responsibilities", v)}
              />
              <ListEditor
                label="Requirements"
                items={form.requirements}
                onChange={(v) => set("requirements", v)}
              />
              <ListEditor
                label="Skills"
                items={form.skills}
                onChange={(v) => set("skills", v)}
              />
              <ListEditor
                label="Benefits"
                items={form.benefits}
                onChange={(v) => set("benefits", v)}
              />
            </div>
          </div>

          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && <Loader2 size={15} className="animate-spin" />}
              {saving ? "Saving..." : job ? "Save Changes" : "Create Job"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddEditJob;

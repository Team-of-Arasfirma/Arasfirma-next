"use client";

import { useState, useRef } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { X, Loader2, CheckCircle2, CloudUpload } from "lucide-react";

import { submitJobApplication } from "@/lib/services/jobService";

import toast from "react-hot-toast";

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-1.5">
      {label} {required && <span className="text-[#dc2626]">*</span>}
    </label>

    {children}
  </div>
);

const inputCls =
  "w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-sm text-[#1f2937] placeholder-[#9ca3af] focus:outline-none focus:border-[#dc2626] focus:bg-[#ffffff] transition-colors";

const ApplyForm = ({ job, onClose }) => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    portfolio: "",
    linkedin: "",
    coverLetter: "",
  });

  const [resume, setResume] = useState(null);

  const [dragging, setDragging] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const fileRef = useRef(null);

  const handle = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFile = (file) => {
    const allowed = [
      "application/pdf",
      "application/msword",

      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(file.type)) {
      toast.error("Only PDF and Word documents are accepted");

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5 MB");

      return;
    }

    setResume(file);
  };

  const onDrop = (e) => {
    e.preventDefault();

    setDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (file) handleFile(file);
  };

  const handleSubmit = async () => {
    if (!form.fullName || !form.email || !form.phone) {
      toast.error("Please fill in all required fields");

      return;
    }

    const data = new FormData();

    data.append("jobId", job._id);

    Object.entries(form).forEach(([k, v]) => data.append(k, v));

    if (resume) data.append("resume", resume);

    setSubmitting(true);

    try {
      await submitJobApplication(data);

      setSubmitted(true);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Application submit failed. Please try again.";

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}

        animate={{ opacity: 1 }}

        exit={{ opacity: 0 }}

        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f2937]/60 backdrop-blur-sm"

        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}

          animate={{ opacity: 1, scale: 1, y: 0 }}

          exit={{ opacity: 0, scale: 0.96, y: 20 }}

          transition={{ duration: 0.25 }}

          className="bg-[#ffffff] border border-[#e5e7eb] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-[#1f2937]/20"
        >
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-center mb-6">
                <CheckCircle2 size={28} className="text-[#dc2626]" />
              </div>

              <h3 className="text-2xl font-bold text-[#1f2937] mb-3">
                Application Submitted!
              </h3>

              <p className="text-[#9ca3af] text-sm mb-8 max-w-sm">
                Thank you for applying for{" "}
                <strong className="text-[#1f2937]">{job.title}</strong>. We'll
                review your application and get back to you soon.
              </p>

              <button
                onClick={onClose}

                className="px-6 py-2.5 rounded-xl bg-[#dc2626] text-[#ffffff] text-sm font-semibold hover:bg-[#f87171] transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between p-6 border-b border-[#e5e7eb]">
                <div>
                  <h2 className="text-xl font-bold text-[#1f2937]">
                    Apply for Position
                  </h2>

                  <p className="text-sm text-[#dc2626] mt-0.5">{job.title}</p>
                </div>

                <button
                  onClick={onClose}

                  className="p-2 rounded-xl hover:bg-[#f9fafb] text-[#9ca3af] hover:text-[#dc2626] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Full Name" required>
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={handle}

                      placeholder="Jane Smith"
                      className={inputCls}
                    />
                  </Field>

                  <Field label="Email" required>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handle}

                      placeholder="jane@example.com"
                      className={inputCls}
                    />
                  </Field>
                </div>

                <Field label="Phone" required>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handle}

                    placeholder="+1 555 000 0000"
                    className={inputCls}
                  />
                </Field>

                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Portfolio URL">
                    <input
                      name="portfolio"
                      value={form.portfolio}
                      onChange={handle}

                      placeholder="https://yoursite.com"
                      className={inputCls}
                    />
                  </Field>

                  <Field label="LinkedIn">
                    <input
                      name="linkedin"
                      value={form.linkedin}
                      onChange={handle}

                      placeholder="https://linkedin.com/in/..."
                      className={inputCls}
                    />
                  </Field>
                </div>

                <Field label="Resume">
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragging(true);
                    }}

                    onDragLeave={() => setDragging(false)}

                    onDrop={onDrop}

                    onClick={() => fileRef.current?.click()}

                    className={`flex flex-col items-center justify-center gap-3 py-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      dragging
                        ? "border-[#dc2626] bg-[#f9fafb]"
                        : "border-[#e5e7eb] hover:border-[#f87171] hover:bg-[#f9fafb]"
                    }`}
                  >
                    <CloudUpload size={28} className="text-[#9ca3af]" />

                    {resume ? (
                      <span className="text-sm text-[#dc2626] font-medium">
                        {resume.name}
                      </span>
                    ) : (
                      <>
                        <span className="text-sm text-[#9ca3af]">
                          Drag & drop or click to upload
                        </span>

                        <span className="text-xs text-[#9ca3af]">
                          PDF, DOC, DOCX - max 5 MB
                        </span>
                      </>
                    )}
                  </div>

                  <input
                    ref={fileRef}

                    type="file"

                    accept=".pdf,.doc,.docx"

                    className="hidden"

                    onChange={(e) =>
                      e.target.files?.[0] && handleFile(e.target.files[0])
                    }
                  />
                </Field>

                <Field label="Cover Letter">
                  <textarea
                    name="coverLetter"
                    value={form.coverLetter}
                    onChange={handle}

                    rows={4}

                    placeholder="Tell us why you're a great fit for this role..."

                    className={inputCls + " resize-none"}
                  />
                </Field>
              </div>

              <div className="p-6 border-t border-[#e5e7eb] flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={onClose}

                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#9ca3af] hover:text-[#1f2937] hover:bg-[#f9fafb] transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}

                  disabled={submitting}

                  className="flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl bg-[#dc2626] text-[#ffffff] text-sm font-semibold hover:bg-[#f87171] disabled:opacity-60 transition-all shadow-lg shadow-[#dc2626]/20"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}

                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ApplyForm;

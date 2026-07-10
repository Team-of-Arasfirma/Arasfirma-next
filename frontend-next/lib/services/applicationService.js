import axios from "@/lib/api/axios";

export const adminFetchApplications = (params = {}) =>
  axios.get("/admin/applications", { params }).then((r) => r.data);

export const adminFetchApplicationStats = () =>
  axios.get("/admin/applications/stats").then((r) => r.data);

export const adminGetApplicationById = (id) =>
  axios.get(`/admin/applications/${id}`).then((r) => r.data);

export const adminUpdateApplicationStatus = (id, status) =>
  axios
    .patch(`/admin/applications/${id}/status`, { status })
    .then((r) => r.data);

export const adminDeleteApplication = (id) =>
  axios.delete(`/admin/applications/${id}`).then((r) => r.data);

export const buildResumeUrl = (resume) => {
  if (!resume) return "";
  if (/^https?:\/\//i.test(resume)) return resume;
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  return `${apiBase.replace(/\/api\/?$/, "")}/${resume.replace(/^\/+/, "")}`;
};

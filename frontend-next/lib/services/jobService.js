import axios from "@/lib/api/axios";

const inflightRequests = new Map();

const stableStringify = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return JSON.stringify(value ?? null);
  }

  return JSON.stringify(
    Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = value[key];
        return acc;
      }, {}),
  );
};

const requestOnce = (key, factory) => {
  if (inflightRequests.has(key)) {
    return inflightRequests.get(key);
  }

  const promise = Promise.resolve()
    .then(factory)
    .finally(() => inflightRequests.delete(key));

  inflightRequests.set(key, promise);
  return promise;
};

// Public
export const fetchPublicJobs = (params = {}) =>
  requestOnce(`GET:/jobs:${stableStringify(params)}`, () =>
    axios.get("/jobs", { params }).then((r) => r.data),
  );

export const fetchJobBySlug = (slug) =>
  requestOnce(`GET:/jobs/${slug}`, () =>
    axios.get(`/jobs/${slug}`).then((r) => r.data),
  );

export const submitJobApplication = (formData) =>
  axios
    .post("/jobs/apply", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);

// Admin
export const adminFetchJobs = (params = {}) =>
  axios.get("/admin/jobs", { params }).then((r) => r.data);

export const adminFetchJobStats = () =>
  axios.get("/admin/jobs/stats").then((r) => r.data);

export const adminCreateJob = (data) =>
  axios.post("/admin/jobs", data).then((r) => r.data);

export const adminUpdateJob = (id, data) =>
  axios.put(`/admin/jobs/${id}`, data).then((r) => r.data);

export const adminDeleteJob = (id) =>
  axios.delete(`/admin/jobs/${id}`).then((r) => r.data);

export const adminToggleJobStatus = (id) =>
  axios.patch(`/admin/jobs/${id}/toggle-status`).then((r) => r.data);

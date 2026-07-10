import api from "@/lib/api/axios";

export const createInquiry = async (data) => {
  const response = await api.post("/inquiries", data);
  return response.data;
};

export const adminFetchInquiries = async (params = {}) => {
  const response = await api.get("/inquiries", { params });
  return response.data;
};

export const adminFetchInquiryById = async (id) => {
  const response = await api.get(`/inquiries/${id}`);
  return response.data;
};

export const adminUpdateInquiryStatus = async (id, status) => {
  const response = await api.put(`/inquiries/${id}/status`, { status });
  return response.data;
};

export const adminDeleteInquiry = async (id) => {
  const response = await api.delete(`/inquiries/${id}`);
  return response.data;
};

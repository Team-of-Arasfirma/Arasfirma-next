"use client";
// src/admin/pages/Redirects.jsx

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import api from "@/lib/api/axios";
import { useAuth } from "../context/AuthContext";
import { canCreate, canEdit, canDelete } from "@/lib/adminPermissions";
import AccessDeniedModal from "@/components/Admin/common/AccessDeniedModal";

const Spinner = () => (
  <div className="flex items-center justify-center py-10">
    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const initialForm = { from: "", to: "" };

export default function Redirects() {
  const { user, admin } = useAuth();
  const activeUser = user || admin;

  const allowCreate = canCreate(activeUser, "redirects");
  const allowEdit = canEdit(activeUser, "redirects");
  const allowDelete = canDelete(activeUser, "redirects");

  const [redirects, setRedirects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editRedirect, setEditRedirect] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [selected, setSelected] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [deniedMessage, setDeniedMessage] = useState("");

  const LIMIT = 25;

  const showDenied = (message) => {
    setDeniedMessage(message);
  };

  const fetchRedirects = useCallback(async () => {
    setLoading(true);

    try {
      const params = { page, limit: LIMIT };

      if (search) params.search = search;

      const { data } = await api.get("/redirects", { params });

      setRedirects(data.data || []);
      setPagination(data.pagination || {});
    } catch (err) {
      if (err?.response?.status === 403) {
        showDenied("You don't have permission to view redirects.");
      } else {
        toast.error("Failed to load redirects");
      }
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchRedirects();
  }, [fetchRedirects]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const openAdd = () => {
    if (!allowCreate) {
      showDenied("You don't have permission to create redirects.");
      return;
    }

    setEditRedirect(null);
    setForm(initialForm);
    setShowModal(true);
  };

  const openEdit = (redirect) => {
    if (!allowEdit) {
      showDenied("You don't have permission to edit redirects.");
      return;
    }

    setEditRedirect(redirect);
    setForm({ from: redirect.from, to: redirect.to });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditRedirect(null);
    setForm(initialForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editRedirect && !allowEdit) {
      showDenied("You don't have permission to edit redirects.");
      return;
    }

    if (!editRedirect && !allowCreate) {
      showDenied("You don't have permission to create redirects.");
      return;
    }

    if (!form.from || !form.to) {
      toast.error("Both fields are required");
      return;
    }

    setSaving(true);

    try {
      if (editRedirect) {
        await api.put(`/redirects/${editRedirect._id}`, form);
        toast.success("Redirect updated");
      } else {
        await api.post("/redirects", form);
        toast.success("Redirect created");
      }

      closeModal();
      fetchRedirects();
    } catch (err) {
      if (err?.response?.status === 403) {
        showDenied("You don't have permission to save redirects.");
      } else {
        toast.error(err.response?.data?.message || "Something went wrong");
      }
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id) => {
    if (!allowDelete) {
      showDenied("You don't have permission to delete redirects.");
      return;
    }

    setDeleteId(id);
  };

  const handleDelete = async () => {
    if (!allowDelete) {
      showDenied("You don't have permission to delete redirects.");
      setDeleteId(null);
      return;
    }

    try {
      await api.delete(`/redirects/${deleteId}`);

      toast.success("Redirect deleted");
      setDeleteId(null);
      fetchRedirects();
    } catch (err) {
      if (err?.response?.status === 403) {
        showDenied("You don't have permission to delete redirects.");
      } else {
        toast.error("Delete failed");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (!selected.length) return;

    if (!allowDelete) {
      showDenied("You don't have permission to delete redirects.");
      return;
    }

    try {
      await api.delete("/redirects/bulk", { data: { ids: selected } });

      toast.success(`${selected.length} redirect(s) deleted`);
      setSelected([]);
      fetchRedirects();
    } catch (err) {
      if (err?.response?.status === 403) {
        showDenied("You don't have permission to delete redirects.");
      } else {
        toast.error("Bulk delete failed");
      }
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelected(
      selected.length === redirects.length ? [] : redirects.map((r) => r._id)
    );
  };

  return (
    <div className="p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">URL Redirects</h1>

          <p className="text-sm text-gray-500 mt-0.5">
            {pagination.total ?? 0} redirect{pagination.total !== 1 ? "s" : ""}{" "}
            total
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create URL Redirect
        </button>
      </div>

      {/* SEARCH + BULK DELETE */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>

          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Filter items..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {selected.length > 0 && (
          <button
            type="button"
            onClick={handleBulkDelete}
            className="flex items-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete {selected.length} selected
          </button>
        )}
      </div>

      {/* TABLE */}
      {loading ? (
        <Spinner />
      ) : redirects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-gray-700">
            No redirects found
          </h3>

          <p className="text-sm text-gray-400 mt-1">
            Create your first URL redirect to get started
          </p>

          <button
            type="button"
            onClick={openAdd}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Create URL Redirect
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={
                        selected.length === redirects.length &&
                        redirects.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Redirect From
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Redirect To
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {redirects.map((redirect) => (
                  <tr
                    key={redirect._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(redirect._id)}
                        onChange={() => toggleSelect(redirect._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700 font-mono">
                        {redirect.from}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700 font-mono">
                        {redirect.to}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(redirect)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => confirmDelete(redirect._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                {(page - 1) * LIMIT + 1}–
                {Math.min(page * LIMIT, pagination.total)} of {pagination.total}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPage((p) => Math.min(pagination.pages, p + 1))
                  }
                  disabled={page === pagination.pages}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative min-h-screen flex items-start justify-center p-4 pt-20">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>

                  <h2 className="text-lg font-bold text-gray-800">
                    {editRedirect ? "Edit URL Redirect" : "Create URL Redirect"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-5">
                <div className="flex gap-6">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Redirect from
                    </label>

                    <p className="text-xs text-gray-400 mb-2">
                      The original URL you want to forward visitors from.
                    </p>

                    <input
                      type="text"
                      name="from"
                      value={form.from}
                      onChange={handleChange}
                      placeholder="e.g., /blog/old-slug"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-300">
                  <div className="flex-1 h-px bg-gray-100" />
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Redirect to
                  </label>

                  <p className="text-xs text-gray-400 mb-2">
                    The new URL visitors should be forwarded to.
                  </p>

                  <input
                    type="text"
                    name="to"
                    value={form.to}
                    onChange={handleChange}
                    placeholder="e.g., /new-slug"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Redirect"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h3 className="text-base font-bold text-gray-800 text-center">
              Delete Redirect?
            </h3>

            <p className="text-sm text-gray-500 text-center mt-1">
              This action cannot be undone.
            </p>

            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium"
              >
                Delete
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
}
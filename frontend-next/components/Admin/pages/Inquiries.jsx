"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  adminDeleteInquiry,
  adminFetchInquiries,
  adminUpdateInquiryStatus,
} from "@/lib/services/inquiryService";

import { useAuth } from "../context/AuthContext";
import { canEdit, canDelete } from "@/lib/adminPermissions";
import AccessDeniedModal from "@/components/Admin/common/AccessDeniedModal";

const PAGE_LIMITS = [20, 100, 500, 2500];

const getVisiblePages = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    totalPages,
  ];
};

const AdminInquiries = () => {
  const { user, admin } = useAuth();
  const activeUser = user || admin;

  const allowEdit = canEdit(activeUser, "inquiries");
  const allowDelete = canDelete(activeUser, "inquiries");

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [limit, setLimit] = useState(20);

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deniedMessage, setDeniedMessage] = useState("");

  const showDenied = (message) => {
    setDeniedMessage(message);
  };

  const load = useCallback(
    async (page = 1) => {
      setLoading(true);

      try {
        const data = await adminFetchInquiries({
          search,
          status,
          page,
          limit,
        });

        setInquiries(data.inquiries || []);

        setPagination({
          page: data.page || page,
          pages: data.pages || 1,
          total: data.total || 0,
        });
      } catch (err) {
        if (err?.response?.status === 403) {
          showDenied(
            "You don't have permission to view inquiries.",
          );
        } else {
          toast.error(
            err.response?.data?.message ||
              "Failed to load inquiries",
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [search, status, limit],
  );

  useEffect(() => {
    const timeout = setTimeout(() => load(1), 250);

    return () => clearTimeout(timeout);
  }, [load]);

  useEffect(() => {
    const interval = setInterval(
      () => load(pagination.page),
      60000,
    );

    return () => clearInterval(interval);
  }, [load, pagination.page]);

  const handleLimitChange = (size) => {
    setLimit(size);

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const handleStatus = async (item) => {
    if (!allowEdit) {
      showDenied(
        "You don't have permission to update inquiry status.",
      );

      return;
    }

    try {
      await adminUpdateInquiryStatus(
        item._id,
        item.status === "read" ? "unread" : "read",
      );

      toast.success("Inquiry status updated");

      load(pagination.page);
    } catch (err) {
      if (err?.response?.status === 403) {
        showDenied(
          "You don't have permission to update inquiry status.",
        );
      } else {
        toast.error("Status update failed");
      }
    }
  };

  const confirmDelete = (id) => {
    if (!allowDelete) {
      showDenied(
        "You don't have permission to delete inquiries.",
      );

      return;
    }

    setDeleteId(id);
  };

  const handleDelete = async () => {
    if (!allowDelete) {
      showDenied(
        "You don't have permission to delete inquiries.",
      );

      setDeleteId(null);

      return;
    }

    try {
      await adminDeleteInquiry(deleteId);

      toast.success("Inquiry deleted");

      setDeleteId(null);

      load(pagination.page);
    } catch (err) {
      if (err?.response?.status === 403) {
        showDenied(
          "You don't have permission to delete inquiries.",
        );
      } else {
        toast.error("Delete failed");
      }
    }
  };

  const totalPages = Math.max(
    Number(pagination.pages || 1),
    1,
  );

  const currentPage = Math.min(
    Number(pagination.page || 1),
    totalPages,
  );

  const visiblePages = getVisiblePages(
    currentPage,
    totalPages,
  );

  return (
    <div className="p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Inquiry Management
          </h1>

          <p className="text-sm text-gray-500 mt-0.5">
            {pagination.total} inquir
            {pagination.total === 1 ? "y" : "ies"} total
          </p>
        </div>
      </div>

      {/* SEARCH + STATUS */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative max-w-sm flex-1">
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inquiries..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
          No inquiries found.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Name",
                    "Type",
                    "Email",
                    "Phone",
                    "Subject",
                    "Status",
                    "Date",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {inquiries.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* NAME */}
                    <td className="px-4 py-3 font-medium text-gray-800 text-sm">
                      {item.name}

                      {item.isQuote &&
                        item.businessName &&
                        item.businessName !== item.name && (
                          <span className="block text-xs font-normal text-gray-400 mt-0.5">
                            {item.businessName}
                          </span>
                        )}
                    </td>

                    {/* TYPE */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          item.isQuote
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-purple-100 text-purple-800 border border-purple-200"
                        }`}
                      >
                        {item.isQuote ? "Quote" : "Contact"}
                      </span>
                    </td>

                    {/* EMAIL */}
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.email}
                    </td>

                    {/* PHONE */}
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.phone || "-"}
                    </td>

                    {/* SUBJECT */}
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div>
                        <span className="font-medium text-gray-800">
                          {item.subject}
                        </span>

                        {item.isQuote && (
                          <span className="block text-[11px] text-blue-600 font-medium mt-0.5">
                            City: {item.city || "-"} | Sq Ft:{" "}
                            {item.sqFt || "-"}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleStatus(item)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                          item.status === "read"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        }`}
                      >
                        {item.status}
                      </button>
                    </td>

                    {/* DATE */}
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(
                        item.createdAt,
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelected(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            confirmDelete(item._id)
                          }
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-4 py-4 border-t border-gray-100">
            {/* PAGE INFO */}
            <p className="text-sm text-gray-500 shrink-0">
              Page {currentPage} of {totalPages}
            </p>

            {/* PAGE NUMBERS */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {visiblePages.map((pageNumber, index) => {
                  const previousPage =
                    visiblePages[index - 1];

                  const showDots =
                    index > 0 &&
                    pageNumber - previousPage > 1;

                  return (
                    <div
                      key={pageNumber}
                      className="flex items-center gap-1.5"
                    >
                      {showDots && (
                        <span className="px-1 text-sm text-gray-400">
                          ...
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => load(pageNumber)}
                        className={`min-w-[34px] h-8 px-2 rounded-lg text-sm font-medium transition-all ${
                          currentPage === pageNumber
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* LIMIT SELECTOR */}
            <div className="inline-flex items-center bg-gray-100 border border-gray-200 rounded-full p-1 w-fit shrink-0">
              {PAGE_LIMITS.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() =>
                    handleLimitChange(size)
                  }
                  className={`min-w-[42px] px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    limit === size
                      ? "bg-white text-gray-800 shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {selected && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />

          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-800">
                      {selected.subject}
                    </h2>

                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                        selected.isQuote
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-purple-100 text-purple-800 border border-purple-200"
                      }`}
                    >
                      {selected.isQuote
                        ? "Quote Request"
                        : "Standard Inquiry"}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 mt-1">
                    Received on{" "}
                    {new Date(
                      selected.createdAt,
                    ).toLocaleString("en-GB")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl focus:outline-none"
                >
                  &times;
                </button>
              </div>

              {selected.isQuote && (
                <div className="bg-blue-50/70 border border-blue-100/50 rounded-xl p-4 mb-4 space-y-2 text-sm shadow-inner">
                  <h3 className="font-bold text-blue-900 text-xs uppercase tracking-wider mb-2">
                    Quote Requirements
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-semibold text-gray-500 block">
                        Business Name
                      </span>

                      <span className="text-gray-800 font-medium">
                        {selected.businessName ||
                          selected.name}
                      </span>
                    </div>

                    <div>
                      <span className="font-semibold text-gray-500 block">
                        City
                      </span>

                      <span className="text-gray-800 font-medium">
                        {selected.city || "-"}
                      </span>
                    </div>

                    <div className="col-span-2">
                      <span className="font-semibold text-gray-500 block">
                        Approx. Area Required
                      </span>

                      <span className="text-gray-800 font-medium">
                        {selected.sqFt || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3 text-sm">
                <p>
                  <span className="font-semibold text-gray-600">
                    Contact Person:
                  </span>{" "}
                  {selected.name}
                </p>

                <p>
                  <span className="font-semibold text-gray-600">
                    Email Address:
                  </span>{" "}

                  <a
                    href={`mailto:${selected.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {selected.email}
                  </a>
                </p>

                <p>
                  <span className="font-semibold text-gray-600">
                    Mobile Number:
                  </span>{" "}
                  {selected.phone || "-"}
                </p>

                <p>
                  <span className="font-semibold text-gray-600">
                    Status:
                  </span>{" "}

                  <span
                    className={`capitalize font-semibold ${
                      selected.status === "unread"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {selected.status}
                  </span>
                </p>

                <div className="border-t border-gray-100 pt-3">
                  <p className="font-semibold text-gray-600 mb-1">
                    Message Content:
                  </p>

                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap bg-gray-50 p-3 rounded-xl border border-gray-100 max-h-48 overflow-y-auto">
                    {selected.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-base font-bold text-gray-800 text-center">
              Delete Inquiry?
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
};

export default AdminInquiries;
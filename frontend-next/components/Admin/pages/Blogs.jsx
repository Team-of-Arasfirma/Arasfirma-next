"use client";
// src/admin/pages/Blogs.jsx

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import api from "@/lib/api/axios";
import RichTextEditor from "@/components/forms/RichTextEditor";
import { fetchBlogs as fetchBlogCollection } from "@/lib/services/blogService";
import { useAuth } from "../context/AuthContext";
import { canCreate, canEdit, canDelete } from "@/lib/adminPermissions";
import AccessDeniedModal from "@/components/Admin/common/AccessDeniedModal";

const CATEGORIES = [
  "General",
  "Roofing",
  "Cold Storage",
  "Installation",
  "Poultry Farming",
  "Agriculture",
];

const generateSlug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const cleanBlogContent = (html) => {
  if (!html) return "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  doc.body.querySelectorAll("*").forEach((el) => {
    el.removeAttribute("style");
    el.removeAttribute("bgcolor");
    el.removeAttribute("color");
    el.removeAttribute("face");
    el.removeAttribute("size");

    if (el.getAttribute("class") === "") {
      el.removeAttribute("class");
    }

    if (el.tagName === "A") {
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    }
  });

  return doc.body.innerHTML
    .replace(/&nbsp;/g, " ")
    .replace(/background-color\s*:\s*[^;"]+;?/gi, "")
    .replace(/background\s*:\s*[^;"]+;?/gi, "")
    .trim();
};

const initialForm = {
  title: "",
  slug: "",
  content: "",
  image: "",
  author: "Admin",
  category: "General",
  published: false,
  metaTitle: "",
  metaDescription: "",
};

const Spinner = () => (
  <div className="flex items-center justify-center py-10">
    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const badgeColor = (category) => {
  const map = {
    Roofing: "bg-red-100 text-red-700",
    "Cold Storage": "bg-cyan-100 text-cyan-700",
    Installation: "bg-green-100 text-green-700",
    "Poultry Farming": "bg-yellow-100 text-yellow-700",
    Agriculture: "bg-lime-100 text-lime-700",
    General: "bg-gray-100 text-gray-700",
  };

  return map[category] || "bg-gray-100 text-gray-700";
};

export default function Blogs() {
  const { user, admin } = useAuth();
  const activeUser = user || admin;

  const allowCreate = canCreate(activeUser, "blogs");
  const allowEdit = canEdit(activeUser, "blogs");
  const allowDelete = canDelete(activeUser, "blogs");

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editBlog, setEditBlog] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [imagePreview, setImagePreview] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [deniedMessage, setDeniedMessage] = useState("");

  const LIMIT = 8;

  const showDenied = (message) => {
    setDeniedMessage(message);
  };

  const fetchBlogs = useCallback(async () => {
    setLoading(true);

    try {
      const params = { page, limit: LIMIT };

      if (search) params.search = search;

      const { blogs: apiBlogs, pagination } = await fetchBlogCollection(params);

      setBlogs(apiBlogs || []);
      setPagination(pagination || {});
    } catch (error) {
      if (error?.response?.status === 403) {
        showDenied("You don't have permission to view blogs.");
      } else {
        toast.error("Failed to load blogs");
      }
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const openAdd = () => {
    if (!allowCreate) {
      showDenied("You don't have permission to create blogs.");
      return;
    }

    setEditBlog(null);
    setForm(initialForm);
    setImagePreview("");
    setShowModal(true);
  };

  const openEdit = (blog) => {
    if (!allowEdit) {
      showDenied("You don't have permission to edit blogs.");
      return;
    }

    setEditBlog(blog);

    setForm({
      title: blog.title || "",
      slug: blog.slug || "",
      content: blog.content || "",
      image: blog.image || "",
      author: blog.author || "Admin",
      category: blog.category || "General",
      published: blog.published || false,
      metaTitle: blog.metaTitle || "",
      metaDescription: blog.metaDescription || "",
    });

    setImagePreview(blog.image || "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditBlog(null);
    setForm(initialForm);
    setImagePreview("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setForm((prev) => {
      const updated = { ...prev, [name]: newValue };

      if (name === "title" && !editBlog) {
        updated.slug = generateSlug(value);
      }

      return updated;
    });
  };

  const handleImageUpload = async (e) => {
    if (!allowCreate && !allowEdit) {
      showDenied("You don't have permission to upload blog images.");
      return;
    }

    const file = e.target.files[0];

    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP allowed");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm((prev) => ({ ...prev, image: data.imageUrl }));
      toast.success("Image uploaded");
    } catch (error) {
      if (error?.response?.status === 403) {
        showDenied("You don't have permission to upload blog images.");
      } else {
        toast.error("Image upload failed");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editBlog && !allowEdit) {
      showDenied("You don't have permission to edit blogs.");
      return;
    }

    if (!editBlog && !allowCreate) {
      showDenied("You don't have permission to create blogs.");
      return;
    }

    const cleanedHtmlContent = cleanBlogContent(form.content);
    const cleanedTextContent = cleanedHtmlContent
      .replace(/<[^>]+>/g, "")
      .trim();

    if (!form.title || !form.slug || !cleanedTextContent) {
      toast.error("Title, slug, and content are required");
      return;
    }

    const payload = {
      ...form,
      content: cleanedHtmlContent,
    };

    setSaving(true);

    try {
      if (editBlog) {
        await api.put(`/blogs/${editBlog._id}`, payload);
        toast.success("Blog updated successfully");
      } else {
        await api.post("/blogs", payload);
        toast.success("Blog created successfully");
      }

      closeModal();
      fetchBlogs();
    } catch (err) {
      if (err?.response?.status === 403) {
        showDenied("You don't have permission to save this blog.");
      } else {
        toast.error(err.response?.data?.message || "Something went wrong");
      }
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id) => {
    if (!allowDelete) {
      showDenied("You don't have permission to delete blogs.");
      return;
    }

    setDeleteId(id);
  };

  const handleDelete = async () => {
    if (!allowDelete) {
      showDenied("You don't have permission to delete blogs.");
      return;
    }

    try {
      await api.delete(`/blogs/${deleteId}`);

      toast.success("Blog deleted");
      setDeleteId(null);
      fetchBlogs();
    } catch (error) {
      if (error?.response?.status === 403) {
        showDenied("You don't have permission to delete blogs.");
      } else {
        toast.error("Delete failed");
      }
    }
  };

  const togglePublished = async (blog) => {
    if (!allowEdit) {
      showDenied("You don't have permission to update blog status.");
      return;
    }

    try {
      await api.put(`/blogs/${blog._id}`, {
        ...blog,
        published: !blog.published,
      });

      toast.success(blog.published ? "Set to Draft" : "Published");
      fetchBlogs();
    } catch (error) {
      if (error?.response?.status === 403) {
        showDenied("You don't have permission to update blog status.");
      } else {
        toast.error("Update failed");
      }
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Blog Management</h1>

          <p className="text-sm text-gray-500 mt-0.5">
            {pagination.total ?? 0} blog
            {pagination.total !== 1 ? "s" : ""} total
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
          Add Blog
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-5">
        <div className="relative max-w-sm">
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
            placeholder="Search blogs..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <Spinner />
      ) : blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-gray-700">
            No blogs found
          </h3>

          <p className="text-sm text-gray-400 mt-1">
            Add your first blog to get started
          </p>

          <button
            type="button"
            onClick={openAdd}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Add Blog
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                    Author
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {blogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      {blog.image ? (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-12 h-10 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src =
                              "https://placehold.co/48x40?text=No+Img";
                          }}
                        />
                      ) : (
                        <div className="w-12 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4-4a3 3 0 014 0l4 4m0 0l-1-1a3 3 0 014 0l3 3M9 10a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 text-sm line-clamp-1">
                        {blog.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        /{blog.slug}
                      </p>
                    </td>

                    <td className="px-4 py-3 hidden md:table-cell">
                      <span
                        className={`inline-flex items-center justify-center w-32 h-7 rounded-full text-xs font-semibold whitespace-nowrap overflow-hidden text-ellipsis ${badgeColor(
                          blog.category
                        )}`}
                      >
                        {blog.category || "General"}
                      </span>
                    </td>

                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-gray-600">
                        {blog.author}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => togglePublished(blog)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                          blog.published
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            blog.published ? "bg-green-500" : "bg-yellow-500"
                          }`}
                        />
                        {blog.published ? "Published" : "Draft"}
                      </button>
                    </td>

                    <td className="px-4 py-3 hidden lg:table-cell text-sm text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(blog)}
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
                          onClick={() => confirmDelete(blog._id)}
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

          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.pages}
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

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative min-h-screen flex items-start justify-center p-4 pt-10">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">
                  {editBlog ? "Edit Blog" : "Add New Blog"}
                </h2>

                <button
                  type="button"
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter blog title"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug <span className="text-red-500">*</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      name="slug"
                      value={form.slug}
                      onChange={handleChange}
                      placeholder="auto-generated-from-title"
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          slug: generateSlug(prev.title),
                        }))
                      }
                      className="px-3 py-2.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Auto
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>

                  <div className="flex flex-wrap items-center gap-2">
                    {CATEGORIES.map((cat) => {
                      const colorMap = {
                        Roofing:
                          form.category === cat
                            ? "bg-red-600 text-white"
                            : "bg-red-100 text-red-700",
                        "Cold Storage":
                          form.category === cat
                            ? "bg-cyan-600 text-white"
                            : "bg-cyan-100 text-cyan-700",
                        Installation:
                          form.category === cat
                            ? "bg-green-600 text-white"
                            : "bg-green-100 text-green-700",
                        "Poultry Farming":
                          form.category === cat
                            ? "bg-yellow-500 text-white"
                            : "bg-yellow-100 text-yellow-700",
                        Agriculture:
                          form.category === cat
                            ? "bg-lime-600 text-white"
                            : "bg-lime-100 text-lime-700",
                        General:
                          form.category === cat
                            ? "bg-gray-700 text-white"
                            : "bg-gray-100 text-gray-700",
                      };

                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({ ...prev, category: cat }))
                          }
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${colorMap[cat]}`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Content <span className="text-red-500">*</span>
                  </label>

                  <RichTextEditor
                    value={form.content}
                    onChange={(val) =>
                      setForm((prev) => ({ ...prev, content: val }))
                    }
                    placeholder="Write blog content..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blog Image
                  </label>

                  <div className="flex items-start gap-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-xl p-4 text-center transition-colors">
                        {uploading ? (
                          <div className="flex items-center justify-center gap-2 text-blue-500">
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm">Uploading...</span>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400">
                            Click to upload JPG, PNG, WEBP
                          </p>
                        )}
                      </div>

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>

                    {imagePreview && (
                      <div className="relative w-28 h-20 flex-shrink-0">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg border border-gray-200"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview("");
                            setForm((prev) => ({ ...prev, image: "" }));
                          }}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Search Engine Listing
                    </h3>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="bg-white border border-gray-100 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-2">Preview</p>
                      <p className="text-xs text-green-700">
                        arasfirma.com › {form.slug || "blog-slug"}
                      </p>
                      <p className="text-base text-blue-600 font-medium leading-snug mt-0.5 line-clamp-1">
                        {form.metaTitle || form.title || "Page Title"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {form.metaDescription ||
                          "Meta description will appear here..."}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-sm font-medium text-gray-700">
                          Meta Title
                        </label>

                        <span
                          className={`text-xs ${
                            form.metaTitle.length > 60
                              ? "text-red-500"
                              : "text-gray-400"
                          }`}
                        >
                          {form.metaTitle.length} / 60
                        </span>
                      </div>

                      <input
                        type="text"
                        name="metaTitle"
                        value={form.metaTitle}
                        onChange={handleChange}
                        placeholder={form.title || "Enter meta title"}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-sm font-medium text-gray-700">
                          Meta Description
                        </label>

                        <span
                          className={`text-xs ${
                            form.metaDescription.length > 160
                              ? "text-red-500"
                              : "text-gray-400"
                          }`}
                        >
                          {form.metaDescription.length} / 160
                        </span>
                      </div>

                      <textarea
                        name="metaDescription"
                        value={form.metaDescription}
                        onChange={handleChange}
                        placeholder="Enter meta description"
                        rows={3}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Publish Blog
                    </p>

                    <p className="text-xs text-gray-400 mt-0.5">
                      {form.published
                        ? "Visible on public website"
                        : "Saved as draft"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        published: !prev.published,
                      }))
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                      form.published ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                        form.published ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
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
                    disabled={saving || uploading}
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {editBlog ? "Saving..." : "Creating..."}
                      </>
                    ) : editBlog ? (
                      "Save Changes"
                    ) : (
                      "Create Blog"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              ⚠️
            </div>

            <h3 className="text-base font-bold text-gray-800 text-center">
              Delete Blog?
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
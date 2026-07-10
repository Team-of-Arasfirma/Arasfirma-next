"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import api from "@/lib/api/axios";
import { useAuth } from "../context/AuthContext";
import { canCreate, canEdit, canDelete } from "@/lib/adminPermissions";
import AccessDeniedModal from "@/components/Admin/common/AccessDeniedModal";

const EMPTY = {
  title: "",
  description: "",
  client: "",
  completionDate: "",
  technologies: "",
  link: "",
  images: [],
};

const fileUrl = (src) => {
  if (!src) return "";

  if (src.startsWith("http")) {
    return src;
  }

  return `http://localhost:5000${src}`;
};

export default function AdminProjects() {
  const { user, admin } = useAuth();
  const activeUser = user || admin;

  const allowCreate = canCreate(activeUser, "projects");
  const allowEdit = canEdit(activeUser, "projects");
  const allowDelete = canDelete(activeUser, "projects");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [deniedMessage, setDeniedMessage] = useState("");

  const fileRef = useRef(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const showDenied = (message) => {
    setDeniedMessage(message);
  };

  const fetchProjects = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await api.get("/projects");
      setProjects(Array.isArray(data) ? data : data?.data || data?.projects || []);
    } catch (error) {
      if (error?.response?.status === 403) {
        showDenied("You don't have permission to view projects.");
      } else {
        showToast("Failed to load projects", "error");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetchProjects(), 0);
    return () => clearTimeout(timeout);
  }, [fetchProjects]);

  const openCreate = () => {
    if (!allowCreate) {
      showDenied("You don't have permission to create projects.");
      return;
    }

    setForm(EMPTY);
    setEditId(null);
    setImageFiles([]);
    setImagePreviews([]);
    setShowModal(true);
  };

  const openEdit = (project) => {
    if (!allowEdit) {
      showDenied("You don't have permission to edit projects.");
      return;
    }

    setForm({
      title: project.title || "",
      description: project.description || "",
      client: project.client || "",
      completionDate: project.completionDate
        ? project.completionDate.substring(0, 10)
        : "",
      technologies: (project.technologies || []).join(", "),
      link: project.link || "",
      images: project.images || [],
    });

    setEditId(project._id);
    setImageFiles([]);
    setImagePreviews((project.images || []).map(fileUrl));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(EMPTY);
    setEditId(null);
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleImagesChange = (e) => {
    if (editId && !allowEdit) {
      showDenied("You don't have permission to edit project images.");
      return;
    }

    if (!editId && !allowCreate) {
      showDenied("You don't have permission to upload project images.");
      return;
    }

    const files = Array.from(e.target.files || []);

    setImageFiles(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const uploadImages = async () => {
    if (!imageFiles.length) {
      return form.images;
    }

    const formData = new FormData();

    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    const { data } = await api.post("/upload/multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data.imageUrls || [];
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (editId && !allowEdit) {
      showDenied("You don't have permission to edit projects.");
      return;
    }

    if (!editId && !allowCreate) {
      showDenied("You don't have permission to create projects.");
      return;
    }

    setSaving(true);

    try {
      const images = await uploadImages();

      const payload = {
        ...form,
        technologies: form.technologies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        completionDate: form.completionDate || undefined,
        images,
      };

      if (editId) {
        await api.put(`/projects/${editId}`, payload);
      } else {
        await api.post("/projects", payload);
      }

      showToast(editId ? "Project updated!" : "Project created!");
      closeModal();
      fetchProjects();
    } catch (error) {
      if (error?.response?.status === 403) {
        showDenied("You don't have permission to save projects.");
      } else {
        showToast("Failed to save", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!allowDelete) {
      showDenied("You don't have permission to delete projects.");
      return;
    }

    if (!confirm("Delete this project?")) {
      return;
    }

    try {
      await api.delete(`/projects/${id}`);

      showToast("Project deleted");
      fetchProjects();
    } catch (error) {
      if (error?.response?.status === 403) {
        showDenied("You don't have permission to delete projects.");
      } else {
        showToast("Delete failed", "error");
      }
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Project Management
        </h2>

        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          + Add Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
          <p>No projects yet.</p>

          <button
            type="button"
            onClick={openCreate}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            + Add Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {project.images?.[0] ? (
                <img
                  src={fileUrl(project.images[0])}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}

              <div className="p-4">
                <h3 className="font-semibold text-gray-900">
                  {project.title}
                </h3>

                {project.client && (
                  <p className="text-xs text-gray-500 mt-1">
                    Client: {project.client}
                  </p>
                )}

                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {project.description}
                </p>

                {project.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.map((technology, index) => (
                      <span
                        key={`${technology}-${index}`}
                        className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => openEdit(project)}
                    className="flex-1 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(project._id)}
                    className="flex-1 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                {editId ? "Edit Project" : "Add Project"}
              </h3>

              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Images
                </label>

                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-400 transition-colors"
                >
                  {imagePreviews.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {imagePreviews.map((src, index) => (
                        <img
                          key={`${src}-${index}`}
                          src={src}
                          alt="Project preview"
                          loading="lazy"
                          className="h-20 w-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-400 text-sm">
                      Click to upload images
                    </p>
                  )}
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="hidden"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>

                <input
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client
                  </label>

                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.client}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, client: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Completion Date
                  </label>

                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.completionDate}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        completionDate: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>

                <textarea
                  required
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technologies comma-separated
                </label>

                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.technologies}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      technologies: e.target.value,
                    }))
                  }
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Link
                </label>

                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.link}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, link: e.target.value }))
                  }
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                >
                  {saving ? "Saving..." : editId ? "Update" : "Create"}
                </button>
              </div>
            </form>
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
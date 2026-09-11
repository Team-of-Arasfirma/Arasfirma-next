"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  categoryOptions,
  formatTitleCase,
  fileUrl,
  getProjectImage,
  getProjectImages,
  isPublicProject,
  listProjects,
  saveProject,
  deleteProject,
  uploadProjectImages,
  FALLBACK_IMAGE,
} from "@/lib/services/projectService";
import { useAuth } from "../context/AuthContext";
import { canCreate, canEdit, canDelete } from "@/lib/adminPermissions";
import AccessDeniedModal from "@/components/Admin/common/AccessDeniedModal";

const EMPTY = { title: "", category: "", status: "draft", images: [] };
const CATEGORIES = [
  "Industrial Building",
  "Warehouses",
  "Commercial Building",
  "Cold Storage",
  "Agriculture",
];

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
  const [selectedImages, setSelectedImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [deniedMessage, setDeniedMessage] = useState("");

  const categories = categoryOptions([
    ...CATEGORIES,
    ...projects.map((project) => project.category),
  ]);
  const fileRef = useRef(null);
  const previewUrls = useRef(new Set());

  const clearSelectedImages = () => {
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrls.current.clear();
    setSelectedImages([]);
  };

  useEffect(() => {
    const urls = previewUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

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
      setProjects(await listProjects());
    } catch (error) {
      if (error?.response?.status === 403) {
        showDenied("You don't have permission to view projects.");
      } else {
        showToast(
          error?.response?.data?.message ||
            error.message ||
            "Failed to load projects",
          "error",
        );
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
    clearSelectedImages();
    setShowModal(true);
  };

  const openEdit = (project) => {
    if (!allowEdit) {
      showDenied("You don't have permission to edit projects.");
      return;
    }

    setForm({
      title: project.title || project.name || "",
      category: project.category || "",
      status: isPublicProject(project) ? "published" : "draft",
      images: getProjectImages(project),
    });
    setEditId(project._id);
    clearSelectedImages();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(EMPTY);
    setEditId(null);
    clearSelectedImages();
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
    e.target.value = "";
    if (selectedImages.length + files.length > 5) {
      showToast("Choose up to five new images at a time.", "error");
      return;
    }
    if (
      files.some(
        (file) =>
          !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
          file.size > 5 * 1024 * 1024,
      )
    ) {
      showToast("Choose JPG, PNG, or WebP images up to 5 MB each.", "error");
      return;
    }
    const additions = files.map((file) => {
      const url = URL.createObjectURL(file);
      previewUrls.current.add(url);
      return { file, url };
    });
    setSelectedImages((previous) => [...previous, ...additions]);
  };

  const removeSelectedImage = (url) => {
    URL.revokeObjectURL(url);
    previewUrls.current.delete(url);
    setSelectedImages((previous) =>
      previous.filter((image) => image.url !== url),
    );
  };

  const uploadImages = async () => {
    if (!selectedImages.length) return form.images;
    const uploaded = await uploadProjectImages(
      selectedImages.map(({ file }) => file),
    );
    const images = [...form.images, ...uploaded];
    // Retain uploaded URLs if saving the project fails, so a retry does not upload twice.
    setForm((previous) => ({ ...previous, images }));
    clearSelectedImages();
    return images;
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

    if (saving) return;
    if (!form.title.trim() || !form.category.trim()) {
      showToast("Title and category are required.", "error");
      return;
    }
    setSaving(true);

    try {
      const images = await uploadImages();

      const payload = {
        title: form.title.trim(),
        category: form.category.trim(),
        status: form.status,
        images,
      };

      await saveProject(editId, payload);

      showToast(editId ? "Project updated!" : "Project created!");
      closeModal();
      fetchProjects();
    } catch (error) {
      if (error?.response?.status === 403) {
        showDenied("You don't have permission to save projects.");
      } else {
        showToast(
          error?.response?.data?.message || error.message || "Failed to save",
          "error",
        );
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
      await deleteProject(id);

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
        <h2 className="text-2xl font-bold text-gray-800">Project Management</h2>

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
              {getProjectImages(project).length > 0 ? (
                <img
                  src={getProjectImage(project)}
                  onError={(event) => {
                    if (event.currentTarget.src !== FALLBACK_IMAGE)
                      event.currentTarget.src = FALLBACK_IMAGE;
                  }}
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
                <h3 className="font-semibold text-gray-900">{project.title}</h3>

                <p className="text-gray-500 text-sm mt-1">
                  {formatTitleCase(project.category)}
                </p>
                <span
                  className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${isPublicProject(project) ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}
                >
                  {isPublicProject(project) ? "Published" : "Draft"}
                </span>

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
        <div className="fixed inset-0 z-40 bg-black/10 flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b flex justify-between items-center">
              <h3
                id="project-modal-title"
                className="text-lg font-bold text-gray-800"
              >
                {editId ? "Edit Project" : "Add Project"}
              </h3>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close project modal"
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6">
              <fieldset disabled={saving} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Images
                  </label>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="flex flex-wrap gap-2">
                      {form.images.map((src, index) => (
                        <div key={`${src}-${index}`} className="relative">
                          <img
                            src={fileUrl(src)}
                            alt={`Saved project image ${index + 1}`}
                            className="h-20 w-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            aria-label={`Remove saved image ${index + 1}`}
                            onClick={() =>
                              setForm((previous) => ({
                                ...previous,
                                images: previous.images.filter(
                                  (_, i) => i !== index,
                                ),
                              }))
                            }
                            className="absolute -top-2 -right-2 rounded-full bg-white shadow h-6 w-6 text-red-600"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                      {selectedImages.map(({ url }, index) => (
                        <div key={url} className="relative">
                          <img
                            src={url}
                            alt={`Selected project image ${index + 1}`}
                            className="h-20 w-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            aria-label={`Remove selected image ${index + 1}`}
                            onClick={() => removeSelectedImage(url)}
                            className="absolute -top-2 -right-2 rounded-full bg-white shadow h-6 w-6 text-red-600"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-700"
                    >
                      Choose images (optional)
                    </button>
                  </div>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
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

                <div>
                  <label
                    htmlFor="project-category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category *
                  </label>
                  <input
                    id="project-category"
                    list="project-category-options"
                    required
                    value={form.category}
                    onChange={(e) =>
                      setForm((previous) => ({
                        ...previous,
                        category: e.target.value,
                      }))
                    }
                    placeholder="Choose or type a category"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm capitalize focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <datalist id="project-category-options">
                    {categories.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label
                    htmlFor="project-status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="project-status"
                    value={form.status}
                    onChange={(e) =>
                      setForm((previous) => ({
                        ...previous,
                        status: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
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
              </fieldset>
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

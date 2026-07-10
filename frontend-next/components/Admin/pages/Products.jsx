"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import api from "@/lib/api/axios";
import { useAuth } from "../context/AuthContext";
import { canCreate, canEdit, canDelete } from "@/lib/adminPermissions";
import AccessDeniedModal from "@/components/Admin/common/AccessDeniedModal";

const EMPTY = {
  name: "",
  slug: "",
  description: "",
  category: "",
  price: "",
  features: "",
  inStock: true,
  images: [],
};

const fileUrl = (src) => {
  if (!src) return "";

  if (src.startsWith("http")) {
    return src;
  }

  return `http://localhost:5000${src}`;
};

export default function AdminProducts() {
  const { user, admin } = useAuth();
  const activeUser = user || admin;

  const allowCreate = canCreate(activeUser, "products");
  const allowEdit = canEdit(activeUser, "products");
  const allowDelete = canDelete(activeUser, "products");

  const [products, setProducts] = useState([]);
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

  const fetchProducts = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await api.get("/products");
      setProducts(Array.isArray(data) ? data : data?.data || data?.products || []);
    } catch (error) {
      if (error?.response?.status === 403) {
        showDenied("You don't have permission to view products.");
      } else {
        showToast("Failed to load products", "error");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetchProducts(), 0);
    return () => clearTimeout(timeout);
  }, [fetchProducts]);

  const openCreate = () => {
    if (!allowCreate) {
      showDenied("You don't have permission to create products.");
      return;
    }

    setForm(EMPTY);
    setEditId(null);
    setImageFiles([]);
    setImagePreviews([]);
    setShowModal(true);
  };

  const openEdit = (product) => {
    if (!allowEdit) {
      showDenied("You don't have permission to edit products.");
      return;
    }

    setForm({
      name: product.name || "",
      slug: product.slug || "",
      description: product.description || "",
      category: product.category || "",
      price: product.price || "",
      features: (product.features || []).join("\n"),
      inStock: product.inStock ?? true,
      images: product.images || [],
    });

    setEditId(product._id);
    setImageFiles([]);
    setImagePreviews((product.images || []).map(fileUrl));
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
      showDenied("You don't have permission to edit product images.");
      return;
    }

    if (!editId && !allowCreate) {
      showDenied("You don't have permission to upload product images.");
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
      showDenied("You don't have permission to edit products.");
      return;
    }

    if (!editId && !allowCreate) {
      showDenied("You don't have permission to create products.");
      return;
    }

    setSaving(true);

    try {
      const images = await uploadImages();

      const payload = {
        ...form,
        price: parseFloat(form.price),
        features: form.features
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        images,
      };

      if (editId) {
        await api.put(`/products/${editId}`, payload);
      } else {
        await api.post("/products", payload);
      }

      showToast(editId ? "Product updated!" : "Product created!");
      closeModal();
      fetchProducts();
    } catch (error) {
      if (error?.response?.status === 403) {
        showDenied("You don't have permission to save products.");
      } else {
        showToast("Failed to save", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!allowDelete) {
      showDenied("You don't have permission to delete products.");
      return;
    }

    if (!confirm("Delete this product?")) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);

      showToast("Product deleted");
      fetchProducts();
    } catch (error) {
      if (error?.response?.status === 403) {
        showDenied("You don't have permission to delete products.");
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
          Product Management
        </h2>

        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
        >
          + Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
          <p>No products yet.</p>

          <button
            type="button"
            onClick={openCreate}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
          >
            + Add Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {product.images?.[0] ? (
                <img
                  src={fileUrl(product.images[0])}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}

              <div className="p-4">
                <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  {product.category}
                </span>

                <h3 className="font-semibold text-gray-900 mt-2">
                  {product.name}
                </h3>

                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {product.description}
                </p>

                <p className="text-emerald-600 font-bold mt-2">
                  ₹{product.price}
                </p>

                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => openEdit(product)}
                    className="flex-1 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(product._id)}
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
                {editId ? "Edit Product" : "Add Product"}
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
                  Product Images
                </label>

                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-emerald-400 transition-colors"
                >
                  {imagePreviews.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {imagePreviews.map((src, index) => (
                        <img
                          key={`${src}-${index}`}
                          src={src}
                          alt="Product preview"
                          loading="lazy"
                          className="h-20 w-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-400 text-sm">
                      Click to upload images up to 5
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>

                  <input
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={form.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "");

                      setForm((prev) => ({ ...prev, name, slug }));
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug *
                  </label>

                  <input
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={form.slug}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, slug: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>

                  <input
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={form.category}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹) *
                  </label>

                  <input
                    required
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={form.price}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, price: e.target.value }))
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
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  Features one per line
                </label>

                <textarea
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  value={form.features}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, features: e.target.value }))
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={form.inStock}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      inStock: e.target.checked,
                    }))
                  }
                  className="rounded"
                />

                <label
                  htmlFor="inStock"
                  className="text-sm font-medium text-gray-700"
                >
                  In Stock
                </label>
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
                  className="px-6 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-medium"
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